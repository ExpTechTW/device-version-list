import fs from 'fs';
import path from 'path';

// ===== 工具函數 =====

// 從名稱生成 slug (id)：全部小寫，空格換成 -
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// 狀態碼對照表
// 0: 過時, 1: 基本安全更新, 2: 持續更新
const STATUS_MAP: Record<string, string> = {
  '0': '過時',
  '1': '基本安全更新',
  '2': '持續更新',
};

// 將狀態碼轉換為文字
export function getStatusText(code: string | number): string {
  return STATUS_MAP[String(code)] || '未知';
}

// 將布爾值/數字轉換為 boolean
function toBoolean(value: string | number | boolean | undefined): boolean {
  if (value === undefined || value === '') return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  return value === '1' || value === 'true';
}

// ===== CSV 解析函數 =====

// 判斷是否為設備列表 CSV（包含 name 欄位，需要生成 id/slug）
function isDeviceListCSV(headers: string[]): boolean {
  return headers.includes('name') && !headers.includes('id') && !headers.includes('slug');
}

// 處理設備列表的欄位轉換
function transformDeviceRow(row: Record<string, string>, platform: 'ios' | 'android'): Record<string, unknown> {
  const transformed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    switch (key) {
      case 'name':
        transformed.name = value;
        transformed.id = generateSlug(value);
        transformed.slug = generateSlug(value);
        break;
      case 's': // status 簡寫
      case 'status':
        transformed.status = getStatusText(value);
        break;
      case 'j': // jailbreakable 簡寫 (iOS)
      case 'jailbreakable':
        transformed.jailbreakable = toBoolean(value);
        break;
      case 'r': // rootable 簡寫 (Android)
      case 'rootable':
        transformed.rootable = toBoolean(value);
        break;
      case 'v': // latestOfficialVersion 簡寫
      case 'latestOfficialVersion':
        // 自動加上平台前綴
        if (value && !value.startsWith('iOS') && !value.startsWith('Android')) {
          transformed.latestOfficialVersion = platform === 'ios' ? `iOS ${value}` : `Android ${value}`;
        } else {
          transformed.latestOfficialVersion = value;
        }
        break;
      case 'd': // releaseDate 簡寫
        transformed.releaseDate = value;
        break;
      default:
        transformed[key] = value;
    }
  }

  return transformed;
}

function parseCSV(content: string, platform?: 'ios' | 'android'): Record<string, unknown>[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: Record<string, unknown>[] = [];
  const needsTransform = isDeviceListCSV(headers);

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      if (needsTransform && platform) {
        rows.push(transformDeviceRow(row, platform));
      } else {
        rows.push(row);
      }
    }
  }

  return rows;
}

// 解析設備詳情 CSV（包含 key-value 和版本列表）
function parseDeviceCSV(content: string, platform?: 'ios' | 'android') {
  const sections = content.split('\n\nversions\n');
  const device: Record<string, unknown> = {};

  // 解析基本資訊
  const infoLines = sections[0].trim().split('\n');
  for (let i = 1; i < infoLines.length; i++) {
    const [key, ...valueParts] = infoLines[i].split(',');
    const value = valueParts.join(',').trim();
    if (key && value !== undefined) {
      const k = key.trim();
      // 處理簡寫和轉換
      switch (k) {
        case 'name':
          device.name = value;
          device.id = generateSlug(value);
          device.slug = generateSlug(value);
          break;
        case 's':
        case 'status':
          device.status = getStatusText(value);
          break;
        case 'j':
        case 'jailbreakable':
          device.jailbreakable = toBoolean(value);
          break;
        case 'r':
        case 'rootable':
          device.rootable = toBoolean(value);
          break;
        case 'v':
        case 'latestOfficialVersion':
          if (value && !value.startsWith('iOS') && !value.startsWith('Android')) {
            device.latestOfficialVersion = platform === 'ios' ? `iOS ${value}` : `Android ${value}`;
          } else {
            device.latestOfficialVersion = value;
          }
          break;
        case 'bv':
        case 'latestBetaVersion':
          // beta 版本（可選）
          if (value) {
            if (!value.startsWith('iOS') && !value.startsWith('Android')) {
              device.latestBetaVersion = platform === 'ios' ? `iOS ${value}` : `Android ${value}`;
            } else {
              device.latestBetaVersion = value;
            }
          }
          break;
        case 'uv':
        case 'latestUnofficialVersion':
          // 非官方版本（可選，空值不設置）
          if (value) {
            device.latestUnofficialVersion = value;
          }
          break;
        case 'd':
        case 'releaseDate':
          device.releaseDate = value;
          break;
        case 'iv':
        case 'initialOSVersion':
          if (value && !value.startsWith('iOS') && !value.startsWith('Android')) {
            device.initialOSVersion = platform === 'ios' ? `iOS ${value}` : `Android ${value}`;
          } else {
            device.initialOSVersion = value;
          }
          break;
        default:
          // 轉換布爾值
          if (value === 'true' || value === '1') device[k] = true;
          else if (value === 'false' || value === '0') device[k] = false;
          else if (value) device[k] = value; // 只設置非空值
      }
    }
  }

  // 解析版本列表（支援 beta 標記）
  // 格式: version,releaseDate,beta (beta 為可選，1=beta, 0或空=穩定版)
  if (sections[1]) {
    const versionLines = sections[1].trim().split('\n');
    const headerLine = versionLines[0].split(',').map(h => h.trim());
    const hasBetaColumn = headerLine.includes('beta');

    const versionRows = versionLines.slice(1).map(line => {
      const parts = line.split(',').map(v => v.trim());
      const versionObj: { version: string; releaseDate: string; beta?: boolean } = {
        version: parts[0],
        releaseDate: parts[1],
      };
      if (hasBetaColumn) {
        // 1 = beta, 空 或 0 = 穩定版
        versionObj.beta = parts[2] === '1';
      }
      return versionObj;
    });
    device.versions = versionRows;
  } else {
    device.versions = [];
  }

  return device;
}

