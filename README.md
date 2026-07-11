# AI Di+ 實驗方案計劃網站

原始版本由 AI Studio 產生，現已調整為可部署至 Render，並使用 Firebase（Firestore + Storage + Auth）作為內容資料庫、檔案儲存與帳號登入機制。

## 目前狀態

- ✅ GitHub repo：[Yang-An-future/AiDi](https://github.com/Yang-An-future/AiDi)，Render 已連接此 repo 的 `main` 分支
- ✅ Firebase 專案：`aidiweb`（Firestore + Authentication 已啟用）
- ✅ Firestore 已用 `npm run seed` 寫入範例公告／課程／回顧／合作學校／組織資料
- ✅ 三身分登入系統（管理員／大學伴／學習端老師）與各自的後台功能已建置
- ⏳ Render 環境變數需與本機 `.env.local` 同步填入 Render Dashboard
- ⏳ `firestore.rules`、`storage.rules` 需發布到 Firebase Console 才會生效
- ⏳ 需用 `npm run create-admin` 建立第一個管理員帳號（自行註冊只會產生大學伴／學習端老師帳號）

## 身分與權限

| 身分 | 建立方式 | 功能 |
| --- | --- | --- |
| 管理員 | `npm run create-admin` 建立，或由現有管理員在後台調整帳號身分 | 帳號審核（勾選批次啟用/停用、編輯資料）、公告管理、輪播照片管理、課程總表上傳、上傳資料管理與批次下載 |
| 大學伴 | 於 `/signup` 自行註冊 → 待管理員啟用 | 查看課程總表（彈出視窗）、上傳教案 |
| 學習端老師 | 於 `/signup` 自行註冊 → 待管理員啟用 | 上傳學習端設備環境調查、學習需求調查檔案 |

自行註冊的帳號預設為「待審核」狀態，需由管理員在後台「帳號審核」頁籤手動啟用後才能真正登入使用。

## 專案結構

- `src/` — React 前端（Vite + Tailwind CSS 4）
  - `src/pages/admin/` — 管理員後台（帳號審核／公告管理／輪播照片／課程總表／上傳資料管理）
  - `src/pages/mentor/`、`src/pages/teacher/` — 大學伴／學習端老師後台
  - `src/contexts/AuthContext.tsx` — 登入狀態 + Firestore 個人資料（角色/審核狀態）
  - `src/components/OnboardingModal.tsx` — 首次登入的個人資料填寫彈窗
  - `src/components/RequireRole.tsx` — 依角色與帳號狀態保護路由
- `server/` — Express server，production 模式下用來 serve 前端build結果，並提供受保護的 `/api/*` 路由（使用 Firebase Admin SDK 驗證登入使用者）
- `scripts/seed.mjs` — 將範例公告/課程/回顧/學校/組織資料寫入 Firestore 的一次性腳本
- `scripts/createAdmin.mjs` — 建立/晉升管理員帳號
- `firestore.rules` / `storage.rules` — Firestore／Storage 安全規則（角色式存取控制）
- `render.yaml` — Render 部署設定（Node Web Service）
- `LOGO/` — 官方 LOGO 高解析度原始檔（設計來源，網站本身用的是 `src/assets/logo-*.webp` 這些已裁切壓縮過的版本）

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   `npm install`
2. 複製 `.env.example` 為 `.env.local`，並填入：
   - `VITE_FIREBASE_*`：Firebase Console → 專案設定 → 一般 → 你的應用程式（Web App）取得
   - `FIREBASE_SERVICE_ACCOUNT_JSON`：Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰，將整份 JSON 貼成一行字串（僅本機/後端使用，`.env.local` 已被 `.gitignore` 排除，切勿提交到版本控制）
3. 將範例公告/課程/回顧/組織資料寫入 Firestore（首次設定時執行一次即可，之後請直接在 Firestore Console 編輯）：
   `npm run seed`
4. 建立第一個管理員帳號：
   `npm run create-admin -- admin@example.com "StrongPassw0rd" "管理員姓名"`
5. 啟動前端開發伺服器：
   `npm run dev`

## Firebase 設定步驟

1. 在 Firebase Console 開啟 **Firestore Database**，選擇正式環境模式建立資料庫。
2. 開啟 **Storage**，建立預設 bucket（用於輪播照片、課程總表、教案與調查檔案）。
3. 發布安全規則：
   - Firebase Console → Firestore Database → 規則，貼上 `firestore.rules` 內容並發布
   - Firebase Console → Storage → 規則，貼上 `storage.rules` 內容並發布
   - 兩者也可用 `firebase deploy --only firestore:rules,storage:rules`（需先 `firebase login`）
4. 在 **Authentication** 啟用 Email/Password 登入方式。
5. 用 `npm run create-admin -- <email> <password> <name>` 建立第一個管理員帳號。
6. 用 `npm run seed` 寫入範例首頁內容，之後可直接在管理後台或 Firestore Console 編輯。

## 部署到 Render

1. 專案已推送到 GitHub（[Yang-An-future/AiDi](https://github.com/Yang-An-future/AiDi)），Render 已連接此 repo 的 `main` 分支。往後只要 `git push` 到 `main`，Render 就會自動觸發重新部署。
2. Render 服務設定（`render.yaml` 已內建）：
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
3. 在 Render 的 Environment 設定填入（與本機 `.env.local` 相同的值）：`VITE_FIREBASE_*` 六項、`FIREBASE_SERVICE_ACCOUNT_JSON`。
   - `VITE_*` 變數會在 build 階段被打包進前端程式碼，務必在觸發 build 前設定好，否則需要重新觸發一次部署。
4. 部署完成後，於瀏覽器開啟服務網址，`/login` 為登入頁、`/signup` 為大學伴／學習端老師註冊頁。

## 管理後台

- `/login`：所有身分共用的登入頁；`/signup`：大學伴／學習端老師註冊頁
- `/portal`：登入後的導流頁，會依角色自動導向 `/admin`、`/mentor` 或 `/teacher`
- `/admin`：帳號審核（勾選批次啟用/停用、全選、編輯資料）、公告管理、輪播照片管理、課程總表上傳、上傳資料管理（勾選＋全選＋打包 zip 下載、刪除）
- `/mentor`：查看課程總表（彈出視窗）、上傳教案
- `/teacher`：上傳學習端設備環境調查、學習需求調查檔案
- `server/index.js` 已提供 `requireAuth` middleware 範例（驗證 Firebase ID Token），未來要加後端寫入 API 時可直接複用
