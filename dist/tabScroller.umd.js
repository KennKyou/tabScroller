(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TabScroller = {}));
})(this, (function (exports) { 'use strict';

  //----------------------------
  // 標籤水平移動
  //----------------------------
  class tabScroller {

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

      this.stopDragging = () => {
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

  // 將 tabScroller 設為全域變數
  if (typeof window !== 'undefined') {
    window.tabScroller = tabScroller;
  }

  exports.tabScroller = tabScroller;

}));