# 咖啡外卖记录应用

一个用于记录和管理咖啡外卖订单的Web应用，支持图片上传、OCR识别、记录统计和筛选功能，专为手机操作优化设计。

## 功能特性

### 📸 图片识别
- 支持上传咖啡订单图片
- 自动OCR识别图片中的关键信息
- 识别内容包括：店铺名称、咖啡名称、价格、容量、口味、杯量

### 📝 记录管理
- 手动编辑和补充识别结果
- 添加个人口感评价和感受
- 查看所有历史记录
- 支持删除记录

### 📊 统计分析
- 显示总记录数
- 计算总花费金额
- 统计平均价格
- 支持按多种条件筛选

### 🔍 筛选功能
- 按店铺名称筛选
- 按价格范围筛选
- 按口味筛选
- 按杯量筛选

### 📱 移动端优化
- 响应式设计，适配手机屏幕
- 流畅的动画效果
- 直观的交互界面

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **OCR引擎**: Tesseract.js
- **样式**: 原生CSS
- **部署**: Docker + Nginx

## 快速开始

### 本地开发

1. 克隆仓库
```bash
git clone https://github.com/your-username/coffee-record-app.git
cd coffee-record-app
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问
```
http://localhost:5173
```

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### Docker部署

1. 构建Docker镜像
```bash
docker build -t coffee-record-app .
```

2. 运行Docker容器
```bash
docker run -d -p 80:80 --name coffee-record coffee-record-app
```

3. 访问应用
```
http://localhost
```

## 使用说明

### 添加记录

1. 点击底部导航栏的「添加记录」
2. 点击「点击上传图片」区域，选择咖啡订单图片
3. 系统自动识别图片内容，填充表单
4. 手动调整识别结果（如需要）
5. 添加个人感受和评价
6. 点击「保存记录」

### 查看记录

1. 点击底部导航栏的「记录列表」
2. 查看所有咖啡记录卡片
3. 点击「展开筛选」可进行条件筛选
4. 查看统计信息（总记录数、总花费、平均价格）
5. 点击记录卡片上的「删除」按钮可删除记录

### 筛选记录

1. 在「记录列表」页面，点击「展开筛选」
2. 选择筛选条件：
   - 店铺名称
   - 最低价格
   - 最高价格
   - 口味
   - 杯量
3. 点击「应用筛选」查看结果
4. 点击「清除筛选」重置筛选条件

## 项目结构

```
├── src/
│   ├── components/          # React组件
│   │   ├── CoffeeForm.tsx   # 咖啡记录表单
│   │   └── CoffeeList.tsx   # 咖啡记录列表
│   ├── stores/              # 状态管理
│   │   └── coffeeStore.ts   # 咖啡记录store
│   ├── types/               # TypeScript类型定义
│   │   └── coffee.ts        # 咖啡记录类型
│   ├── utils/               # 工具函数
│   │   └── ocr.ts           # OCR处理函数
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 应用样式
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── Dockerfile               # Docker配置文件
├── .dockerignore            # Docker忽略文件
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript配置
└── vite.config.ts           # Vite配置
```

## 技术细节

### OCR识别

使用Tesseract.js库进行文字识别，支持中英文混合识别。识别流程：

1. 用户上传图片
2. 转换为Data URL
3. 调用Tesseract.js进行文字识别
4. 解析识别结果，提取关键信息
5. 填充到表单中

### 数据持久化

使用Zustand的persist中间件，将数据持久化到浏览器的localStorage中，刷新页面不会丢失数据。

### 响应式设计

使用CSS媒体查询和Flexbox/Grid布局，确保应用在不同屏幕尺寸下都能良好显示：

- 手机端：单列布局，垂直排列
- 平板端：优化间距和大小
- 桌面端：更宽的容器，更好的信息展示

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 致谢

- [React](https://react.dev/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vitejs.dev/) - 构建工具
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR引擎

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: https://github.com/your-username/coffee-record-app/issues
- Email: your-email@example.com

---

**享受每一杯咖啡，记录美好时光！** ☕️