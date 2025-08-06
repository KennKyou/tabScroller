/**
 * tabScroller - 水平滾動標籤組件
 * 
 * 一個功能強大的 JavaScript 類別，用於創建可拖拽滾動的水平標籤列表，
 * 支援點擊切換、自動滾動、響應式斷點等功能。
 * 
 * @version 2.0.0
 * @author KennKyou
 * @license MIT
 * 
 * ============================================================================
 * DOM 結構需求 (Required DOM Structure)
 * ============================================================================
 * 
 * HTML 結構必須遵循以下模式：
 * 
 * <ul class="your-container-class">
 *   <li class="scroller-item [scroller-item-active]">
 *     <!-- 內容可自定義，例如 button, a, span 等 -->
 *     <button type="button">標籤文字</button>
 *   </li>
 *   <li class="scroller-item">
 *     <a href="#section1">連結標籤</a>
 *   </li>
 *   <!-- 更多項目... -->
 * </ul>
 * 
 * CSS 類別說明：
 * - .your-container-class: 容器選擇器（可自定義名稱）
 * - .scroller-item: 每個標籤項目（必需）
 * - .scroller-item-active: 活動狀態標籤（可選，用於初始狀態）
 * 
 * ============================================================================
 * CSS 需求 (Required CSS)
 * ============================================================================
 * 
 * 必須包含以下基本 CSS 才能正常運作：
 * 
 * .your-container-class {
 *   list-style: none;
 *   display: flex;
 *   align-items: center;
 *   overflow-x: scroll;
 *   -ms-overflow-style: none;    // IE 隱藏滾動條
 *   scrollbar-width: none;       // Firefox 隱藏滾動條
 * }
 * 
 * .your-container-class::-webkit-scrollbar {
 *   display: none;               // Webkit 隱藏滾動條
 * }
 * 
 * .scroller-item .transition-none {
 *   transition: unset;           // 控制過渡效果
 * }
 * 
 * ============================================================================
 * 基本使用方法 (Basic Usage)
 * ============================================================================
 * 
 * // 1. ES6 模組方式（推薦）
 * import { tabScroller } from './tabScroller.js';
 * 
 * // 2. 基本初始化
 * const myTabs = new tabScroller('.my-tabs', {
 *   spaceBetween: 15,        // 項目間距
 *   clickToActive: true,     // 啟用點擊切換
 *   clickToScroll: true      // 啟用點擊滾動
 * });
 * 
 * // 3. 完整配置示例
 * const advancedTabs = new tabScroller('.advanced-tabs', {
 *   spaceBetween: 20,
 *   clickToActive: true,
 *   clickToScroll: true,
 *   breakpoints: {
 *     768: {
 *       spaceBetween: 30,
 *       clickToActive: false
 *     },
 *     1024: {
 *       spaceBetween: 40,
 *       clickToActive: true
 *     }
 *   }
 * });
 * 
 * ============================================================================
 * 事件監聽 (Event Listening)
 * ============================================================================
 * 
 * // 監聽標籤切換事件
 * document.querySelector('.my-tabs').addEventListener('tabScrollerActiveChange', (e) => {
 *   console.log('切換到:', e.detail.activeIndex, e.detail.activeItem);
 * });
 * 
 * // 監聽滾動事件
 * document.querySelector('.my-tabs').addEventListener('tabScrollerSlideChange', (e) => {
 *   console.log('滾動到:', e.detail.targetIndex, e.detail.scrollLeft);
 * });
 * 
 * ============================================================================
 * 實例管理 (Instance Management)
 * ============================================================================
 * 
 * // 銷毀實例（清理事件監聽器和資源）
 * myTabs.destroy();
 * 
 * ============================================================================
 * 瀏覽器相容性 (Browser Compatibility)
 * ============================================================================
 * 
 * 支援的瀏覽器：
 * - Chrome 60+
 * - Firefox 55+
 * - Safari 12+
 * - Edge 79+
 * 
 * 使用的現代 JavaScript 功能：
 * - ES6 Classes
 * - Arrow Functions  
 * - Template Literals
 * - Spread Operator
 * - CustomEvent API
 * 
 * ============================================================================
 */
export class tabScroller {

