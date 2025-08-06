# 更新日誌 (Changelog)

所有對此專案的重要更改都會記錄在此文件中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/) 規範。

## [2.0.0] - 2024-08-06

### ✨ 新增功能 (Added)
- **🛡️ 強化錯誤處理**: 新增完整的參數驗證和邊界檢查
- **🎪 自定義事件系統**: 新增 `tabScrollerActiveChange` 和 `tabScrollerSlideChange` 事件
- **🧹 資源管理**: 新增 `destroy()` 方法，支援完整的資源清理
- **⚡ 性能優化**: 加入 resize 事件防抖處理（250ms）
- **📚 完整文檔**: 在源代碼中加入詳細的 JSDoc 註解和使用說明
- **🔧 開發工具鏈**: 新增 ESLint、Prettier、Jest 測試框架
- **📦 建置系統**: 新增自動化建置流程和代碼壓縮
- **🌐 UMD 支援**: 新增 UMD 版本，支援傳統 script 標籤引入

### 🔄 改進功能 (Changed)
- **🎯 更準確的類型檢查**: 所有配置選項都有嚴格的類型驗證
- **🎨 改進的拖拽體驗**: 新增視覺游標回饋（grab/grabbing）
- **📱 更好的響應式支援**: 優化斷點配置系統
- **🔒 更安全的事件處理**: 改善事件監聽器管理和清理

### 🛠️ 修復問題 (Fixed)
- **🔧 事件監聽器洩漏**: 修復未正確清理事件監聽器的問題
- **📐 計算準確性**: 改善項目寬度和滾動位置的計算
- **🎭 過渡效果控制**: 修復 transition 控制邏輯
- **🧪 邊界條件**: 處理空容器和無效參數的情況

### 🗑️ 移除功能 (Removed)
- **📄 移除重複文件**: 清理不必要的範例文件和重複資源
- **🧹 清理專案結構**: 移除過時的配置和註解

### 🔧 開發體驗改進 (Developer Experience)
- **📋 完整的測試覆蓋**: 30+ 測試案例，覆蓋所有主要功能
- **🎯 TypeScript 友好**: 完整的 JSDoc 類型註解
- **📖 詳細文檔**: 源代碼內建完整使用說明
- **⚙️ 現代工具鏈**: ESLint 9.0、Prettier、Jest 最新版本

### 📊 性能提升 (Performance)
- **⚡ 防抖優化**: resize 事件處理優化 
- **🎯 選擇器優化**: 改善 DOM 查詢效率
- **🧠 內存管理**: 完善的資源清理機制

### 🌐 瀏覽器支援 (Browser Support)
- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

---

## [1.0.0] - 2024-01-01

### ✨ 初始版本功能
- 基本水平滾動功能
- 拖拽滾動支援
- 點擊切換活動狀態
- 點擊自動滾動
- 響應式斷點配置
- 基本 CSS 樣式

---

## 升級指南 (Migration Guide)

### 從 1.x 升級到 2.0

#### ✅ 向後相容
大部分 1.x 的功能在 2.0 中都保持相容，現有代碼基本不需要修改。

#### 🔄 建議更新

```javascript
// 1.x 版本
const scroller = new tabScroller('.my-tabs', {
  spaceBetween: 15,
  clickToActive: true
});

// 2.0 版本 - 新增事件監聽
const scroller = new tabScroller('.my-tabs', {
  spaceBetween: 15,
  clickToActive: true
});

// 新增：監聽事件
document.querySelector('.my-tabs').addEventListener('tabScrollerActiveChange', (e) => {
  console.log('切換到:', e.detail.activeIndex);
});

// 新增：資源清理
// scroller.destroy(); // 在不需要時調用
```

#### ⚠️ 注意事項
- 如果你使用了自定義的 CSS 過渡效果，請確保包含 `.transition-none` 類別的樣式
- 新版本對參數驗證更嚴格，請確保傳入正確的參數類型

#### 🎯 推薦做法
- 使用新的事件系統來監聽標籤切換
- 在組件銷毀時調用 `destroy()` 方法
- 利用完整的 JSDoc 註解獲得更好的開發體驗