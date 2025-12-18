import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { BrandIcon } from "@/components/brand-icon";
import { Calendar, Smartphone, Shield, Wrench, CheckCircle, XCircle, Code, Clock, Package, Info, List } from "lucide-react";
import { getDataFile } from "@/lib/data";

async function getAndroidData() {
  const data = await getDataFile('android.json');
  return data || [];
}

async function getDeviceInfo(brand: string, model: string) {
  const data = await getDataFile(`${model}.json`);
  return data || null;
}

export async function generateStaticParams() {
  const androidData = await getAndroidData();
  const params: { brand: string; model: string }[] = [];
  
  for (const brand of androidData) {
    try {
      const models = await getDataFile(`${brand.slug}.json`);
      if (models && Array.isArray(models)) {
        for (const model of models) {
          params.push({
            brand: brand.slug,
            model: model.slug,
          });
        }
      }
    } catch (error) {
      // 忽略不存在的檔案
      console.warn(`Brand file not found: ${brand.slug}.json`);
    }
  }
  
  return params;
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = await params;
  const androidData = await getAndroidData();
  const brandInfo = androidData.find((b: { slug: string }) => b.slug === brand);
  const device = await getDeviceInfo(brand, model);

  if (!device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar showBack backHref={`/android/${brand}`} backLabel="返回型號列表" />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">找不到此裝置資訊</h1>
            <Link href={`/android/${brand}`}>
              <Button>返回型號列表</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
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

  const InfoItem = ({ icon: Icon, label, value, className = "" }: { icon: any; label: string; value: string; className?: string }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card/50 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground min-w-[140px] sm:min-w-[180px]">{label}</span>
      </div>
      <span className="font-medium text-sm sm:text-base ml-0 sm:ml-auto">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar showBack backHref={`/android/${brand}`} backLabel="返回型號列表" />
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <BrandIcon brand={brand} size={48} className="hidden sm:block" />
            <BrandIcon brand={brand} size={40} className="sm:hidden" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2">
                {device.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                {brandInfo?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          <Card className="border-2 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl sm:text-2xl">基本資訊</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem icon={Calendar} label="發佈時間" value={device.releaseDate} />
              <InfoItem icon={Smartphone} label="發布時官方作業系統版本" value={device.initialOSVersion} />
              <InfoItem icon={Shield} label="官方最高可用版本" value={device.latestOfficialVersion} />
              <InfoItem icon={Code} label="非官方最高可用版本" value={device.latestUnofficialVersion} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground min-w-[140px] sm:min-w-[180px]">是否可以 Root</span>
                </div>
                <div className="flex items-center gap-2 ml-0 sm:ml-auto">
                  {device.rootable ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-sm sm:text-base">是</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-sm sm:text-base">否</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg border bg-card/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm text-muted-foreground min-w-[140px] sm:min-w-[180px]">狀態</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-xl sm:text-2xl">版本列表</CardTitle>
                  <CardDescription>各版本發佈時間</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {device.versions.map((version: { version: string; releaseDate: string }, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                    <span className="font-medium text-sm sm:text-base">{version.version}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{version.releaseDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>資料最後更新時間：{device.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
