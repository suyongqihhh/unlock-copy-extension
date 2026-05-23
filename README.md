# Unlock Copy - 一键解除复制限制

🔓 一个轻量级的浏览器扩展，帮助你一键解除网站的复制、右键、选择限制。

## ✨ 功能特性

- **一键解除限制**：点击按钮即可解除当前网页的复制限制
- **智能识别**：自动识别并移除多种复制限制手段
- **兼容性强**：支持绝大多数网站（知乎、微信公众号、百度文库等）
- **轻量无广告**：纯原生代码，无任何追踪或广告
- **开源免费**：代码完全开源，可自由查看和修改

## 🎯 支持的网站

- 知乎
- 微信公众号文章
- 百度文库
- 道客巴巴
- 原创力文档
- 等各类有复制限制的网站

## 🚀 安装方法

### 方法一：从 Chrome Web Store 安装（待上架）

*正在申请上架，敬请期待...*

### 方法二：开发者模式加载

1. 下载本项目的 ZIP 压缩包并解压
2. 打开浏览器，进入 `chrome://extensions/`（Chrome）或相应扩展页面（Tabbit 等 Chromium 浏览器）
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择解压后的文件夹
6. 完成！

### 方法三：克隆仓库

```bash
git clone https://github.com/你的用户名/unlock-copy-extension.git
```

然后按照方法二加载扩展。

## 📖 使用方法

1. 打开想要复制内容的网页
2. 点击浏览器工具栏上的 Unlock Copy 图标
3. 在弹出窗口中点击「解除复制限制」按钮
4. 现在你可以自由复制网页内容了！

## 🔧 技术原理

本扩展通过以下方式解除复制限制：

1. **移除内联事件处理器**：清除 `oncopy`、`oncontextmenu` 等内联事件
2. **覆盖 addEventListener**：拦截并绕过复制限制相关的事件监听
3. **移除 CSS 限制**：覆盖 `user-select: none` 等 CSS 属性
4. **拦截事件阻止**：阻止网站调用 `preventDefault()` 和 `stopPropagation()`

## 🛠️ 开发说明

### 项目结构

```
unlock-copy-extension/
├── manifest.json          # 扩展配置文件
├── content.js            # 内容脚本（核心功能）
├── popup.html            # 弹出窗口 HTML
├── popup.js              # 弹出窗口逻辑
├── background.js         # 后台服务脚本
├── icons/                # 图标文件
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # 项目说明文档
```

### 本地开发

1. 修改代码后，在扩展管理页面点击「刷新」按钮
2. 重新加载测试页面以应用更改

## ⚠️ 免责声明

本扩展仅供学习和研究使用。请尊重网站的内容和版权，不要用于非法用途。使用本扩展产生的任何后果由使用者自行承担。

## 📝 开源协议

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
- 邮件联系：your-email@example.com

## ⭐ Star History

如果你觉得这个项目对你有帮助，欢迎给个 Star ⭐️

---

**Made with ❤️ by [你的名字]**
