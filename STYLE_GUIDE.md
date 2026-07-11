# AI Di+ 網站樣式規範（Template Style Instruction）

本文件描述本專案（AI Di+ 實驗方案計劃網站）目前的視覺與互動風格，可作為往後新增頁面／元件時的設計指令依據，確保風格一致。

## 1. 品牌色彩系統

| 用途 | 色碼 | 說明 |
|---|---|---|
| 主色（Primary Navy） | `#003366` | Header／Footer 背景、標題文字、主要按鈕、卡片主色邊框 |
| 主色 Hover | `#002347` | 深色按鈕的 hover 狀態 |
| 輔色（Accent Orange） | `#F5892E` | 強調色：圖示、底線、次要按鈕、hover 邊框、標籤文字 |
| 輔色 Hover | `#e0761a` | 橘色按鈕 hover 狀態 |
| 點綴藍（Sky Blue） | `#2DACE3` | 僅用於 Header／Footer 頂部裝飾漸層條，與橘色交織 |
| 深底色（Footer BG） | `#001a33` | Footer 背景，比主色更深 |
| 中性色 | Tailwind `slate-50/100/200/300`、`gray-500/600/700/800` | 頁面底色、卡片內底色、次要文字 |

**規則：**
- 全站只用「深藍＋橘」兩個主色做對比，藍色代表機構／穩重，橘色代表 AI／活力，兩者搭配製造品牌識別。
- 藍色永遠用在大面積背景或標題文字；橘色只用在強調點（圖示、底線、hover、標籤），絕不大面積鋪色。
- 裝飾性漸層固定寫法：`bg-gradient-to-r from-[#2DACE3] via-[#F5892E] to-[#2DACE3]`，用於 Header 下緣與 Footer 上緣的 1–1.5px 細條。

## 2. 字體與排版

- 內文預設使用 `font-sans`（Tailwind 預設字體堆疊）。
- 主標題（h2）常搭配 `font-serif` 營造正式／學術感，例如頁面大標題「計畫介紹」「計畫組織」。
- Header 的英文副標題使用 `font-serif` + `uppercase` + `tracking-widest`，字級極小（10–12px），呈現機構英文名稱的裝飾性效果。
- 強調字重使用 `font-bold` 或 `font-extrabold`，很少使用 `font-medium` 以下的字重做標題。
- Eyebrow（分類標籤式小字）寫法：`text-[#F5892E] font-bold tracking-[0.3em] text-sm uppercase`，如 ProjectOrg 頁面的 "Internal Structure"。
- 部分敘述文字使用 `italic`，帶出人文/敘事語氣（例如公告摘要、簡介文字）。
- 標題下方常見一條短的裝飾底線：`h-1.5 w-24 bg-[#F5892E]`（或反色 `bg-[#003366]`），置中或靠左皆可。

## 3. 版面配置

- 全站容器寬度：一般頁面 `max-w-7xl`，內容較集中的說明頁用 `max-w-4xl` 或 `max-w-5xl`，皆搭配 `mx-auto px-6`。
- 內容頁（非首頁）統一寫法：`min-h-screen bg-slate-50 pt-16 pb-24`，標題置中並附裝飾底線。
- 首頁採「主欄＋側欄」12 欄格線：主內容 `md:col-span-8`，側欄（合作學校等）`md:col-span-4` 並加 `sticky top-24`。
- 卡片與卡片之間用 `gap-6` / `gap-8`／`space-y-6`／`space-y-16` 控制垂直節奏，區塊越重要（大段落）間距越大。
- 手機版一律先以單欄（`grid-cols-1`）呈現，於 `sm:`／`md:`／`lg:` 斷點才展開多欄，Mobile-first。

## 4. 元件樣式規範

### Header（導覽列）
- `sticky top-0 z-50`，深藍底 `bg-[#003366]`，文字白色，`shadow-md`。
- 底部有 1.5px 高的品牌漸層裝飾條（見第1節）。
- Logo：圓形（`rounded-full`）、白底、有陰影，搭配中文主標＋英文襯線副標。
- 導覽連結：底部 2px 邊框當作 active／hover 指示，預設透明、hover／當前頁變 `border-[#F5892E]`，非當前頁 `opacity-70`。
- 右側 CTA（登入／我的專區）永遠是「藥丸形」按鈕：橘底＋深藍字＋粗體＋陰影，hover 時加深橘色並 `scale-105`，press 時 `scale-95`。
- 手機版導覽收合成單一小型 CTA 按鈕，不做漢堡選單。

### Footer
- 深藍（比 Header 更深，`#001a33`）背景，白／灰文字。
- 頂部同樣有品牌漸層裝飾條。
- 三欄式（`grid-cols-1 md:grid-cols-3`）：左聯絡資訊、中 Logo＋版權、右地址，圖示一律橘色（`lucide-react`）。

