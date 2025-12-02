import React, { useState } from 'react';
import { useCoffeeStore } from '../stores/coffeeStore';
import { processImageForCoffeeInfo, imageToDataUrl } from '../utils/ocr';
import dayjs from 'dayjs';

const CoffeeForm: React.FC = () => {
  const addRecord = useCoffeeStore((state) => state.addRecord);
  
  const [formData, setFormData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    shop: '',
    name: '',
    price: 0,
    capacity: '',
    flavor: '',
    cupSize: '',
    notes: '',
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }

    setImage(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setError(null);

    // 开始OCR处理
    setIsProcessing(true);
    try {
      const ocrResult = await processImageForCoffeeInfo(file);
      setFormData(prev => ({
        ...prev,
        shop: ocrResult.shop || '',
        name: ocrResult.name || '',
        price: ocrResult.price || 0,
        capacity: ocrResult.capacity || '',
        flavor: ocrResult.flavor || '',
        cupSize: ocrResult.cupSize || '',
      }));
    } catch (err) {
      setError('OCR处理失败，请手动输入');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl: string | undefined;
      if (image) {
        imageUrl = await imageToDataUrl(image);
      }
      
      addRecord({
        ...formData,
        imageUrl,
      });
      
      // 重置表单
      setFormData({
        date: dayjs().format('YYYY-MM-DD'),
        shop: '',
        name: '',
        price: 0,
        capacity: '',
        flavor: '',
        cupSize: '',
        notes: '',
      });
      setImage(null);
      setPreviewUrl(null);
      setError(null);
      
      alert('记录添加成功！');
    } catch (err) {
      setError('添加记录失败，请重试');
      console.error(err);
    }
  };

  return (
    <div className="coffee-form-container">
      <h2>添加咖啡记录</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="coffee-form">
        {/* 图片上传部分 */}
        <div className="form-section">
          <label htmlFor="image">上传订单图片</label>
          <div className="image-upload-area">
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="订单预览" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  移除
                </button>
              </div>
            )}
            
            {!previewUrl && (
              <label className="upload-label">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className="upload-placeholder">
                  {isProcessing ? '正在识别...' : '点击上传图片'}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* 基本信息部分 */}
        <div className="form-section">
          <h3>基本信息</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">日期</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shop">店铺名称</label>
              <input
                type="text"
                id="shop"
                name="shop"
                value={formData.shop}
                onChange={handleInputChange}
                placeholder="例如：星巴克"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">咖啡名称</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="例如：美式咖啡"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">价格 (元)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="例如：28.00"
                required
              />
            </div>
          </div>
        </div>

        {/* 咖啡详情部分 */}
        <div className="form-section">
          <h3>咖啡详情</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">容量</label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="例如：450ml"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="flavor">口味</label>
              <input
                type="text"
                id="flavor"
                name="flavor"
                value={formData.flavor}
                onChange={handleInputChange}
                placeholder="例如：无糖"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cupSize">杯量</label>
              <input
                type="text"
                id="cupSize"
                name="cupSize"
                value={formData.cupSize}
                onChange={handleInputChange}
                placeholder="例如：中杯"
              />
            </div>
          </div>
        </div>

        {/* 备注部分 */}
        <div className="form-section">
          <h3>个人感受</h3>
          <div className="form-group">
            <label htmlFor="notes">口感评价</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="描述一下你的感受，例如：口感醇厚，酸度适中..."
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            保存记录
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoffeeForm;