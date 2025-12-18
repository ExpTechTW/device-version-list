import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Calendar, Smartphone, Shield, CheckCircle, XCircle, Code, Apple, FlaskConical } from "lucide-react";
import { getIOSDevices, getIOSDeviceDetail } from "@/lib/data";
import { DeviceVersionList } from "@/components/device-version-list";

export async function generateStaticParams() {
  const iosData = await getIOSDevices() || [];
  if (!Array.isArray(iosData)) return [];
  return iosData.map((device: { slug: string }) => ({
    model: device.slug,
  }));
}

export default async function IOSModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const device = await getIOSDeviceDetail(model);

  if (!device) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showBack backHref="/ios" backLabel="返回" />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Smartphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-4">找不到此裝置資訊</h1>
            <Link href="/ios">
              <Button>返回裝置列表</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
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
    <div className="min-h-screen bg-background relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 gradient-bg" />

      <Navbar showBack backHref="/ios" backLabel="返回" />

      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-3xl">
        {/* Header */}
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="h-5 w-5" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(device.status)}`}>
              {device.status}
            </span>
            {device.jailbreakable !== undefined && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${device.jailbreakable
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-500/10'
                }`}>
                {device.jailbreakable ? <CheckCircle className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                {device.jailbreakable ? '可越獄' : '不可越獄'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Basic Info */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                基本資訊
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow icon={Calendar} label="發佈時間" value={device.releaseDate} />
              <InfoRow icon={Smartphone} label="初始版本" value={device.initialOSVersion} />
              <InfoRow
                icon={Shield}
                label="官方最新穩定版"
                value={device.latestOfficialVersion}
                badge={<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 ml-2 font-medium">穩定</span>}
              />
              {device.latestBetaVersion && (
                <InfoRow
                  icon={FlaskConical}
                  label="官方最新測試版"
                  value={device.latestBetaVersion}
                  badge={<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 ml-2 font-medium">Beta</span>}
                />
              )}
              {device.latestUnofficialVersion && (
                <InfoRow icon={Code} label="非官方最新版本" value={device.latestUnofficialVersion} />
              )}
            </CardContent>
          </Card>

          {/* Version History */}
          <DeviceVersionList versions={device.versions} />

          {/* Footer */}
          <p className="text-[10px] text-muted-foreground text-center py-1">
            資料更新時間：{device.lastUpdated}
          </p>
        </div>
      </main>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  badge
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-900 dark:text-white">{value}</span>
        {badge}
      </div>
    </div>
  );
}
