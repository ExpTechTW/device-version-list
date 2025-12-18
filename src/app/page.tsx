import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { DeviceSearch } from "@/components/device-search";
import { BrandIcon } from "@/components/brand-icon";
import { Smartphone, Apple, Smartphone as AndroidIcon, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="relative">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30">
                <Smartphone className="h-10 w-10 sm:h-14 sm:w-14 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-green-500 rounded-full border-2 border-background shadow-lg animate-pulse"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              手機型號版本列表
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-2 sm:mt-4 max-w-2xl mx-auto px-4">
            查詢所有手機型號的版本資訊、更新狀態與詳細規格
          </p>
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto px-4">
            <DeviceSearch />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto mt-8 sm:mt-12">
          <Link href="/ios" className="group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <BrandIcon brand="ios" size={32} className="group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">iOS 裝置</CardTitle>
                </div>
                <CardDescription className="text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  查看所有 iPhone 型號的版本資訊
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  查看 iOS 裝置
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/android" className="group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                    <AndroidIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Android 裝置</CardTitle>
                </div>
                <CardDescription className="text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  查看所有 Android 廠牌與型號
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  查看 Android 裝置
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
