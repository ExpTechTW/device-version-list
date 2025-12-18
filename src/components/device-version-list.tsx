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
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
            版本歷史
          </CardTitle>
          {hasBetaVersions && (
            <button
              onClick={() => setShowBeta(!showBeta)}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-200 ${
                showBeta
                  ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/30'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <FlaskConical className="h-3 w-3" />
              <span>{showBeta ? '隱藏測試版' : `顯示測試版 (${betaCount})`}</span>
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-3">
        <div className="rounded-xl overflow-hidden bg-muted/20">
          {filteredVersions.map((version, index) => {
            const isLatestStable = version.version === latestStableVersion && !version.beta;
            const isLast = index === filteredVersions.length - 1;

            return (
              <div
                key={index}
                className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                  !isLast ? 'border-b border-border/30' : ''
                } ${
                  isLatestStable
                    ? 'bg-green-500/10'
                    : version.beta
                    ? 'bg-orange-500/5'
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-semibold ${
                    isLatestStable
                      ? 'text-green-600 dark:text-green-400'
                      : version.beta
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {version.version}
                  </span>
                  {isLatestStable && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-600 dark:text-green-400">
                      <div className="w-1 h-1 rounded-full bg-green-500"></div>
                      最新
                    </span>
                  )}
                  {version.beta && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/15 text-orange-600 dark:text-orange-400">
                      <FlaskConical className="h-2.5 w-2.5" />
                      Beta
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3 opacity-60" />
                  <span>{version.releaseDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
