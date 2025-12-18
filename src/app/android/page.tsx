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

      {/* Decorative blurred shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500/8 rounded-full blur-3xl" />
      </div>

      <Navbar showBack backHref="/" backLabel="返回" />

      <main className="container mx-auto px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Android 廠牌</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Array.isArray(androidData) ? androidData.length : 0} 個廠牌
            </p>
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.isArray(androidData) && androidData.map((brand: { id: string; name: string; slug: string }, index: number) => (
            <Link 
              key={brand.id} 
              href={`/android/${brand.slug}`}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="h-full glass-card border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group hover:border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <BrandIcon brand={brand.slug} size={24} />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{brand.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
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