  /**
   * 創建一個 tabScroller 實例
   * 
   * @param {string} containerSelector - CSS 選擇器，用於選取容器元素
   * @param {Object} options - 配置選項
   * @param {number} [options.spaceBetween=0] - 項目間的間距（像素），預設為 0
   * @param {boolean} [options.clickToActive=false] - 是否啟用點擊切換活動狀態，預設為 false
   * @param {boolean} [options.clickToScroll=false] - 是否啟用點擊自動滾動，預設為 false
   * @param {Object} [options.breakpoints={}] - 響應式斷點配置
   * 
   * @throws {Error} 當 containerSelector 為空或非字串時拋出錯誤
   * @throws {Error} 當找不到指定的容器元素時拋出錯誤
   * 
   * @example
   * // 基本使用
   * const tabs = new tabScroller('.my-tabs');
   * 
   * @example
   * // 完整配置
   * const tabs = new tabScroller('.my-tabs', {
   *   spaceBetween: 20,
   *   clickToActive: true,
   *   clickToScroll: true,
   *   breakpoints: {
   *     768: { spaceBetween: 30 },
   *     1024: { spaceBetween: 40 }
   *   }
   * });
   */
  constructor(containerSelector = '', options = {}) {
    if (!containerSelector || typeof containerSelector !== 'string') {
      throw new Error('tabScroller: containerSelector must be a non-empty string');
    }

    this.containerSelector = containerSelector;
    this.options = {
      spaceBetween: 0,
      clickToActive: false,
      clickToScroll: false,
      breakpoints: {},
      ...options
    };

    this.wrap = document.querySelector(this.containerSelector);
    if (!this.wrap) {
      throw new Error(`tabScroller: Element with selector "${containerSelector}" not found`);
    }

    this.item = this.wrap.querySelectorAll('.scroller-item');
    if (this.item.length === 0) {
      console.warn(`tabScroller: No elements with class "scroller-item" found in "${containerSelector}"`);
    }

    // 綁定方法到實例以確保正確的 this 上下文
    this.handleResize = this.handleResize.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemSlideClick = this.handleItemSlideClick.bind(this);

    this.init();
  }

