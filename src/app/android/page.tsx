import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { BrandIcon } from "@/components/brand-icon";
import { Smartphone, ChevronRight } from "lucide-react";
import { getBrands } from "@/lib/data";

export default async function AndroidPage() {
  const androidData = await getBrands() || [];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 gradient-bg" />

      <Navbar showBack backHref="/" backLabel="返回" />

      <main className="container mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 shadow-sm">
            <Smartphone className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Android 廠牌</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {Array.isArray(androidData) ? androidData.length : 0} 個廠牌
            </p>
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.isArray(androidData) && androidData.map((brand: { id: string; name: string; slug: string }) => (
            <Link key={brand.id} href={`/android/${brand.slug}`}>
              <Card className="h-full glass-card border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <BrandIcon brand={brand.slug} size={28} />
                      <span className="font-semibold text-base text-gray-900 dark:text-white">{brand.name}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
