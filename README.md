# 手機型號版本列表

一個使用 Next.js、Tailwind CSS 和 shadcn/ui 建立的手機型號版本資訊查詢網站。

## 專案結構

### 資料檔案結構

- `public/data/ios.json` - iOS 裝置列表
- `public/data/android.json` - Android 廠牌列表
- `public/data/{brand}.json` - 各廠牌的型號列表（例如：`google.json`）
- `public/data/{model}.json` - 各型號的詳細資訊（例如：`pixel-9.json`, `iphone-15-pro.json`）

### 路由結構

- `/` - 首頁（選擇 iOS 或 Android）
- `/ios` - iOS 裝置列表
- `/ios/[model]` - iOS 裝置詳細資訊
- `/android` - Android 廠牌列表
- `/android/[brand]` - Android 廠牌下的型號列表
- `/android/[brand]/[model]` - Android 裝置詳細資訊

## 資料格式

### 裝置列表格式（ios.json, {brand}.json）

```json
[
  {
    "id": "device-id",
    "name": "裝置名稱",
    "slug": "device-slug"
  }
]
```

### 裝置詳細資訊格式（{model}.json）

```json
{
  "id": "device-id",
  "name": "裝置名稱",
  "slug": "device-slug",
  "brand": "廠牌（Android 限定）",
  "releaseDate": "發佈時間（YYYY-MM-DD）",
  "initialOSVersion": "發布時官方作業系統版本",
  "latestOfficialVersion": "官方最高可用版本",
  "latestUnofficialVersion": "非官方最高可用版本",
  "rootable": true/false,  // Android 使用 rootable
  "jailbreakable": true/false,  // iOS 使用 jailbreakable
  "status": "持續更新" | "基本安全更新" | "過時",
  "versions": [
    {
      "version": "版本號",
      "releaseDate": "發佈時間（YYYY-MM-DD）"
    }
  ],
  "lastUpdated": "資料最後更新時間（YYYY-MM-DD）"
}
```

## 開始使用

### 安裝依賴

```bash
npm install
```

### 執行開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置專案

```bash
npm run build
```

### 建置 GitHub Pages 版本

```bash
npm run build:gh-pages
```

### 執行生產版本

```bash
npm start
```

## 部署到 GitHub Pages

### 自動部署（推薦）

1. 在 GitHub 倉庫設定中啟用 Pages：
   - 前往 Settings > Pages
   - Source 選擇 "GitHub Actions"

2. 推送程式碼到 `main` 分支，GitHub Actions 會自動建置並部署

### 手動部署

1. 建置專案：
   ```bash
   npm run build:gh-pages
   ```

2. 將 `out` 目錄的內容推送到 `gh-pages` 分支

## 技術棧

- **Next.js 16** - React 框架
- **TypeScript** - 型別安全
- **Tailwind CSS 4** - 樣式框架
- **shadcn/ui** - UI 組件庫
- **Lucide React** - 圖示庫
- **next-themes** - 深色模式支援

## 新增資料

1. 在 `public/data/` 目錄下建立對應的 JSON 檔案
2. 按照上述資料格式填寫資訊
3. 確保檔案名稱與 slug 一致

## 注意事項

- 如果您的 GitHub 倉庫名稱不是 `device-version-list`，請修改：
  - `.github/workflows/deploy.yml` 中的 `NEXT_PUBLIC_BASE_PATH`
  - `next.config.ts` 中的 `basePath` 預設值
