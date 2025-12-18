import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { BrandIcon } from "@/components/brand-icon";
import { ChevronRight, Smartphone as SmartphoneIcon, Package, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import { getDataFile } from "@/lib/data";

async function getAndroidData() {
  const data = await getDataFile('android.json');
  return data || [];
}

async function getModels(brand: string) {
  const data = await getDataFile(`${brand}.json`);
  return data || [];
}

export async function generateStaticParams() {
  const androidData = await getAndroidData();
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
  const androidData = await getAndroidData();
  const brandInfo = androidData.find((b: { slug: string }) => b.slug === brand);
  const models = await getModels(brand);

  if (!brandInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar showBack backHref="/android" backLabel="返回 Android 廠牌列表" />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">找不到此廠牌</h1>
            <Link href="/android">
              <Button>返回 Android 廠牌列表</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar showBack backHref="/android" backLabel="返回 Android 廠牌列表" />
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BrandIcon brand={brand} size={40} className="sm:hidden" />
            <BrandIcon brand={brand} size={48} className="hidden sm:block" />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
                {brandInfo.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                選擇要查看的型號
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {models.length > 0 ? (
            models.map((model: { 
              id: string; 
              name: string; 
              slug: string;
              releaseDate?: string;
              latestOfficialVersion?: string;
              status?: string;
              rootable?: boolean;
            }) => {
              const getStatusColor = (status?: string) => {
                switch (status) {
                  case "持續更新":
                    return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
                  case "基本安全更新":
                    return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
                  case "過時":
                    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                  default:
                    return "bg-muted text-muted-foreground border-border";
                }
              };

              return (
                <Link key={model.id} href={`/android/${brand}/${model.slug}`} className="group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 group-hover:scale-[1.02]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                          <SmartphoneIcon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl flex-1">{model.name}</CardTitle>
                      </div>
                      {(model.releaseDate || model.latestOfficialVersion || model.status) && (
                        <div className="space-y-2 mt-2 text-sm text-muted-foreground">
                          {model.releaseDate && (
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3" />
                              <span>{model.releaseDate}</span>
                            </div>
                          )}
                          {model.latestOfficialVersion && (
                            <div className="flex items-center gap-2 text-xs">
                              <Shield className="h-3 w-3" />
                              <span>{model.latestOfficialVersion}</span>
                            </div>
                          )}
                          {model.status && (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(model.status)}`}>
                                {model.status}
                              </span>
                            </div>
                          )}
                          {model.rootable !== undefined && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {model.rootable ? (
                                <>
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  <span>可 Root</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 text-red-600" />
                                  <span>不可 Root</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        查看詳細資訊
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 sm:py-16">
              <p className="text-muted-foreground text-lg">暫無型號資料</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

