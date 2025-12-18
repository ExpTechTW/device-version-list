# 資料結構說明

本目錄存放所有裝置版本資料，使用 CSV 格式以減少檔案大小。

## 目錄結構

```
public/data/
├── contributors.csv          # 貢獻者名單
├── android/
│   ├── brands.csv            # Android 品牌列表
│   └── {brand}/              # 各品牌資料夾 (如 google, samsung)
│       ├── devices.csv       # 該品牌的裝置列表
│       └── devices/          # 裝置詳情資料夾
│           └── {slug}.csv    # 各裝置的詳細資料
└── ios/
    ├── devices.csv           # iOS 裝置列表
    └── devices/              # 裝置詳情資料夾
        └── {slug}.csv        # 各裝置的詳細資料
```

## 欄位縮寫對照表

為節省檔案大小，CSV 使用以下縮寫：

| 縮寫 | 完整名稱 | 說明 |
|------|----------|------|
| `d` | releaseDate | 發佈日期 (YYYY-MM-DD) |
| `v` | latestOfficialVersion | 官方最新穩定版 |
| `bv` | latestBetaVersion | 官方最新測試版 (可選) |
| `uv` | latestUnofficialVersion | 非官方最新版本 (可選) |
| `iv` | initialOSVersion | 初始作業系統版本 |
| `s` | status | 支援狀態 |
| `j` | jailbreakable | 是否可越獄 (iOS) |
| `r` | rootable | 是否可 Root (Android) |

## 狀態碼對照

| 代碼 | 說明 |
|------|------|
| `0` | 過時 - 已停止支援 |
| `1` | 基本安全更新 - 僅接收安全性修補 |
| `2` | 持續更新 - 接收完整功能更新 |

## 布林值表示

- `1` = true
- 空值 = false

範例：`j,1` 表示可越獄，`j,` 或省略表示不可越獄

## 檔案格式說明

### 1. 品牌列表 (android/brands.csv)

```csv
name,slug
Google,google
三星,samsung
```

- `name`: 顯示名稱
- `slug`: URL 路徑用 ID (自動從 name 生成，可省略)

### 2. 裝置列表 (devices.csv)

**iOS 範例：**
```csv
name,d,v,s,j
iPhone 15 Pro,2023-09-22,18.2,2,1
iPhone 16,2024-09-20,18.2,2,
```

**Android 範例：**
```csv
name,d,v,s,r
Pixel 9,2024-08-22,15,2,1
Pixel 8,2023-10-12,15,2,1
```

- `id` 和 `slug` 會自動從 `name` 生成 (小寫、空格轉 `-`)
- 版本號不需加平台前綴，系統會自動加上 `iOS` 或 `Android`

### 3. 裝置詳情 ({slug}.csv)

採用 key-value 格式，並包含版本歷史：

```csv
key,value
name,iPhone 15 Pro
d,2023-09-22
iv,17.0
v,18.2
bv,18.3 beta 3
j,1
s,2
lastUpdated,2024-12-18

versions
version,releaseDate,beta
18.3 beta 3,2024-12-17,1
18.3 beta 2,2024-12-10,1
18.2,2024-12-11,
18.1.1,2024-11-19,
```

**版本列表欄位：**
- `version`: 版本號
- `releaseDate`: 發佈日期
- `beta`: 是否為測試版 (`1` = beta, 空 = 穩定版)

**注意事項：**
- 版本列表應按時間排序，**新版本在上**
- `bv` (測試版) 和 `uv` (非官方版) 為可選欄位，留空則不顯示
- `lastUpdated` 為資料最後更新日期

### 4. 貢獻者名單 (contributors.csv)

```csv
name,github,role
yuyu,yuyu1015,maintainer
```

- `name`: 顯示名稱
- `github`: GitHub 使用者名稱
- `role`: 角色 (maintainer/contributor)

## 新增裝置流程

### 新增 iOS 裝置

1. 在 `ios/devices.csv` 新增一行
2. 建立 `ios/devices/{slug}.csv` 詳情檔案

### 新增 Android 裝置

1. 若為新品牌，先在 `android/brands.csv` 新增
2. 在 `android/{brand}/devices.csv` 新增一行
3. 建立 `android/{brand}/devices/{slug}.csv` 詳情檔案

## 注意事項

- 所有日期格式統一使用 `YYYY-MM-DD`
- CSV 檔案使用 UTF-8 編碼
- 欄位值不需引號，除非包含逗號
- 空值直接留空，不要填 `null` 或 `undefined`