// 從路徑判斷平台
function getPlatformFromPath(filepath: string): 'ios' | 'android' | undefined {
  if (filepath.startsWith('ios/')) return 'ios';
  if (filepath.startsWith('android/')) return 'android';
  return undefined;
}

// 讀取 CSV 檔案並轉換為 JSON
export async function readCSVFile(filepath: string): Promise<Record<string, unknown>[] | Record<string, unknown> | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'data', filepath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const platform = getPlatformFromPath(filepath);

    // 檢查是否是設備詳情檔案（包含 versions）
    if (content.includes('\n\nversions\n')) {
      return parseDeviceCSV(content, platform);
    }

    return parseCSV(content, platform);
  } catch {
    return null;
  }
}

// 讀取 JSON 檔案（向後兼容）
export async function readDataFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}

// ETag 快取儲存
const etagCache = new Map<string, { etag: string; data: Record<string, unknown>[] | Record<string, unknown> }>();

// Fetch CSV 檔案（客戶端）- 支援 gzip 和 ETag
export async function fetchCSVFile(filepath: string) {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/${filepath}`;

    // 準備請求標頭
    const headers: HeadersInit = {
      'Accept-Encoding': 'gzip, deflate, br',
    };

    // 如果有快取的 ETag，加入 If-None-Match
    const cached = etagCache.get(filepath);
    if (cached?.etag) {
      headers['If-None-Match'] = cached.etag;
    }

    const res = await fetch(url, {
      cache: 'no-cache', // 使用 ETag 驗證而非強制快取
      headers,
    });

    // 304 Not Modified - 使用快取資料
    if (res.status === 304 && cached) {
      return cached.data;
    }

    if (!res.ok) return null;

    const content = await res.text();
    const platform = getPlatformFromPath(filepath);

    let data: Record<string, unknown>[] | Record<string, unknown>;
    if (content.includes('\n\nversions\n')) {
      data = parseDeviceCSV(content, platform);
    } else {
      data = parseCSV(content, platform);
    }

    // 儲存 ETag 和資料到快取
    const etag = res.headers.get('ETag');
    if (etag) {
      etagCache.set(filepath, { etag, data });
    }

    return data;
  } catch {
    // 發生錯誤時嘗試使用快取
    const cached = etagCache.get(filepath);
    if (cached) return cached.data;
    return null;
  }
}

// 運行時使用 fetch
export async function fetchDataFile(filename: string) {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/${filename}`;
    const res = await fetch(url, { cache: 'force-cache' });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

// ===== 新的資料存取 API =====

// 取得所有 Android 廠牌
export async function getBrands() {
  if (typeof window === 'undefined') {
    const data = await readCSVFile('android/brands.csv');
    if (Array.isArray(data)) {
      // 為每個品牌生成 id（如果沒有的話）
      return data.map(b => ({
        ...b,
        id: b.id || b.slug || generateSlug(String(b.name)),
        slug: b.slug || generateSlug(String(b.name)),
      }));
    }
    // 向後兼容 JSON
    return readDataFile('android.json');
  }
  const data = await fetchCSVFile('android/brands.csv');
  if (Array.isArray(data)) {
    return data.map((b: Record<string, unknown>) => ({
      ...b,
      id: b.id || b.slug || generateSlug(String(b.name)),
      slug: b.slug || generateSlug(String(b.name)),
    }));
  }
  return fetchDataFile('android.json');
}

// 取得 iOS 設備列表
export async function getIOSDevices() {
  if (typeof window === 'undefined') {
    const data = await readCSVFile('ios/devices.csv');
    if (data) return data;
    return readDataFile('ios.json');
  }
  const data = await fetchCSVFile('ios/devices.csv');
  if (data) return data;
  return fetchDataFile('ios.json');
}

// 取得特定廠牌的設備列表
export async function getBrandDevices(brand: string) {
  if (typeof window === 'undefined') {
    const data = await readCSVFile(`android/${brand}/devices.csv`);
    if (data) return data;
    return readDataFile(`${brand}.json`);
  }
  const data = await fetchCSVFile(`android/${brand}/devices.csv`);
  if (data) return data;
  return fetchDataFile(`${brand}.json`);
}

// 取得 iOS 設備詳情
export async function getIOSDeviceDetail(slug: string) {
  if (typeof window === 'undefined') {
    const data = await readCSVFile(`ios/devices/${slug}.csv`);
    if (data) return data;
    return readDataFile(`${slug}.json`);
  }
  const data = await fetchCSVFile(`ios/devices/${slug}.csv`);
  if (data) return data;
  return fetchDataFile(`${slug}.json`);
}

// 取得 Android 設備詳情
export async function getAndroidDeviceDetail(brand: string, slug: string) {
  if (typeof window === 'undefined') {
    const data = await readCSVFile(`android/${brand}/devices/${slug}.csv`);
    if (data) return data;
    return readDataFile(`${slug}.json`);
  }
  const data = await fetchCSVFile(`android/${brand}/devices/${slug}.csv`);
  if (data) return data;
  return fetchDataFile(`${slug}.json`);
}

// 統一的資料讀取函數（向後兼容）
export async function getDataFile(filename: string) {
  if (typeof window === 'undefined') {
    return readDataFile(filename);
  }
  return fetchDataFile(filename);
}
