import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { BrandIcon } from "@/components/brand-icon";
import { ChevronRight, Building2 } from "lucide-react";
import { getDataFile } from "@/lib/data";

async function getAndroidData() {
  const data = await getDataFile('android.json');
  return data || [];
}

export default async function AndroidPage() {
  const androidData = await getAndroidData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar showBack backHref="/" backLabel="返回首頁" />
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
                Android 廠牌
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                選擇要查看的 Android 廠牌
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {androidData.map((brand: { id: string; name: string; slug: string }) => (
            <Link key={brand.id} href={`/android/${brand.slug}`} className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 group-hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <BrandIcon brand={brand.slug} size={28} className="group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-lg sm:text-xl flex-1">{brand.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    查看型號列表
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

