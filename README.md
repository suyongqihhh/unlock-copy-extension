# Unlock Copy Pro - 一键解除复制限制

🔓 一个轻量级的浏览器扩展，帮助你一键解除网站的复制、右键、选择限制。支持 CSDN、百度文库、知乎、微信公众号等顽固平台。

## ✨ 功能特性

- **🔓 一键解除限制**：点击按钮即可解除当前网页的复制限制
- **🤖 自动复制选中文本**：选中文字后自动复制到剪贴板，绕过复制提示
- **🛡️ 多层防护解除**：同时移除内联事件、CSS 样式、JavaScript 事件监听
- **📱 全面兼容**：支持绝大多数有复制限制的网站
- **⚡ 轻量无广告**：纯原生代码，无任何追踪或广告
- **🔓 完全开源**：代码完全透明，可自由查看和修改

## 🎯 支持的平台

### 完全支持
- ✅ CSDN（代码复制提示已绕过）
- ✅ 知乎
- ✅ 简书
- ✅ 掘金
- ✅ 微信公众号文章
- ✅ 各种技术博客和文档站

### 部分支持（取决于网站实现方式）
- ⚠️ 百度文库（部分内容可能无法复制，如图片转文字）
- ⚠️ 道客巴巴
- ⚠️ 原创力文档
- ⚠️ 各种付费文档平台

## 🚀 安装方法

### 方法一：开发者模式加载（推荐）

1. 下载本项目的 ZIP 压缩包并解压
2. 打开浏览器，进入 `chrome://extensions/`（Chrome）或相应扩展页面（Tabbit 等 Chromium 浏览器）
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择解压后的文件夹
6. 完成！

### 方法二：克隆仓库

```bash
git clone https://github.com/你的用户名/unlock-copy-extension.git
```

## 📖 使用方法

1. 打开想要复制内容的网页
2. 点击浏览器工具栏上的 Unlock Copy Pro 图标
3. 在弹出窗口中点击「解除复制限制」按钮
4. **新功能**：选中文字后会自动复制到剪贴板，绕过复制提示！
5. 现在你可以自由复制网页内容了！

### 快捷键

- **Ctrl+A**：全选（绕过限制）
- **Ctrl+C**：复制（自动拦截并复制）
- **鼠标选择后自动复制**：选中即复制，无需手动 Ctrl+C

## 🔧 技术原理

本扩展通过以下多层方式解除复制限制：

### 1. 移除内联事件处理器
- 清除 `oncopy`、`oncontextmenu`、`onselectstart` 等内联事件

### 2. 覆盖事件监听器
- 拦截并绕过 `addEventListener` 注册的复制限制事件
- 阻止 `preventDefault()` 和 `stopPropagation()` 的实际执行

### 3. 移除 CSS 限制
- 强制覆盖 `user-select: none` 等 CSS 属性
- 针对特定平台的样式进行专门修复

### 4. 自动复制机制
- 监听文本选择，自动将选中内容复制到剪贴板
- 绕过依赖提示的复制机制（如 CSDN）

### 5. 移除保护元素
- 隐藏复制提示弹窗
- 移除登录提示遮罩

## 🛠️ 项目结构

```
unlock-copy-extension/
├── manifest.json          # 扩展配置文件（Manifest V3）
├── content.js            # 内容脚本（核心功能）
├── popup.html            # 弹出窗口 HTML
├── popup.js              # 弹出窗口逻辑
├── background.js         # 后台服务脚本
├── icons/                # 图标文件
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md             # 项目说明文档
└── LICENSE               # MIT 开源协议
```

## 📝 版本历史

### v1.1.0（当前版本）
- ✨ 新增自动复制选中文本功能
- ✨ 增强 CSDN 复制提示绕过
- ✨ 添加对更多顽固平台的支持
- 🐛 修复多处已知问题

### v1.0.0
- 🎉 初始版本发布
- ✅ 基础复制限制解除功能

## ⚠️ 免责声明

本扩展仅供学习和研究使用。请尊重网站的内容和版权，不要用于非法用途。使用本扩展产生的任何后果由使用者自行承担。

## 📄 开源协议

本项目采用 MIT 协议开源。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📧 联系方式

- 问题反馈：[GitHub Issues](https://github.com/你的用户名/unlock-copy-extension/issues)

## ⭐ Star History

如果你觉得这个项目对你有帮助，欢迎给个 Star ⭐️

---

**Made with ❤️**
