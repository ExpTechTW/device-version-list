"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Loader2, ArrowRight } from "lucide-react"
import { BrandIcon } from "./brand-icon"

// 從名稱生成 slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function fetchCSV(filepath: string) {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/${filepath}`;
    const res = await fetch(url, { cache: 'force-cache' });

    if (!res.ok) return null;

    const content = await res.text();
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        // 如果有 name 但沒有 id/slug，自動生成
        if (row['name'] && !row['id']) {
          row['id'] = generateSlug(row['name']);
          row['slug'] = generateSlug(row['name']);
        }
        rows.push(row);
      }
    }

    return rows;
  } catch {
    return null;
  }
}

interface Device {
  id: string
  name: string
  slug: string
  type: 'ios' | 'android'
  brand?: string
  brandSlug?: string
}

export function DeviceSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [devices, setDevices] = React.useState<Device[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setDevices([])
      return
    }
  }, [open])

  const searchDevices = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setDevices([])
      return
    }

    setLoading(true)
    try {
      const [iosData, brandsData] = await Promise.all([
        fetchCSV('ios/devices.csv').catch(() => []),
        fetchCSV('android/brands.csv').catch(() => [])
      ])

      const results: Device[] = []
      const lowerQuery = searchQuery.toLowerCase()

      // 搜索 iOS 設備
      if (iosData && Array.isArray(iosData)) {
        for (const device of iosData) {
          if (device.name?.toLowerCase().includes(lowerQuery) ||
            device.slug?.toLowerCase().includes(lowerQuery)) {
            results.push({
              id: device.id,
              name: device.name,
              slug: device.slug,
              type: 'ios',
              brand: 'Apple',
              brandSlug: 'apple'
            })
          }
        }
      }

      // 搜索 Android 設備
      if (brandsData && Array.isArray(brandsData)) {
        for (const brand of brandsData) {
          try {
            const models = await fetchCSV(`android/${brand.slug}/devices.csv`)
            if (models && Array.isArray(models)) {
              for (const model of models) {
                const brandMatch = brand.name?.toLowerCase().includes(lowerQuery) ||
                  brand.slug?.toLowerCase().includes(lowerQuery)
                const modelMatch = model.name?.toLowerCase().includes(lowerQuery) ||
                  model.slug?.toLowerCase().includes(lowerQuery)

                if (brandMatch || modelMatch) {
                  results.push({
                    id: model.id,
                    name: model.name,
                    slug: model.slug,
                    type: 'android',
                    brand: brand.name,
                    brandSlug: brand.slug
                  })
                }
              }
            }
          } catch {
            // ignore error
          }
        }
      }

      setDevices(results.slice(0, 20))
    } catch (error) {
      console.error('Search error:', error)
      setDevices([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (open && query) {
      const timer = setTimeout(() => {
        searchDevices(query)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setDevices([])
    }
  }, [query, open, searchDevices])

  const handleDeviceClick = (device: Device) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    const path = device.type === 'ios'
      ? `${basePath}/ios/${device.slug}`
      : `${basePath}/android/${device.brandSlug || 'google'}/${device.slug}`
    router.push(path)
    setOpen(false)
  }

  return (
    <>
      {/* Mobile: Icon button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Desktop: Full search bar */}
      <Button
        variant="outline"
        className="hidden md:flex relative h-9 w-48 lg:w-56 justify-start gap-2 text-sm text-muted-foreground bg-muted/50 border-border/50 hover:bg-muted hover:border-border shrink-0"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">搜索裝置...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-w-[calc(100vw-2rem)] sm:max-w-lg p-0 gap-0 overflow-hidden border-0 shadow-xl">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-base font-medium text-gray-900 dark:text-white">搜索裝置</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="輸入裝置名稱..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
                autoFocus
              />
            </div>

            {loading && (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground animate-in fade-in duration-300">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">搜索中...</span>
              </div>
            )}

            {!loading && query && devices.length === 0 && (
              <div className="py-8 flex flex-col items-center justify-center gap-1 text-muted-foreground animate-in fade-in duration-300">
                <Search className="h-6 w-6 opacity-40" />
                <span className="text-sm">找不到匹配的裝置</span>
              </div>
            )}

            {!loading && devices.length > 0 && (
              <div className="max-h-[50vh] overflow-y-auto space-y-1.5 scrollbar-thin">
                {devices.map((device, index) => (
                  <button
                    key={`${device.type}-${device.id}`}
                    onClick={() => handleDeviceClick(device)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/80 transition-all duration-200 text-left group border border-transparent hover:border-border/50 hover:shadow-sm"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <BrandIcon
                      brand={device.type === 'ios' ? 'ios' : device.brandSlug || 'android'}
                      size={20}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors">{device.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {device.brand && (
                          <span className="text-xs text-muted-foreground">{device.brand}</span>
                        )}
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${device.type === 'ios'
                            ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                            : 'bg-green-500/10 text-green-600 dark:text-green-400'
                          }`}>
                          {device.type === 'ios' ? 'iOS' : 'Android'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {!loading && !query && (
              <div className="py-8 flex flex-col items-center justify-center gap-1 text-muted-foreground animate-in fade-in duration-300">
                <span className="text-sm">輸入關鍵字開始搜索</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
