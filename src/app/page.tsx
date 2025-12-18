import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { HeroSearch } from "@/components/hero-search";
import { Smartphone, Apple, ArrowRight, Zap, Shield, Clock } from "lucide-react";

export default function Home() {
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
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            <span>快速查詢手機版本資訊</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            手機型號版本列表
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            一站式查詢 iOS 和 Android 裝置的版本資訊、更新狀態、越獄/Root 支援等詳細規格
          </p>

          {/* Hero Search - Full width centered button */}
          <div className="flex justify-center">
            <HeroSearch />
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-20">
          <Link href="/ios" className="group">
            <Card className="h-full glass-card border-0 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner">
                    <Apple className="h-10 w-10" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">iOS</CardTitle>
                    <CardDescription className="text-base">iPhone 系列裝置</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-5">
                  查看 iPhone 各機型的 iOS 版本歷史、越獄支援狀態與更新資訊
                </p>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10 h-12 rounded-xl">
                  <span className="font-medium">瀏覽 iOS 裝置</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/android" className="group">
            <Card className="h-full glass-card border-0 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/60 dark:to-green-800/60 shadow-inner">
                    <Smartphone className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Android</CardTitle>
                    <CardDescription className="text-base">多品牌裝置支援</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-5">
                  Google Pixel、Samsung、小米等多個品牌的 Android 版本資訊
                </p>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-green-500/10 h-12 rounded-xl">
                  <span className="font-medium">瀏覽 Android 裝置</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-semibold mb-10 text-gray-900 dark:text-white">功能特色</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl glass-card">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">版本歷史</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                完整的系統版本更新記錄與發布日期追蹤
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl glass-card">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 mb-5">
                <Shield className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">更新狀態</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                即時了解裝置的官方支援與安全更新狀態
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl glass-card">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 mb-5">
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
        <p className="text-center text-sm text-muted-foreground mt-20">
          按下 <kbd className="px-2.5 py-1.5 rounded-lg border bg-card text-xs font-mono shadow-sm">⌘K</kbd> 快速搜尋裝置
        </p>
      </main>
    </div>
  );
}
