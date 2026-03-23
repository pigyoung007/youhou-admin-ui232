# Youhou Admin UI

后台管理系统前端项目，基于 Next.js + React + TypeScript + Tailwind CSS。

## 环境要求

- Node.js 18.18+（建议 Node.js 20+）
- pnpm 8+

## 本地开发

```bash
pnpm install --no-frozen-lockfile
pnpm dev
```

默认访问地址：`http://localhost:3000`

## 生产构建与启动

```bash
pnpm build
pnpm start
```

## 常用脚本

- `pnpm dev`：开发模式
- `pnpm build`：生产构建
- `pnpm start`：启动生产服务
- `pnpm lint`：代码检查（当前项目使用 `next lint`）

## 目录说明

- `app/`：页面与路由
- `components/`：通用组件与业务组件
- `hooks/`：自定义 Hooks
- `lib/`：工具函数与模拟数据
- `public/`：静态资源

## 备注

- 本仓库仅包含代码与运行所需配置文件。
