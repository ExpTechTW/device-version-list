"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Smartphone, Apple } from "lucide-react"
import { BrandIcon } from "./brand-icon"
// 注意：在客戶端組件中，我們需要使用 fetch 而不是直接讀取檔案
async function fetchDataFile(filename: string) {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/${filename}`;
    const res = await fetch(url, {
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching data file ${filename}:`, error);
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
      const [iosData, androidData] = await Promise.all([
        fetchDataFile('ios.json').catch(() => []),
        fetchDataFile('android.json').catch(() => [])
      ])

      const results: Device[] = []
      const lowerQuery = searchQuery.toLowerCase()

      // 搜索 iOS 裝置
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

      // 搜索 Android 廠牌和型號
      if (androidData && Array.isArray(androidData)) {
        for (const brand of androidData) {
          const brandMatch = brand.name?.toLowerCase().includes(lowerQuery) || 
                            brand.slug?.toLowerCase().includes(lowerQuery)
          
          if (brandMatch) {
            // 如果匹配廠牌，添加所有該廠牌的型號
            try {
              const models = await fetchDataFile(`${brand.slug}.json`)
              if (models && Array.isArray(models)) {
                for (const model of models) {
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
            } catch {
              // 忽略錯誤
            }
          } else {
            // 搜索該廠牌的型號
            try {
              const models = await fetchDataFile(`${brand.slug}.json`)
              if (models && Array.isArray(models)) {
                for (const model of models) {
                  if (model.name?.toLowerCase().includes(lowerQuery) || 
                      model.slug?.toLowerCase().includes(lowerQuery)) {
                    results.push({
                      id: model.id,
                      name: model.name,
                      slug: model.slug,
                      type: 'android',
                      brand: brand.name
                    })
                  }
                }
              }
            } catch {
              // 忽略錯誤
            }
          }
        }
      }

      setDevices(results.slice(0, 20)) // 限制結果數量
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
        className="relative h-9 w-full sm:w-64 justify-start text-sm text-muted-foreground sm:pr-12"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">搜索裝置...</span>
        <span className="sm:hidden">搜索</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>搜索裝置</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="輸入裝置名稱或型號..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            {loading && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                搜索中...
              </div>
            )}

            {!loading && query && devices.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                找不到匹配的裝置
              </div>
            )}

            {!loading && devices.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto space-y-1">
                {devices.map((device) => (
                  <button
                    key={`${device.type}-${device.id}`}
                    onClick={() => handleDeviceClick(device)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <BrandIcon 
                      brand={device.type === 'ios' ? 'ios' : device.brandSlug || 'android'} 
                      size={20}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{device.name}</div>
                      {device.brand && (
                        <div className="text-sm text-muted-foreground">{device.brand}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {device.type === 'ios' ? 'iOS' : 'Android'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && !query && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                輸入關鍵字開始搜索
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

