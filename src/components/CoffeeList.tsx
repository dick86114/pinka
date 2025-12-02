import React, { useState } from 'react';
import type { CoffeeRecord } from '../types/coffee';
import { useFilteredRecords, useCoffeeStore } from '../stores/coffeeStore';

const CoffeeList: React.FC = () => {
  const records = useFilteredRecords();
  const deleteRecord = useCoffeeStore((state) => state.deleteRecord);
  const setFilters = useCoffeeStore((state) => state.setFilters);
  const clearFilters = useCoffeeStore((state) => state.clearFilters);
  const getUniqueShops = useCoffeeStore((state) => state.getUniqueShops);
  const getUniqueFlavors = useCoffeeStore((state) => state.getUniqueFlavors);
  const getUniqueCupSizes = useCoffeeStore((state) => state.getUniqueCupSizes);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterData, setFilterData] = useState({
    shop: '',
    minPrice: '',
    maxPrice: '',
    flavor: '',
    cupSize: '',
  });

  // 处理筛选条件变化
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFilterData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 应用筛选条件
  const applyFilters = () => {
    setFilters({
      shop: filterData.shop || undefined,
      minPrice: filterData.minPrice ? parseFloat(filterData.minPrice) : undefined,
      maxPrice: filterData.maxPrice ? parseFloat(filterData.maxPrice) : undefined,
      flavor: filterData.flavor || undefined,
      cupSize: filterData.cupSize || undefined,
    });
  };

  // 清除筛选条件
  const handleClearFilters = () => {
    setFilterData({
      shop: '',
      minPrice: '',
      maxPrice: '',
      flavor: '',
      cupSize: '',
    });
    clearFilters();
  };

  // 计算统计数据
  const calculateStats = () => {
    if (records.length === 0) return {
      totalSpent: 0,
      avgPrice: 0,
      totalRecords: 0,
    };

    const totalSpent = records.reduce((sum, record) => sum + record.price, 0);
    const avgPrice = totalSpent / records.length;

    return {
      totalSpent,
      avgPrice,
      totalRecords: records.length,
    };
  };

  const stats = calculateStats();

  // 渲染单个咖啡记录
  const renderRecord = (record: CoffeeRecord) => {
    return (
      <div key={record.id} className="coffee-card">
        <div className="coffee-card-header">
          <h3 className="coffee-name">{record.name}</h3>
          <span className="coffee-price">¥{record.price.toFixed(2)}</span>
        </div>
        
        <div className="coffee-card-content">
          <div className="coffee-info">
            <div className="info-row">
              <span className="info-label">店铺：</span>
              <span className="info-value">{record.shop}</span>
            </div>
            <div className="info-row">
              <span className="info-label">日期：</span>
              <span className="info-value">{record.date}</span>
            </div>
            <div className="info-row">
              <span className="info-label">容量：</span>
              <span className="info-value">{record.capacity}</span>
            </div>
            <div className="info-row">
              <span className="info-label">口味：</span>
              <span className="info-value">{record.flavor}</span>
            </div>
            <div className="info-row">
              <span className="info-label">杯量：</span>
              <span className="info-value">{record.cupSize}</span>
            </div>
            {record.notes && (
              <div className="info-row notes">
                <span className="info-label">感受：</span>
                <span className="info-value">{record.notes}</span>
              </div>
            )}
          </div>
          
          {record.imageUrl && (
            <div className="coffee-image">
              <img src={record.imageUrl} alt={record.name} />
            </div>
          )}
        </div>
        
        <div className="coffee-card-actions">
          <button 
            className="delete-btn" 
            onClick={() => deleteRecord(record.id)}
            aria-label="删除记录"
          >
            删除
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="coffee-list-container">
      <div className="list-header">
        <h2>咖啡记录列表</h2>
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '收起筛选' : '展开筛选'} {showFilters ? '▼' : '▲'}
        </button>
      </div>
      
      {/* 统计信息 */}
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-label">总记录数</span>
          <span className="stat-value">{stats.totalRecords}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">总花费</span>
          <span className="stat-value">¥{stats.totalSpent.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">平均价格</span>
          <span className="stat-value">¥{stats.avgPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {/* 筛选条件 */}
      {showFilters && (
        <div className="filter-section">
          <h3>筛选条件</h3>
          <div className="filter-form">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="filter-shop">店铺</label>
                <select
                  id="filter-shop"
                  name="shop"
                  value={filterData.shop}
                  onChange={handleFilterChange}
                >
                  <option value="">全部</option>
                  {getUniqueShops().map(shop => (
                    <option key={shop} value={shop}>{shop}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="filter-flavor">口味</label>
                <select
                  id="filter-flavor"
                  name="flavor"
                  value={filterData.flavor}
                  onChange={handleFilterChange}
                >
                  <option value="">全部</option>
                  {getUniqueFlavors().map(flavor => (
                    <option key={flavor} value={flavor}>{flavor}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="filter-cupSize">杯量</label>
                <select
                  id="filter-cupSize"
                  name="cupSize"
                  value={filterData.cupSize}
                  onChange={handleFilterChange}
                >
                  <option value="">全部</option>
                  {getUniqueCupSizes().map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="filter-minPrice">最低价格</label>
                <input
                  type="number"
                  id="filter-minPrice"
                  name="minPrice"
                  value={filterData.minPrice}
                  onChange={handleFilterChange}
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="filter-maxPrice">最高价格</label>
                <input
                  type="number"
                  id="filter-maxPrice"
                  name="maxPrice"
                  value={filterData.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="99"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="apply-filter-btn" onClick={applyFilters}>
                应用筛选
              </button>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                清除筛选
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 记录列表 */}
      <div className="records-section">
        {records.length === 0 ? (
          <div className="no-records">
            <p>暂无咖啡记录</p>
            <p>点击上方「添加咖啡记录」开始记录</p>
          </div>
        ) : (
          <div className="records-grid">
            {records.map(renderRecord)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeList;