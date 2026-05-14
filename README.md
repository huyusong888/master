# Excel 英文括注翻译工具

一个可直接打开、也可部署成在线网页的静态小工具，用于把 Excel 里的英文文本批量改写成：

```text
Original English（中文翻译）
```

## 使用方式

1. 打开 `index.html`，或访问部署后的网页地址。
2. 上传 `.xlsx`、`.xlsm`、`.xls` 或 `.csv` 文件。
3. 点击“扫描”确认待翻译单元格。
4. 选择翻译服务。
5. 点击“翻译并导出”。

## 翻译服务

- `MyMemory 免费接口`：开箱即用，适合少量内容。
- `LibreTranslate 自定义接口`：填写自己的 LibreTranslate 服务地址。
- `云端代理接口`：适合公开分享给别人使用，把 API Key 放在服务端代理里。
- `OpenAI 兼容接口`：填写 `/v1/chat/completions` 接口地址、API Key 和模型。
- `演示模式`：不调用网络接口，用于测试导出流程。

## 公开分享

详见 `DEPLOY.md`。

最简单的方式是把本目录部署到 GitHub Pages、Netlify、Vercel 或任意静态 Web 服务器。不要把固定 API Key 写进 `index.html`；如果希望别人免填 Key，使用 `cloudflare-worker.js` 部署一个代理接口。

## 说明

- 表格解析在浏览器本地完成。
- 只有识别到英文字母的文本单元格会被处理。
- 已带中文括注的单元格默认会跳过。
- 重复英文文本只请求一次翻译。
