import fs from 'fs';
import path from 'path';

// 在 build 時直接讀取檔案（靜態導出）
export async function readDataFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    // 在 build 時不輸出錯誤，只返回 null
    return null;
  }
}

// 運行時使用 fetch（開發模式或動態路由）
export async function fetchDataFile(filename: string) {
  try {
    // 在靜態導出時，使用相對路徑
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/${filename}`;
    const res = await fetch(url, {
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching data file ${filename}:`, error);
    return null;
  }
}

// 統一的資料讀取函數（優先使用檔案系統讀取）
export async function getDataFile(filename: string) {
  // 在 build 時使用檔案系統讀取
  if (typeof window === 'undefined') {
    return readDataFile(filename);
  }
  // 在客戶端使用 fetch
  return fetchDataFile(filename);
}

