# GitHub Pages 部署指南

## 前置準備

1. 確保您的 GitHub 倉庫名稱（例如：`device-version-list`）
2. 在 GitHub 倉庫設定中啟用 Pages：
   - 前往 **Settings** > **Pages**
   - **Source** 選擇 **"GitHub Actions"**

## 自動部署（推薦）

### 設定 basePath

如果您的倉庫名稱不是 `device-version-list`，請修改以下檔案：

1. **`.github/workflows/deploy.yml`**
   ```yaml
   - name: Build
     run: npm run build:gh-pages
     env:
       GITHUB_PAGES: 'true'
       NEXT_PUBLIC_BASE_PATH: '/您的倉庫名稱'  # 修改這裡
   ```

2. **`next.config.ts`**
   ```typescript
   const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubPages ? '/您的倉庫名稱' : '');
   ```

### 部署步驟

1. 將所有變更推送到 `main` 分支：
   ```bash
   git add .
   git commit -m "準備部署到 GitHub Pages"
   git push origin main
   ```

2. GitHub Actions 會自動：
   - 建置專案
   - 生成靜態檔案
   - 部署到 GitHub Pages

3. 部署完成後，網站將在以下網址可用：
   ```
   https://您的用戶名.github.io/device-version-list/
   ```

## 手動部署

如果您想手動部署：

1. 建置專案：
   ```bash
   npm run build:gh-pages
   ```

2. 將 `out` 目錄的內容推送到 `gh-pages` 分支：
   ```bash
   git subtree push --prefix out origin gh-pages
   ```

   或使用以下方式：
   ```bash
   cd out
   git init
   git add .
   git commit -m "Deploy to GitHub Pages"
   git branch -M main
   git remote add origin https://github.com/您的用戶名/device-version-list.git
   git push -f origin main:gh-pages
   ```

## 本地測試

在部署前，您可以在本地測試 GitHub Pages 版本：

```bash
npm run build:gh-pages
npx serve out
```

然後訪問 `http://localhost:3000/device-version-list/`（根據您的 basePath 調整）

## 疑難排解

### 問題：頁面顯示 404

- 確認 `basePath` 設定正確
- 確認 GitHub Pages 設定為使用 GitHub Actions
- 檢查 Actions 頁面是否有錯誤

### 問題：資源載入失敗

- 確認 `assetPrefix` 設定正確
- 確認所有靜態資源路徑都使用相對路徑或包含 basePath

### 問題：深色模式不工作

- 確認 `next-themes` 已正確安裝
- 檢查瀏覽器控制台是否有錯誤

## 注意事項

- GitHub Pages 只支援靜態網站，所以必須使用 `output: 'export'`
- 所有動態路由必須在 build 時生成（使用 `generateStaticParams`）
- 資料檔案必須在 `public/data/` 目錄中
- 圖片必須設定 `unoptimized: true`