### 卡片（Section / Card）
- 底色白，圓角依重要程度遞增：一般卡片 `rounded-xl`（12px）、次要頁卡片 `rounded-2xl`（16px）、大型主視覺卡片 `rounded-3xl`（24px）或 `rounded-[2rem]`。
- 陰影同樣依重要度遞增：`shadow-lg` → `shadow-xl` → `shadow-2xl`。
- **重點裝飾邊框**是本站最明顯的識別手法：卡片會在單一方向加一條「粗色邊框」當強調，交替使用深藍／橘色，交替使用上／左／右：
  - `border-t-8 border-[#003366]`（最新公告）
  - `border-t-8 border-[#F5892E]`（課程公告）
  - `border-l-[12px] border-[#003366]` / `border-r-[12px] border-[#F5892E]`（介紹頁區塊，交錯排列）
  - `border-l-4 border-[#003366]`（側欄卡片）
- 卡片內的次要資訊區塊常用 `bg-slate-50 rounded-xl/2xl border border-slate-100/200`，形成「卡中卡」層次。
- 尚無資料／待補內容一律用 `border-dashed border-slate-300` 虛線框＋斜體灰字提示（例如「更多合作夥伴積極洽談中...」），維持設計完整感而非留白。
- Hover 互動：list item 用 `hover:bg-slate-50 hover:border-slate-100`；圖片卡片用 `group-hover:scale-110 transition-transform duration-500`（圖片放大）；文字用 `group-hover:text-[#003366]`；有些卡片有 `opacity-0 group-hover:opacity-100` 的隱藏 CTA 浮現效果。

### 按鈕
- 主要 CTA／深色表單送出按鈕：`bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347]`。
- 導覽／強調型按鈕：橘底深藍字 `rounded-full`（藥丸形），hover 加深＋放大。
- Badge／標籤：小型 `rounded-full` 膠囊，深藍底白字（如課程標籤）或白底灰字帶 `shadow-sm`（如教材教法標籤）。

### 表單
- 外層卡片：`bg-white rounded-2xl shadow-xl p-8`，加同款頂部粗邊框（`border-t-8 border-[#003366]`）。
- 輸入框：`border border-slate-300 rounded-lg`，focus 時 `focus:ring-2 focus:ring-[#F5892E]`（用輔色做 focus 指示，不用藍色）。
- 錯誤訊息：`text-red-600 text-sm`。

### 圖示（Icons）
- 統一使用 `lucide-react`。
- 圖示顏色固定為橘色 `text-[#F5892E]`，搭配深藍色標題文字，形成「橘圖示＋藍標題」的標準標頭組合，全站重複出現。

## 5. 動效（Motion）

- 使用 `motion/react`（Framer Motion）。
- 頁面／區塊進場一律「淡入＋位移」：`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`，是全站最常用的進場模式。
- 首頁大圖輪播：`AnimatePresence mode="wait"` 搭配 `opacity` 交叉淡化，5 秒自動輪播，指示點目前項目為橘色長條、其餘為半透明白點。
- 進站動畫（IntroAnimation）：全螢幕深藍遮罩、Logo 彈簧進場（`type: spring`）、標題文字逐字從左右滑入、中間「+」符號旋轉飛入並帶光暈脈動，僅在每個瀏覽 session 播放一次（`sessionStorage`）。
- Hover 互動偏好用 `transition-all` + `scale`／`opacity`／顏色漸變，避免生硬跳動。

## 6. 圖片與視覺

- 首頁 Hero／輪播圖：全寬滿版、`object-cover`，疊加 `bg-gradient-to-t from-black/80 via-transparent to-transparent` 讓文字在圖片上保持可讀。
- 「回顧／案例」類圖片卡片：固定比例容器（如 `aspect-[16/10]`）＋ `overflow-hidden`，hover 時圖片本身放大（非卡片放大）。
- Logo／學校標誌一律圓形或圓角方形白底容器包裹，確保深色或透明背景的圖檔在白底卡片上乾淨呈現。

## 7. 語氣與內容風格

- 主要語言為繁體中文，機構／計畫名稱旁常附英文小字（襯線體、全大寫、寬字距），呈現正式機構＋國際感。
- 標題常見數字＋主題（「1. 三大特色課程領域」）的條列式敘事，適合說明型內容頁。
- 空狀態文案語氣友善、不生硬（「目前尚無公告。」「更多合作夥伴積極洽談中...」），維持品牌溫度。

## 8. 套用新頁面時的檢查清單

1. 背景是否為 `bg-slate-50`（內容頁）或深藍（Header/Footer/強調區塊）？
2. 標題是否為深藍 `#003366`、圖示是否為橘 `#F5892E`？
3. 卡片是否有白底 + 圓角 + 陰影 + 單邊粗色強調框？
4. 是否使用 `motion/react` 做進場淡入位移？
5. CTA 按鈕是否為橘底深藍字的藥丸形？
6. 手機版是否從單欄開始，逐步在 `md`/`lg` 展開？
7. 空資料狀態是否有對應的友善提示文案？
