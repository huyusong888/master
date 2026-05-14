# 公开部署

这个工具是静态网页，`index.html` 可以直接部署到任何静态网站服务。公开分享时，别人访问网页、上传自己的 Excel、选择翻译服务后就能导出结果。

## 最简单：静态部署

适合让使用者自己填写翻译接口，或使用页面里的免费接口。

可选平台：

- GitHub Pages：把本目录推到仓库，启用 Pages，发布根目录。
- Netlify：拖拽整个 `excel-translate-annotator` 文件夹部署。
- Vercel：导入仓库，框架选择 Other，输出目录保持项目根目录。
- 任意 Web 服务器：把本目录作为静态文件目录。

部署后，把生成的网址发给别人即可。

## GitHub Pages 自动部署

项目已包含 `.github/workflows/pages.yml`。推送到 GitHub 的 `main` 分支后，Actions 会自动部署静态页面。

如果第一次部署没有出现网址，到仓库的 `Settings -> Pages` 中把 Source 设为 `GitHub Actions`，然后重新运行 `Deploy static site to GitHub Pages` 工作流。

## 让别人免填 API Key

不要把你的 OpenAI API Key 写进 `index.html`。如果你想让别人打开网页就能使用你的翻译额度，可以部署 `cloudflare-worker.js` 作为代理。

Cloudflare Worker 需要设置环境变量：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4o-mini
```

部署完成后，Worker 地址通常类似：

```text
https://your-worker.your-subdomain.workers.dev/translate
```

在页面里选择“云端代理接口”，把这个地址填进去即可。

## 安全建议

- 公开代理会消耗你的翻译额度，建议加访问控制、频率限制或只发给可信用户。
- Excel 文件在浏览器本地解析；翻译时，待翻译的英文单元格文本会发送到你选择的翻译服务。
- 如果表格包含敏感内容，建议使用自己控制的翻译服务或内网部署。
