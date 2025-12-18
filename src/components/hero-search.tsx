"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// 判斷平台
function getPlatform(filepath: string): 'ios' | 'android' | undefined {
  if (filepath.startsWith('ios/')) return 'ios';
  if (filepath.startsWith('android/')) return 'android';
  return undefined;
}

// ETag 快取儲存
const etagCache = new Map<string, { etag: string; data: Record<string, string>[] }>();

async function fetchCSV(filepath: string) {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/${filepath}`;

    // 準備請求標頭
    const headers: HeadersInit = {
      'Accept-Encoding': 'gzip, deflate, br',
    };

    // 如果有快取的 ETag，加入 If-None-Match
    const cached = etagCache.get(filepath);
    if (cached?.etag) {
      headers['If-None-Match'] = cached.etag;
    }

    const res = await fetch(url, {
      cache: 'no-cache',
      headers,
    });

    // 304 Not Modified - 使用快取資料
    if (res.status === 304 && cached) {
      return cached.data;
    }

    if (!res.ok) return null;

    const content = await res.text();
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const csvHeaders = lines[0].split(',').map(h => h.trim());
    const rows: Record<string, string>[] = [];
    const platform = getPlatform(filepath);

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === csvHeaders.length) {
        const row: Record<string, string> = {};
        csvHeaders.forEach((header, index) => {
          // 處理欄位簡寫
          switch (header) {
            case 'd':
              row['releaseDate'] = values[index];
              break;
            case 'v':
              const ver = values[index];
              row['latestOfficialVersion'] = platform === 'ios' ? `iOS ${ver}` : `Android ${ver}`;
              break;
            case 's':
              const statusMap: Record<string, string> = { '0': '過時', '1': '基本安全更新', '2': '持續更新' };
              row['status'] = statusMap[values[index]] || values[index];
              break;
            case 'j':
              row['jailbreakable'] = values[index] === '1' ? 'true' : 'false';
              break;
            case 'r':
              row['rootable'] = values[index] === '1' ? 'true' : 'false';
              break;
            default:
              row[header] = values[index];
          }
        });
        // 生成 id 和 slug（如果有 name 但沒有 id/slug）
        if (row['name'] && !row['id']) {
          row['id'] = generateSlug(row['name']);
          row['slug'] = generateSlug(row['name']);
        }
        rows.push(row);
      }
    }

    // 儲存 ETag 和資料到快取
    const etag = res.headers.get('ETag');
    if (etag) {
      etagCache.set(filepath, { etag, data: rows });
    }

    return rows;
  } catch {
    // 發生錯誤時嘗試使用快取
    const cached = etagCache.get(filepath);
    if (cached) return cached.data;
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

export function HeroSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [devices, setDevices] = React.useState<Device[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  // 監聽鍵盤快捷鍵
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

      if (iosData && Array.isArray(iosData)) {
        for (const device of iosData) {
          if (device.name?.toLowerCase().includes(lowerQuery) ||
            device.slug?.toLowerCase().includes(lowerQuery)) {
            results.push({
              id: device.id,
              name: device.name,
              slug: device.slug,
              type: 'ios'
            })
          }
        }
      }

      if (brandsData && Array.isArray(brandsData)) {
        const androidBrands = brandsData.filter(b => b.platform === 'android')

        for (const brand of androidBrands) {
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
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-14 px-6 w-full max-w-md glass-input rounded-2xl text-base gap-3 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Search className="h-5 w-5" />
        <span>搜尋裝置型號...</span>
        <kbd className="ml-auto hidden sm:inline-flex h-6 items-center gap-1 rounded-md border bg-background/80 px-2 font-mono text-xs">
          ⌘K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-w-[calc(100vw-2rem)] sm:max-w-lg p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-base font-medium">搜索裝置</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="輸入裝置名稱..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1"
                autoFocus
              />
            </div>

            {loading && (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">搜索中...</span>
              </div>
            )}

            {!loading && query && devices.length === 0 && (
              <div className="py-8 flex flex-col items-center justify-center gap-1 text-muted-foreground">
                <Search className="h-6 w-6 opacity-40" />
                <span className="text-sm">找不到匹配的裝置</span>
              </div>
            )}

            {!loading && devices.length > 0 && (
              <div className="max-h-[50vh] overflow-y-auto space-y-1">
                {devices.map((device) => (
                  <button
                    key={`${device.type}-${device.id}`}
                    onClick={() => handleDeviceClick(device)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                  >
                    <BrandIcon
                      brand={device.type === 'ios' ? 'ios' : device.brandSlug || 'android'}
                      size={20}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-gray-900 dark:text-white">{device.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {device.brand && (
                          <span className="text-xs text-muted-foreground">{device.brand}</span>
                        )}
                        <span className={`text-[10px] px-1 py-0.5 rounded ${device.type === 'ios'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-green-500/10 text-green-600 dark:text-green-400'
                          }`}>
                          {device.type === 'ios' ? 'iOS' : 'Android'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {!loading && !query && (
              <div className="py-8 flex flex-col items-center justify-center gap-1 text-muted-foreground">
                <span className="text-sm">輸入關鍵字開始搜索</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