  /**
   * 初始化 tabScroller 實例
   * 設置所有必要的事件監聽器和初始狀態
   * 
   * @private
   */
  init() {
    if (!this.wrap || this.item.length === 0) {
      console.warn('tabScroller: Cannot initialize - missing container or items');
      return;
    }

    this.applyOptions();
    this.setScroller();
    this.setSpaceBetween();
    this.setInitActive();
    this.setActive();
    this.setSlide();

    // 添加 resize 事件監聽器，使用防抖處理
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.applyOptions();
    }, 250);
  }

  /**
   * 銷毀 tabScroller 實例
   * 移除所有事件監聽器並清理資源，防止內存洩漏
   * 
   * @public
   * @example
   * const tabs = new tabScroller('.my-tabs');
   * // 使用完成後銷毀實例
   * tabs.destroy();
   */
  destroy() {
    // 清理事件監聽器
    window.removeEventListener('resize', this.handleResize);
    
    if (this.wrap) {
      this.wrap.removeEventListener('mousemove', this.move);
      this.wrap.removeEventListener('mousedown', this.startDragging);
      this.wrap.removeEventListener('mouseup', this.stopDragging);
      this.wrap.removeEventListener('mouseleave', this.stopDragging);
    }

    if (this.item) {
      this.item.forEach(item => {
        item.removeEventListener('click', this.handleItemClick);
        item.removeEventListener('click', this.handleItemSlideClick);
      });
    }

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  applyOptions() {
    const width = window.innerWidth;
    let activeOptions = {...this.options};
  
    if (this.options.breakpoints && typeof this.options.breakpoints === 'object') {
      const breakpoints = Object.keys(this.options.breakpoints)
        .map(key => parseInt(key))
        .filter(key => !isNaN(key))
        .sort((a, b) => a - b);
      
      for (let i = 0; i < breakpoints.length; i++) {
        if (width > breakpoints[i]) {
          const breakpointOptions = this.options.breakpoints[breakpoints[i]];
          if (breakpointOptions && typeof breakpointOptions === 'object') {
            activeOptions = {...activeOptions, ...breakpointOptions};
          }
        }
      }
    }
  
    this.spaceBetween = typeof activeOptions.spaceBetween === 'number' ? activeOptions.spaceBetween : 0;
    this.clickToActive = Boolean(activeOptions.clickToActive);
    this.clickToScroll = Boolean(activeOptions.clickToScroll);
  
    // 重新設定間距和活動項目
    this.setSpaceBetween();
    this.setActive();
    this.setSlide();
  }

  setScroller() {
    if (!this.wrap) return;

    let mouseDown = false;
    let startX, scrollLeft;

    this.startDragging = (e) => {
      mouseDown = true;
      startX = e.pageX - this.wrap.offsetLeft;
      scrollLeft = this.wrap.scrollLeft;
      this.wrap.style.cursor = 'grabbing';
    }

    this.stopDragging = (_e) => {
      mouseDown = false;
      this.wrap.style.cursor = 'grab';
      if (this.item && this.item.length > 0) {
        this.item.forEach((item) => {
          item.style.pointerEvents = 'auto';
        });
      }
    }

    this.move = (e) => {
      if (!mouseDown) return;
      
      e.preventDefault();
      const x = e.pageX - this.wrap.offsetLeft;
      const scroll = x - startX;
      this.wrap.scrollLeft = scrollLeft - scroll;
      
      if (this.item && this.item.length > 0) {
        this.item.forEach((item) => {
          item.style.pointerEvents = 'none';
        });
      }
    }

    // 清理舊的事件監聽器
    this.wrap.removeEventListener('mousemove', this.move);
    this.wrap.removeEventListener('mousedown', this.startDragging);
    this.wrap.removeEventListener('mouseup', this.stopDragging);
    this.wrap.removeEventListener('mouseleave', this.stopDragging);

    // 添加新的事件監聽器
    this.wrap.addEventListener('mousemove', this.move);
    this.wrap.addEventListener('mousedown', this.startDragging);
    this.wrap.addEventListener('mouseup', this.stopDragging);
    this.wrap.addEventListener('mouseleave', this.stopDragging);
    
    // 設定初始游標樣式
    this.wrap.style.cursor = 'grab';
  }

  setSpaceBetween() {
    if (!this.item || this.item.length === 0) return;

    this.item.forEach((item) => {
      item.style.marginRight = this.spaceBetween + 'px';
    });

    const lastItem = this.wrap.querySelector('.scroller-item:last-of-type');
    if (lastItem) {
      lastItem.style.marginRight = '0px';
    }
  }

  setInitActive() {
    if (!this.item || this.item.length === 0) return;

    const itemActiveArray = [];
    let prevItemTotalWidth = 0;
    let totalSpace = 0;

    this.item.forEach((item) => {
      itemActiveArray.push(item.classList.contains('scroller-item-active'));
    });

    const initActiveItemIndex = itemActiveArray.indexOf(true);
    if (initActiveItemIndex >= 0) {
      for (let i = 0; i < initActiveItemIndex; i++) {
        const rect = this.item[i].getBoundingClientRect();
        prevItemTotalWidth += rect.width;
      }
      totalSpace = this.spaceBetween * initActiveItemIndex;

      this.wrap.scroll({
        left: initActiveItemIndex === 0 ? 0 : prevItemTotalWidth + totalSpace,
        behavior: 'smooth'
      });
    }
  }

  setActive() {
    if (!this.item || this.item.length === 0) return;

    // 移除現有的 click 事件監聽器
    this.item.forEach(item => {
      item.removeEventListener('click', this.handleItemClick);
    });
  
    if (this.clickToActive) {
      this.item.forEach(item => {
        item.addEventListener('click', this.handleItemClick);
      });
    }
  }

  handleItemClick(e) {
    if (!this.item || this.item.length === 0) return;
    
    this.item.forEach(item => {
      item.classList.remove('scroller-item-active');
    });
    e.currentTarget.classList.add('scroller-item-active');

    // 觸發自定義事件
    const event = new CustomEvent('tabScrollerActiveChange', {
      detail: {
        activeItem: e.currentTarget,
        activeIndex: Array.from(this.item).indexOf(e.currentTarget)
      }
    });
    this.wrap.dispatchEvent(event);
  }

  setSlide() {
    if (!this.item || this.item.length === 0) return;

    // 移除現有的 click 事件監聽器
    this.item.forEach(item => {
      item.removeEventListener('click', this.handleItemSlideClick);
      // 啟用 transition
      const childElements = item.querySelectorAll('*');
      childElements.forEach((tag) => {
        tag.classList.remove('transition-none');
      });
    });
  
    if (this.clickToScroll) {
      this.item.forEach((item) => {
        // 停用 transition
        const childElements = item.querySelectorAll('*');
        childElements.forEach((tag) => {
          tag.classList.add('transition-none');
        });
      });

      this.item.forEach(item => {
        item.addEventListener('click', this.handleItemSlideClick);
      });
    }
  }
  
  handleItemSlideClick(e) {
    if (!this.item || this.item.length === 0) return;

    const item = e.currentTarget;
    const itemIndex = Array.from(this.item).indexOf(item);
    let prevItemTotalWidth = 0;
  
    for (let i = 0; i < itemIndex; i++) {
      const rect = this.item[i].getBoundingClientRect();
      prevItemTotalWidth += rect.width;
    }
    const totalSpace = this.spaceBetween * itemIndex;
  
    this.wrap.scroll({
      left: prevItemTotalWidth + totalSpace,
      behavior: 'smooth'
    });

    // 觸發自定義事件
    const event = new CustomEvent('tabScrollerSlideChange', {
      detail: {
        targetItem: item,
        targetIndex: itemIndex,
        scrollLeft: prevItemTotalWidth + totalSpace
      }
    });
    this.wrap.dispatchEvent(event);
  }
}

