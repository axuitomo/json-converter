# JSON格式转换工具

一个功能强大的JSON格式转换工具，支持AI转换和本地转换两种模式，可以将JSON数据转换为LunaTV/MoonTV或Omnibox格式。

## 功能特性

- 🔄 **双模式转换**：支持AI转换和本地转换两种模式
- 🤖 **AI转换**：支持配置自定义API地址、API Key和模型选择
- 📥 **URL获取**：支持从URL直接获取待转换的JSON数据
- 📋 **格式支持**：支持LunaTV/MoonTV和Omnibox两种输出格式
- ✨ **自动补全**：智能识别输入数据并自动填充目标格式字段
- 📤 **便捷操作**：支持格式化、复制、下载等操作

## 技术栈

- Vue 3 - 渐进式JavaScript框架
- Vite - 下一代前端构建工具
- Element Plus - 基于Vue 3的组件库
- Axios - HTTP客户端

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用说明

### 本地转换模式

1. 选择"本地转换"模式
2. 选择输出格式（LunaTV/MoonTV 或 Omnibox）
3. 在左侧输入或粘贴JSON数据，或点击"从URL获取"按钮
4. 点击"转换"按钮
5. 转换结果将显示在右侧，可以复制或下载

### AI转换模式

1. 选择"AI转换"模式
2. 填写API地址（例如：`https://api.openai.com/v1`）
3. 填写API Key
4. 点击"获取模型"按钮获取可用模型列表
5. 选择要使用的模型
6. 选择输出格式
7. 输入待转换的JSON数据
8. 点击"转换"按钮
9. AI将自动完成格式转换

## 支持的格式

### LunaTV/MoonTV格式

```json
[
  {
    "name": "",
    "key": "",
    "api": "",
    "detail": "",
    "disabled": false,
    "is_adult": true
  }
]
```

### Omnibox格式

```json
[
  {
    "id": "",
    "key": "",
    "name": "",
    "api": "",
    "type": 2,
    "isActive": 1,
    "time": "",
    "isDefault": 0,
    "remark": "",
    "tags": [""],
    "priority": 0
  }
]
```

## GitHub Actions

项目配置了GitHub Actions自动构建和部署：

- 当代码推送到main或master分支时自动触发构建
- 构建成功后自动部署到GitHub Pages

## 项目结构

```
json-converter/
├── src/
│   ├── components/
│   │   └── Converter.vue      # 主转换组件
│   ├── utils/
│   │   ├── converter.js        # 本地转换逻辑
│   │   └── aiService.js        # AI转换服务
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
├── .github/
│   └── workflows/
│       └── build.yml           # GitHub Actions配置
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

