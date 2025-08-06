# tabScroller

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/KennKyou/tabScroller)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

一個現代化的 JavaScript 水平滾動標籤組件，支援拖拽滾動、點擊切換、響應式設計等功能。

**A modern JavaScript horizontal scrolling tabs component with drag scrolling, click switching, and responsive design.**

## 特色功能 | Features

- **輕量級** - 純 JavaScript，無依賴
- **多種互動** - 支援拖拽滾動、點擊切換、自動滾動
- **響應式設計** - 支援斷點配置，適應不同螢幕尺寸
- **TypeScript 友好** - 完整的 JSDoc 類型註解
- **高度自定義** - 靈活的 CSS 和配置選項
- **性能優化** - 防抖處理、事件優化、內存管理
- **測試完整** - 30+ 測試案例，確保品質
- **瀏覽器相容** - Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## 快速開始 | Quick Start

### 安裝 | Installation

```bash
# 使用 npm
npm install tab-scroller

# 使用 yarn  
yarn add tab-scroller

# 或直接下載文件
wget https://github.com/KennKyou/tabScroller
```

### HTML 結構 | HTML Structure

```html
<ul class="my-tabs">
  <li class="scroller-item scroller-item-active">
    <button type="button">Home</button>
  </li>
  <li class="scroller-item">
    <button type="button">About</button>
  </li>
  <li class="scroller-item">
    <button type="button">Service</button>
  </li>
  <li class="scroller-item">
    <button type="button">Contact</button>
  </li>
</ul>
```

### CSS 樣式 | CSS Styles

```css
.my-tabs {
  list-style: none;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  -ms-overflow-style: none;    /* IE */
  scrollbar-width: none;       /* Firefox */
}

.my-tabs::-webkit-scrollbar {
  display: none;               /* Chrome, Safari, Opera */
}

.scroller-item .transition-none {
  transition: unset !important;
}
```

### JavaScript 使用 | JavaScript Usage

#### ES6 模組 (推薦)
```javascript
import { tabScroller } from 'tab-scroller';

const tabs = new tabScroller('.my-tabs', {
  spaceBetween: 15,        // 間距
  clickToActive: true,     // 點擊切換
  clickToScroll: true,     // 點擊滾動
  breakpoints: {
    768: {
      spaceBetween: 25
    },
    1024: {
      spaceBetween: 40,
      clickToActive: false
    }
  }
});
```

#### 傳統引入方式
```html
<script src="dist/tabScroller.umd.js"></script>
<script>
  const tabs = new tabScroller('.my-tabs', {
    spaceBetween: 15,
    clickToActive: true
  });
</script>
```

## 配置選項 | Configuration

| 選項 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `spaceBetween` | `number` | `0` | 標籤項目間距（像素） |
| `clickToActive` | `boolean` | `false` | 啟用點擊切換活動狀態 |
| `clickToScroll` | `boolean` | `false` | 啟用點擊自動滾動 |
| `breakpoints` | `object` | `{}` | 響應式斷點配置 |

### 響應式配置範例
```javascript
const tabs = new tabScroller('.my-tabs', {
  spaceBetween: 10,
  clickToActive: true,
  breakpoints: {
    // 螢幕寬度 > 576px 時的設定
    576: {
      spaceBetween: 20,
      clickToActive: false
    },
    // 螢幕寬度 > 1024px 時的設定  
    1024: {
      spaceBetween: 30,
      clickToActive: true,
      clickToScroll: true
    }
  }
});
```

## 事件處理 | Event Handling

tabScroller 2.0 新增了自定義事件系統：

```javascript
const container = document.querySelector('.my-tabs');

// 監聽標籤切換事件
container.addEventListener('tabScrollerActiveChange', (e) => {
  console.log('切換到標籤:', e.detail.activeIndex);
  console.log('活動元素:', e.detail.activeItem);
});

// 監聽滾動事件
container.addEventListener('tabScrollerSlideChange', (e) => {
  console.log('滾動到:', e.detail.targetIndex);
  console.log('滾動位置:', e.detail.scrollLeft);
});
```

## API 方法 | API Methods

```javascript
const tabs = new tabScroller('.my-tabs');

// 銷毀實例，清理資源
tabs.destroy();
```

## 進階自定義 | Advanced Customization

### CSS 自定義樣式
```css
/* 活動狀態樣式 */
.scroller-item-active button {
  background: #007bff;
  color: white;
  transform: scale(1.05);
}

/* 拖拽游標 */
.my-tabs {
  cursor: grab;
}

.my-tabs:active {
  cursor: grabbing;
}

/* 項目間距和樣式 */
.scroller-item {
  flex-shrink: 0;
  margin-right: 15px;
}

.scroller-item button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 25px;
  background: white;
  transition: all 0.3s ease;
}
```

## 使用案例 | Use Cases

### 分類標籤
```javascript
const categoryTabs = new tabScroller('.category-tabs', {
  spaceBetween: 12,
  clickToActive: true,
  clickToScroll: true
});
```

### 時間軸導航
```javascript
const timelineTabs = new tabScroller('.timeline-nav', {
  spaceBetween: 20,
  clickToActive: true,
  breakpoints: {
    768: { spaceBetween: 30 }
  }
});
```

### 產品過濾器
```javascript
const filterTabs = new tabScroller('.product-filters', {
  spaceBetween: 8,
  clickToActive: true,
  clickToScroll: false
});
```

## 開發和測試 | Development

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 執行測試
npm test

# 代碼檢查
npm run lint

# 建置專案
npm run build
```

## 瀏覽器支援 | Browser Support

| 瀏覽器 | 版本 |
|--------|------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

## 更新日誌 | Changelog

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新詳情。

### 2.0.0 主要更新
- 新增自定義事件系統
- 強化錯誤處理和參數驗證
- 新增 `destroy()` 方法進行資源清理
- 性能優化：防抖處理、內存管理
- 完整的 JSDoc 文檔和 TypeScript 支援
- 完整的測試覆蓋（30+ 測試案例）

## 授權 | License

此專案使用 [MIT](./LICENSE) 授權條款。
