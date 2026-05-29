# Cấu trúc thư mục dự án

Dưới đây là sơ đồ cấu trúc thư mục hiện tại của workspace (tầng gốc là thư mục dự án):

```
customlink/
├─ AGENTS.md
├─ CLAUDE.md
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ tsconfig.json
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ api/
│     └─ convert/
│        └─ route.ts
├─ lib/
└─ public/
```

Ghi chú nhanh:
- Endpoint API chính: `app/api/convert/route.ts`
- Trang giao diện chính: `app/page.tsx`

Cách tạo lại danh sách này trên máy local (Windows PowerShell):

```powershell
# liệt kê cây thư mục
tree /F
```

Hoặc trên macOS / Linux:

```bash
ls -R
# hoặc dùng tree nếu đã cài
tree -a
```

Nếu bạn muốn, mình có thể mở rộng file này (thêm mô tả cho từng file, link code, hoặc tự động cập nhật từ git).