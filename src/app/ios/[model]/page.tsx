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
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/ios" backLabel="返回" />

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <Apple className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(device.status)}`}>
              {device.status}
            </span>
            {device.jailbreakable !== undefined && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${device.jailbreakable
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10'
                  : 'text-muted-foreground bg-muted'
                }`}>
                {device.jailbreakable ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {device.jailbreakable ? '可越獄' : '不可越獄'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-gray-900 dark:text-white">基本資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Calendar} label="發佈時間" value={device.releaseDate} />
              <InfoRow icon={Smartphone} label="初始版本" value={device.initialOSVersion} />
              <InfoRow
                icon={Shield}
                label="官方最新穩定版"
                value={device.latestOfficialVersion}
                badge={<span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 ml-2">穩定</span>}
              />
              {device.latestBetaVersion && (
                <InfoRow
                  icon={FlaskConical}
                  label="官方最新測試版"
                  value={device.latestBetaVersion}
                  badge={<span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 ml-2">Beta</span>}
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
          <p className="text-xs text-muted-foreground text-center py-2">
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
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
        {badge}
      </div>
    </div>
  );
}