/**
 * ============================================================================
 * 配置選項詳細說明 (Configuration Options)
 * ============================================================================
 * 
 * @typedef {Object} TabScrollerOptions
 * @property {number} spaceBetween - 項目間的間距（像素），預設 0
 * @property {boolean} clickToActive - 點擊切換活動狀態，預設 false
 * @property {boolean} clickToScroll - 點擊自動滾動，預設 false
 * @property {Object} breakpoints - 響應式斷點配置，預設 {}
 * 
 * breakpoints 配置格式：
 * {
 *   [螢幕寬度]: {
 *     spaceBetween: number,
 *     clickToActive: boolean,
 *     clickToScroll: boolean
 *   }
 * }
 * 
 * ============================================================================
 * 使用範例 (Usage Examples)
 * ============================================================================
 */

// 基本使用範例
// const basicTabs = new tabScroller('.my-tabs', {
//   spaceBetween: 15
// });

// 完整功能範例
// const advancedTabs = new tabScroller('.advanced-tabs', {
//   spaceBetween: 20,
//   clickToActive: true,
//   clickToScroll: true,
//   breakpoints: {
//     576: {
//       spaceBetween: 25,
//       clickToActive: false
//     },
//     991: {
//       spaceBetween: 40,
//       clickToActive: true,
//       clickToScroll: true
//     }
//   }
// });

// 事件監聽範例
// document.querySelector('.my-tabs').addEventListener('tabScrollerActiveChange', (e) => {
//   console.log('切換到:', e.detail.activeIndex, e.detail.activeItem);
// });

// 資源清理範例
// advancedTabs.destroy();

/**
 * ============================================================================
 * HTML 結構範例 (HTML Structure Examples)
 * ============================================================================
 */

/*
HTML 基本結構：

<ul class="your-tabs-container">
  <!-- 預設活動項目（可選） -->
  <li class="scroller-item scroller-item-active">
    <button type="button">首頁</button>
  </li>
  <li class="scroller-item">
    <button type="button">關於我們</button>
  </li>
  <li class="scroller-item">
    <a href="#products">產品介紹</a>
  </li>
  <li class="scroller-item">
    <span>其他內容</span>
  </li>
</ul>

注意事項：
- 容器可以是任何元素（ul, div, nav 等）
- .scroller-item 必須是直接子元素
- .scroller-item-active 用於標記初始活動項目
- 內容可以是任何 HTML 元素（button, a, span 等）
*/

/**
 * ============================================================================
 * CSS 樣式需求 (Required CSS Styles)
 * ============================================================================
 */

/*
必要的 CSS 樣式：

.your-tabs-container {
  // 基本佈局
  list-style: none;           // 移除列表樣式
  display: flex;              // 水平排列
  align-items: center;        // 垂直居中對齊
  overflow-x: scroll;         // 水平滾動
  
  // 隱藏滾動條（跨瀏覽器）
  -ms-overflow-style: none;   // IE 和 Edge
  scrollbar-width: none;      // Firefox
}

.your-tabs-container::-webkit-scrollbar {
  display: none;              // Chrome, Safari, Opera
}

// 過渡效果控制類別
.scroller-item .transition-none {
  transition: unset !important;
}

// 活動狀態樣式（可選，根據設計需求自定義）
.scroller-item-active {
  // 你的活動狀態樣式
}

目的說明：
1. 創建水平滾動容器
2. 隱藏原生滾動條，使用拖拽操作
3. 提供過渡效果控制機制
4. 支援自定義活動狀態樣式
*/