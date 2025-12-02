import { createWorker } from 'tesseract.js';

interface OcrResult {
  shop?: string;
  name?: string;
  price?: number;
  capacity?: string;
  flavor?: string;
  cupSize?: string;
}

// 从文本中提取咖啡记录信息
function parseCoffeeInfo(text: string): OcrResult {
  const result: OcrResult = {};
  
  // 提取价格
  const priceMatch = text.match(/(?:价格|金额|实付|付款)[:：]?\s*([0-9]+\.?[0-9]*)/i);
  if (priceMatch) {
    result.price = parseFloat(priceMatch[1]);
  }
  
  // 提取店铺名称
  const shopMatch = text.match(/(?:商家|店铺|品牌)[:：]?\s*([^\n]+)/i);
  if (shopMatch) {
    result.shop = shopMatch[1].trim();
  }
  
  // 提取咖啡名称
  const nameMatch = text.match(/(?:商品|名称|产品)[:：]?\s*([^\n]+)/i);
  if (nameMatch) {
    result.name = nameMatch[1].trim();
  }
  
  // 提取容量
  const capacityMatch = text.match(/(?:容量|规格)[:：]?\s*([^\n]+)/i);
  if (capacityMatch) {
    result.capacity = capacityMatch[1].trim();
  }
  
  // 提取口味
  const flavorMatch = text.match(/(?:口味|风味)[:：]?\s*([^\n]+)/i);
  if (flavorMatch) {
    result.flavor = flavorMatch[1].trim();
  }
  
  // 提取杯量
  const cupSizeMatch = text.match(/(?:杯型|杯量|大小)[:：]?\s*([^\n]+)/i);
  if (cupSizeMatch) {
    result.cupSize = cupSizeMatch[1].trim();
  }
  
  // 如果没有找到明确的字段，尝试从文本中提取关键字
  if (!result.cupSize) {
    const sizeMatch = text.match(/(大|中|小)杯/i);
    if (sizeMatch) {
      result.cupSize = sizeMatch[0];
    }
  }
  
  return result;
}

// 主OCR函数，处理图片并返回解析结果
export async function processImageForCoffeeInfo(image: File | string): Promise<OcrResult> {
  try {
    // 创建worker，使用默认配置
    const worker = await createWorker();
    
    let imageSource: string | File = image;
    if (typeof image === 'string') {
      // 如果是URL，直接使用
      imageSource = image;
    } else {
      // 如果是File对象，转换为Data URL
      imageSource = URL.createObjectURL(image);
    }
    
    // 使用简单的recognize调用
    const { data: { text } } = await worker.recognize(imageSource);
    console.log('OCR识别结果:', text);
    
    const parsedInfo = parseCoffeeInfo(text);
    
    // 销毁worker
    await worker.terminate();
    
    // 如果是File对象，释放URL
    if (typeof image === 'object') {
      URL.revokeObjectURL(imageSource);
    }
    
    return parsedInfo;
  } catch (error) {
    console.error('OCR处理失败:', error);
    return {};
  }
}

// 将图片转换为Data URL
export function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to convert image to Data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}