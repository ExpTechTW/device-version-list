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

      <Navbar showBack backHref="/" backLabel="返回" />

      <main className="container mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm">
            <Apple className="h-7 w-7 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">iOS 裝置</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {Array.isArray(iosData) ? iosData.length : 0} 款裝置
            </p>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.isArray(iosData) && iosData.map((device: {
            id: string;
            name: string;
            slug: string;
            releaseDate?: string;
            latestOfficialVersion?: string;
            status?: string;
            jailbreakable?: boolean;
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

            return (
              <Link key={device.id} href={`/ios/${device.slug}`}>
                <Card className="h-full glass-card border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate mb-2.5">{device.name}</h3>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          {device.releaseDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{device.releaseDate}</span>
                            </div>
                          )}
                          {device.latestOfficialVersion && (
                            <div className="flex items-center gap-2">
                              <Shield className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{device.latestOfficialVersion}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
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

                      <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
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
