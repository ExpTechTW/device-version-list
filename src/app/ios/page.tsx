import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { BrandIcon } from "@/components/brand-icon";
import { ChevronRight, Apple, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import { getDataFile } from "@/lib/data";

async function getIOSData() {
  const data = await getDataFile('ios.json');
  return data || [];
}

export default async function IOSPage() {
  const iosData = await getIOSData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar showBack backHref="/" backLabel="返回首頁" />
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Apple className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
                iOS 裝置
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                選擇要查看的 iPhone 型號
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {iosData.map((device: { 
            id: string; 
            name: string; 
            slug: string;
            releaseDate?: string;
            latestOfficialVersion?: string;
            status?: string;
            jailbreakable?: boolean;
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
              <Link key={device.id} href={`/ios/${device.slug}`} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 group-hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <BrandIcon brand="ios" size={28} className="group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-lg sm:text-xl flex-1">{device.name}</CardTitle>
                    </div>
                    {(device.releaseDate || device.latestOfficialVersion || device.status) && (
                      <div className="space-y-2 mt-2 text-sm text-muted-foreground">
                        {device.releaseDate && (
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>{device.releaseDate}</span>
                          </div>
                        )}
                        {device.latestOfficialVersion && (
                          <div className="flex items-center gap-2 text-xs">
                            <Shield className="h-3 w-3" />
                            <span>{device.latestOfficialVersion}</span>
                          </div>
                        )}
                        {device.status && (
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(device.status)}`}>
                              {device.status}
                            </span>
                          </div>
                        )}
                        {device.jailbreakable !== undefined && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {device.jailbreakable ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>可越獄</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 text-red-600" />
                                <span>不可越獄</span>
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
          })}
        </div>
      </div>
    </div>
  );
}

