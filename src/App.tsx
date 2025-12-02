import React, { useState } from 'react';
import CoffeeForm from './components/CoffeeForm';
import CoffeeList from './components/CoffeeList';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>咖啡外卖记录</h1>
        <p className="app-subtitle">记录每一杯咖啡的美好时光</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          记录列表
        </button>
        <button
          className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          添加记录
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' ? <CoffeeList /> : <CoffeeForm />}
      </main>

      <footer className="app-footer">
        <p>咖啡记录 © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;