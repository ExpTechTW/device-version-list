import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { HeroSearch } from "@/components/hero-search";
import { BrandIcon } from "@/components/brand-icon";
import { Smartphone, Apple, ArrowRight, Zap, Shield, Clock, ChevronRight } from "lucide-react";
import { getIOSDevices, getBrands, getBrandDevices } from "@/lib/data";

export default async function Home() {
  // 取得 iOS 裝置數量
  const iosDevices = await getIOSDevices();
  const iosCount = Array.isArray(iosDevices) ? iosDevices.length : 0;

  // 取得 Android 品牌和裝置數量
  const brands = await getBrands();
  const brandList = Array.isArray(brands) ? brands : [];

  // 計算 Android 總裝置數量
  let androidCount = 0;
  for (const brand of brandList) {
    const devices = await getBrandDevices(brand.slug as string);
    if (Array.isArray(devices)) {
      androidCount += devices.length;
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 gradient-bg" />

      {/* Decorative blurred shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      <Navbar showSearch={false} />

      <main className="container mx-auto px-4 py-16 sm:py-20 lg:py-28">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-8 hover:scale-105 transition-transform">
            <Zap className="h-4 w-4" />
            <span>快速查詢手機版本資訊</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            手機型號版本列表
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            一站式查詢 iOS 和 Android 裝置的版本資訊、更新狀態、越獄/Root 支援等詳細規格
          </p>

          {/* Hero Search - Full width centered button */}
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <HeroSearch />
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
          <Link href="/ios" className="group animate-in fade-in slide-in-from-left duration-700 delay-300">
            <Card className="h-full glass-card border-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Apple className="h-10 w-10" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">iOS</CardTitle>
                    <CardDescription className="text-base">{iosCount} 款 iPhone 裝置</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  查看 iPhone 各機型的 iOS 版本歷史、越獄支援狀態與更新資訊
                </p>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10 h-12 rounded-xl transition-all">
                  <span className="font-medium">瀏覽 iOS 裝置</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/android" className="group animate-in fade-in slide-in-from-right duration-700 delay-300">
            <Card className="h-full glass-card border-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-green-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/60 dark:to-green-800/60 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Android</CardTitle>
                    <CardDescription className="text-base">{androidCount} 款裝置・{brandList.length} 個品牌</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Google Pixel、Samsung、小米等多個品牌的 Android 版本資訊
                </p>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-green-500/10 h-12 rounded-xl transition-all">
                  <span className="font-medium">瀏覽 Android 裝置</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Brand Cards Section */}
        {brandList.length > 0 && (
          <div className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Android 品牌</h2>
              <Link href="/android" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group/link">
                查看全部
                <ChevronRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {brandList.slice(0, 8).map((brand: { id?: string; name: string; slug: string }, index: number) => (
                <Link 
                  key={brand.id || brand.slug} 
                  href={`/android/${brand.slug}`}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${600 + index * 50}ms` }}
                >
                  <Card className="glass-card border-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group hover:border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          <BrandIcon brand={brand.slug} size={24} />
                        </div>
                        <span className="font-medium text-sm text-gray-900 dark:text-white truncate">{brand.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <h2 className="text-center text-2xl font-semibold mb-10 text-gray-900 dark:text-white">功能特色</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl glass-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">版本歷史</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                完整的系統版本更新記錄與發布日期追蹤
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl glass-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 mb-5 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                <Shield className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">更新狀態</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                即時了解裝置的官方支援與安全更新狀態
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl glass-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 mb-5 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                <Zap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">越獄/Root</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                查看裝置是否支援越獄或 Root 操作
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-center text-sm text-muted-foreground mt-20 animate-in fade-in duration-700 delay-1000">
          按下 <kbd className="px-2.5 py-1.5 rounded-lg border bg-card text-xs font-mono shadow-sm">⌘K</kbd> 快速搜尋裝置
        </p>
      </main>
    </div>
  );
}
