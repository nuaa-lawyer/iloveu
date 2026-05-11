# Pixel Confession Love

复古像素风三页告白网站，全部代码合成音效，无需任何音乐文件。使用 HTML + CSS + 原生 JS 构建，后端对接 Cloudflare Pages Functions + KV 云端存储。

## 项目结构

```
pixel-confession-love/
├── index.html              # 第一页：加载过渡页
├── main.html               # 第二页：主视觉告白页
├── message.html            # 第三页：心里话信箱页
├── functions/api/messages.js  # Cloudflare Pages Functions 留言 API
├── .gitignore              # Git 忽略文件
├── README.md               # 本文件
└── deploy-cf-pages.md      # Cloudflare Pages 完整部署教程
```

## 三页功能说明

### 第一页：加载过渡页 (index.html)

- 全屏极简像素风设计
- 复古像素进度条加载动画，文案"与你并肩加载中"
- 纯 JS 代码合成加载细碎音效（超短白噪声 + 带通滤波）
- 加载完毕后自动平滑淡入跳转到主页

### 第二页：主视觉告白页 (main.html)

- **背景**：Canvas 绘制的像素小方块全屏缓慢流动，莫兰迪温柔配色
- **打字机效果**：逐字打出 "I fancy you" 和 "I don't care who was before me, I just hope to be your last."，每字搭配代码合成复古按键音效
- **像素爱心**：8×8 像素爱心在 "I fancy you" 后显示，带呼吸缩放动画
- **鼠标跟随**：红色像素小爱心永久跟随鼠标，带淡入淡出
- **背景音乐**：纯 Web Audio API 合成的三角波柔和旋律，进入页面后自动循环播放
- **按钮交互**：像素风 "continue" 按钮，悬浮/点击都有合成提示音，点击后跳转到留言页
- **页面过渡**：淡入淡出平滑切换

### 第三页：心里话信箱页 (message.html)

- **背景**：延续主页同款流动像素方块（降低透明度不挡文字）
- **To you 区域**：固定展示你写给他/她的心里话（在 HTML 代码中编辑，不可在页面输入）
- **From you 区域**：像素风输入框 + 发送按钮，留言数据存储在 Cloudflare KV
- **留言墙**：时间倒序展示历史留言，像素风卡片样式
- **防重复提交**：发送时按钮禁用，有成功/失败文字提示
- **发送成功音效**：代码合成双音阶上行提示音
- **背景音乐**：与第二页同一首旋律继续循环，不重启

## 音效说明

**全部音效均为纯 JavaScript 代码合成生成，不引入任何 mp3 / wav / 外部音频链接。**

| 音效类型 | 合成原理 | 特点 |
|---------|---------|------|
| 背景音乐 | 三角波振荡器 + 五声音阶旋律循环 | 柔和治愈，低音量 (~0.07 gain) |
| 打字音效 | 白噪声 buffer + 带通滤波器 + 指数衰减 | 模拟复古机械按键声 |
| 按钮悬浮 | 正弦波短促提示 (880Hz) | 极短极轻 |
| 按钮点击 | 双三角波叠加 (660+880Hz) | 像素风 blip 音 |
| 加载碎响 | 超短白噪声 (30ms) + 随机频率滤波 | 细碎柔和 |
| 发送成功 | 双音阶上行 (C5→E5) | 清亮治愈 |

所有音效默认低音量，整体不刺耳不吵闹。如需调整音量，在各 HTML 文件的 JS 代码中搜索 `gain.gain.setValueAtTime` 即可找到音量参数（数值越大越响，建议范围 0.01-0.15）。

## 如何修改 To you 告白文案

打开 `message.html`，找到第 **~120 行**附近的以下注释标记：

```html
<!-- ★★★ To you 文案在此编辑 ★★★ -->
<div class="toyou-content">
  <!-- 👇 在此处下方粘贴你的心里话 👇 -->



  <!-- 👆 在此处上方粘贴你的心里话 👆 -->
</div>
```

在两个箭头注释之间粘贴你想说的话。支持 HTML 标签：

```html
<div class="toyou-content">
  <p>遇见你之后，我才发现</p>
  <p>原来世界可以这么温柔。</p>
  <p>谢谢你出现在我的生命里。</p>
</div>
```

保存文件后刷新页面即可看到效果。

## 如何配置接口地址

打开 `message.html`，找到脚本区域第一行（约第 **220 行**）：

```javascript
var API_BASE_URL = "";
```

将其修改为你的 Cloudflare Pages 部署域名，例如：

```javascript
var API_BASE_URL = "https://pixel-confession.pages.dev";
```

> **注意**：URL 末尾不要加斜杠 `/`。

## 本地预览

直接在浏览器中打开 `index.html` 即可预览全部三页：

```
# Windows 资源管理器
双击 E:\pixel-confession-love\index.html

# 或使用 VS Code Live Server 等本地服务器
```

> 本地预览时留言功能无法使用（需部署到 Cloudflare Pages 后才生效），其他功能（音效、动画、打字机等）完全正常。

## 部署到 Cloudflare Pages

详见 [deploy-cf-pages.md](./deploy-cf-pages.md)，零基础傻瓜式步骤，全程可复制粘贴。

## 技术栈

- **前端**：HTML5 + CSS3 + 原生 JavaScript
- **音效**：Web Audio API（OscillatorNode + AudioBuffer + BiquadFilter）
- **动画**：Canvas API + CSS Keyframes + requestAnimationFrame
- **后端**：Cloudflare Pages Functions
- **存储**：Cloudflare KV
- **字体**：Google Fonts（Press Start 2P + VT323）

## 浏览器兼容性

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- 移动端 Safari / Chrome 均支持

## License

MIT
