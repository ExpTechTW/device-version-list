import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { BrandIcon } from "@/components/brand-icon";
import { ChevronRight, Calendar, Shield, Smartphone } from "lucide-react";
import { getBrands, getBrandDevices } from "@/lib/data";

export async function generateStaticParams() {
  const androidData = await getBrands() || [];
  if (!Array.isArray(androidData)) return [];
  return androidData.map((brand: { slug: string }) => ({
    brand: brand.slug,
  }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const androidData = await getBrands() || [];
  const brandInfo = Array.isArray(androidData) ? androidData.find((b: { slug: string }) => b.slug === brand) : null;
  const models = await getBrandDevices(brand) || [];

  if (!brandInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/android" backLabel="返回" />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Smartphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-foreground mb-4">找不到此廠牌</h1>
            <Link href="/android">
              <Button>返回廠牌列表</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 gradient-bg" />

      <Navbar showBack backHref="/android" backLabel="返回" />

      <main className="container mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <BrandIcon brand={brand} size={36} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{brandInfo.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {Array.isArray(models) ? models.length : 0} 款型號
            </p>
          </div>
        </div>

        {/* Model Grid */}
        {Array.isArray(models) && models.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {models.map((model: {
              id: string;
              name: string;
              slug: string;
              releaseDate?: string;
              latestOfficialVersion?: string;
              status?: string;
              rootable?: boolean | string;
            }) => {
              const getStatusStyle = (status?: string) => {
                switch (status) {
                  case "持續更新":
                    return "text-green-600 dark:text-green-400 bg-green-500/10";
                  case "基本安全更新":
                    return "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10";
                  case "過時":
                    return "text-red-600 dark:text-red-400 bg-red-500/10";
                  default:
                    return "text-muted-foreground bg-muted";
                }
              };

              const isRootable = model.rootable === true || model.rootable === 'true';

              return (
                <Link key={model.id} href={`/android/${brand}/${model.slug}`}>
                  <Card className="h-full glass-card border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate mb-2.5">{model.name}</h3>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            {model.releaseDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                <span className="truncate">{model.releaseDate}</span>
                              </div>
                            )}
                            {model.latestOfficialVersion && (
                              <div className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                <span className="truncate">{model.latestOfficialVersion}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {model.status && (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(model.status)}`}>
                                {model.status}
                              </span>
                            )}
                            {isRootable && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full text-orange-600 dark:text-orange-400 bg-orange-500/10">
                                可 Root
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Smartphone className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">暫無型號資料</p>
          </div>
        )}
      </main>
    </div>
  );
}
