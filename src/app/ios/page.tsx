import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Apple, Calendar, Shield, ChevronRight } from "lucide-react";
import { getIOSDevices } from "@/lib/data";

export default async function IOSPage() {
  const iosData = await getIOSDevices() || [];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 gradient-bg" />

      {/* Decorative blurred shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <Navbar showBack backHref="/" backLabel="返回" />

      <main className="container mx-auto px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Apple className="h-6 w-6 text-foreground" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">iOS 裝置</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Array.isArray(iosData) ? iosData.length : 0} 款裝置
            </p>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.isArray(iosData) && iosData.map((device: {
            id: string;
            name: string;
            slug: string;
            releaseDate?: string;
            latestOfficialVersion?: string;
            status?: string;
            jailbreakable?: boolean;
          }, index: number) => {
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

            return (
              <Link 
                key={device.id} 
                href={`/ios/${device.slug}`}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full glass-card border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group hover:border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-1.5 group-hover:text-primary transition-colors">{device.name}</h3>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          {device.releaseDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 shrink-0 opacity-70" />
                              <span className="truncate">{device.releaseDate}</span>
                            </div>
                          )}
                          {device.latestOfficialVersion && (
                            <div className="flex items-center gap-1.5">
                              <Shield className="h-3 w-3 shrink-0 opacity-70" />
                              <span className="truncate">{device.latestOfficialVersion}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {device.status && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(device.status)}`}>
                              {device.status}
                            </span>
                          )}
                          {device.jailbreakable && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full text-purple-600 dark:text-purple-400 bg-purple-500/10">
                              可越獄
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
