"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FlaskConical } from "lucide-react";

interface Version {
  version: string;
  releaseDate: string;
  beta?: boolean;
}

interface DeviceVersionListProps {
  versions: Version[];
}

export function DeviceVersionList({ versions }: DeviceVersionListProps) {
  const [showBeta, setShowBeta] = React.useState(false);

  // 過濾版本列表
  const filteredVersions = React.useMemo(() => {
    if (showBeta) {
      return versions;
    }
    return versions.filter(v => !v.beta);
  }, [versions, showBeta]);

  // 檢查是否有 beta 版本
  const hasBetaVersions = versions.some(v => v.beta);
  const betaCount = versions.filter(v => v.beta).length;

  // 找出最新穩定版（非 beta 的第一個）
  const latestStableVersion = versions.find(v => !v.beta)?.version;

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-gray-900 dark:text-white">版本歷史</CardTitle>
          {hasBetaVersions && (
            <button
              onClick={() => setShowBeta(!showBeta)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                showBeta
                  ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              <FlaskConical className="h-3 w-3" />
              {showBeta ? '隱藏測試版' : `${betaCount} 個測試版`}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredVersions.map((version, index) => {
            const isLatestStable = version.version === latestStableVersion && !version.beta;

            return (
              <div
                key={index}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {version.version}
                  </span>
                  {version.beta && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      Beta
                    </span>
                  )}
                  {isLatestStable && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">
                      最新穩定版
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {version.releaseDate}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
