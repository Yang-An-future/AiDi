<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# AI Di+ 實驗方案計劃網站

原始版本由 AI Studio 產生，現已調整為可部署至 Render，並使用 Firebase（Firestore + Auth）作為內容資料庫與管理後台登入機制。

## 專案結構

- `src/` — React 前端（Vite + Tailwind CSS 4）
- `server/` — Express server，production 模式下用來 serve 前端build結果，並提供受保護的 `/api/*` 路由（使用 Firebase Admin SDK 驗證登入使用者）
- `scripts/seed.mjs` — 將範例內容寫入 Firestore 的一次性腳本
- `firestore.rules` — Firestore 安全規則（公開讀取，登入後才能寫入）
- `render.yaml` — Render 部署設定（Node Web Service）

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   `npm install`
2. 複製 `.env.example` 為 `.env.local`，並填入：
   - `GEMINI_API_KEY`（如有使用 Gemini API 功能）
   - `VITE_FIREBASE_*`：Firebase Console → 專案設定 → 一般 → 你的應用程式（Web App）取得
   - `FIREBASE_SERVICE_ACCOUNT_JSON`：Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰，將整份 JSON 貼成一行字串（僅本機/後端使用，切勿提交到版本控制）
3. （選用）將範例公告/課程/回顧/組織資料寫入 Firestore：
   `npm run seed`
4. 啟動前端開發伺服器：
   `npm run dev`

## Firebase 設定步驟

1. 在 Firebase Console 開啟 **Firestore Database**，選擇正式環境模式建立資料庫。
2. 佈署 `firestore.rules`（Firebase Console → Firestore → 規則，貼上本檔內容並發布，或使用 `firebase deploy --only firestore:rules`）。
3. 在 **Authentication** 啟用 Email/Password 登入方式，並新增一個管理員帳號（用於 `/admin/login`）。
4. 用 `npm run seed` 寫入範例資料，之後可直接在 Firestore Console 編輯 `announcements`、`courses`、`reviews`、`schools`、`assistants`、`org/principalInvestigator` 等集合／文件。

## 部署到 Render

1. 將專案推送到 GitHub（本地目前尚未初始化 git）。
2. 在 Render 建立新的 **Blueprint**（會自動讀取 `render.yaml`），或手動建立 **Web Service**：
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
3. 在 Render 的 Environment 設定填入：`GEMINI_API_KEY`、`VITE_FIREBASE_*` 六項、`FIREBASE_SERVICE_ACCOUNT_JSON`。
   - `VITE_*` 變數會在 build 階段被打包進前端程式碼，務必在觸發 build 前設定好。
4. 部署完成後，於瀏覽器開啟服務網址，`/admin/login` 即為管理後台登入頁。

## 管理後台

- `/admin/login`：以 Firebase Auth 帳號密碼登入
- `/admin`：登入後可看到目前狀態；實際的內容編輯介面尚未建置，暫時請直接在 Firestore Console 維護資料
- `server/index.js` 已提供 `requireAuth` middleware 範例（驗證 Firebase ID Token），未來要加後端寫入 API 時可直接複用
