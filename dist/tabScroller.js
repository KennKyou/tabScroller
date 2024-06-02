//----------------------------
// 標籤水平移動
//----------------------------
export class tabScroller {

  constructor(containerSelector = '', options = {}) {
    this.containerSelector = containerSelector;
    this.options = options;
    this.wrap = document.querySelector(this.containerSelector);
    this.item = this.wrap.querySelectorAll('.scroller-item');

    this.init();
  }

  init() {
    this.applyOptions();
    window.addEventListener('resize', this.applyOptions.bind(this));
    this.setScroller();
    this.setSpaceBetween();
    this.setInitActive();
    this.setActive();
    this.setSlide();
  }

  applyOptions() {
    const width = window.innerWidth;
    let activeOptions = {...this.options}; // 確保從原始選項開始，避免選項被永久修改
  
    if (this.options.breakpoints) {
      const breakpoints = Object.keys(this.options.breakpoints).map(key => parseInt(key)).sort((a, b) => a - b);
      for (let i = 0; i < breakpoints.length; i++) {
        if (width > breakpoints[i]) {
          activeOptions = {...activeOptions, ...this.options.breakpoints[breakpoints[i]]};
        }
      }
    }
  
    this.spaceBetween = activeOptions.spaceBetween;
    this.clickToActive = activeOptions.clickToActive;
    this.clickToScroll = activeOptions.clickToScroll;
  
    // 重新設定間距和活動項目
    this.setSpaceBetween();
    this.setActive();
    this.setSlide();
  }

  setScroller() {
    let mouseDown = false;
    let startX, scrollLeft;

    const startDragging = (e) => {
      mouseDown = true;
      startX = e.pageX - this.wrap.offsetLeft;
      scrollLeft = this.wrap.scrollLeft;
    }

    const stopDragging = (e) => {
      mouseDown = false;
    }

    const move = (e) => {
      e.preventDefault();
      if(!mouseDown) {
        this.item.forEach((item) => {
          item.style.pointerEvents = 'auto'
        })
        return;
      }
      const x = e.pageX - this.wrap.offsetLeft;
      const scroll = x - startX;
      this.wrap.scrollLeft = scrollLeft - scroll;
      this.item.forEach((item) => {
        item.style.pointerEvents = 'none'
      })
    }

    // Add the event listeners
    this.wrap.addEventListener('mousemove', move, false);
    this.wrap.addEventListener('mousedown', startDragging, false);
    this.wrap.addEventListener('mouseup', stopDragging, false);
    this.wrap.addEventListener('mouseleave', stopDragging, false);
  }

  setSpaceBetween() {
    this.item.forEach((item) => {
      item.style.marginRight = this.spaceBetween + 'px'
    })
    this.wrap.querySelector('.scroller-item:last-of-type').style.marginRight = 0 + 'px'
  }

  setInitActive() {
    let itemArray = []
    let itemActiveArray = []
    let prevItemTotalWidth = 0
    let totalSpace = 0
    this.item.forEach((item) => {
      itemArray.push(item)
      itemActiveArray.push(item.classList.contains('scroller-item-active'))
    })
    let initActiveItemIndex = itemActiveArray.indexOf(true)
    if (initActiveItemIndex >= 0) {
      for (let i = 0; i < initActiveItemIndex; i++) {
        prevItemTotalWidth += itemArray[i].getBoundingClientRect().width
      }
      totalSpace = this.spaceBetween * initActiveItemIndex

      if (initActiveItemIndex === 0) {
        this.wrap.scroll({
          left: 0,
          behavior: 'smooth'
        })
      } else {
        this.wrap.scroll({
          left: prevItemTotalWidth + totalSpace,
          behavior: 'smooth'
        })
      }
    }
  }

  setActive() {
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

  handleItemClick = (e) => {
    this.item.forEach(item => {
      item.classList.remove('scroller-item-active');
    });
    e.currentTarget.classList.add('scroller-item-active');
  }

  setSlide() {
    // 移除現有的 click 事件監聽器
    this.item.forEach(item => {
      item.removeEventListener('click', this.handleItemSlideClick);
      // 啟用 transition
      item.querySelectorAll('*').forEach((tag) => {
        tag.classList.remove('transition-none')
      })
    });
  
    if (this.clickToScroll) {
      this.item.forEach((item) => {
        // 停用 transition
        item.querySelectorAll('*').forEach((tag) => {
          tag.classList.add('transition-none')
        })
      })

      this.item.forEach(item => {
        item.addEventListener('click', this.handleItemSlideClick);
      });
    }
  }
  
  handleItemSlideClick = (e) => {
    let item = e.currentTarget;
    let itemIndex = Array.from(this.item).indexOf(item);
    let prevItemTotalWidth = 0;
    let totalSpace = 0;
  
    for (let i = 0; i < itemIndex; i++) {
      prevItemTotalWidth += this.item[i].getBoundingClientRect().width;
    }
    totalSpace = this.spaceBetween * itemIndex;
  
    this.wrap.scroll({
      left: prevItemTotalWidth + totalSpace,
      behavior: 'smooth'
    });
  }
}

/**
 * @param {String} 帶入 dom
 * @param {Object} options，額外控制項
 * @param {Number} opstions.spaceBetween，scroller-item 的間距
 * @param {Boolean} options.clickToActive，是否開啟按下 item 後加上 scroller-item-active 功能，預設 false
 * @param {Boolean} options.clickToScroll，是否開啟按下 item 後滾動到該項目功能，預設 false
 * @param {Object} options.breakpoints，斷點設定
 * @param {Number} opstions.breakpoints.key，螢幕寬度，數值以上進行變換
 */
// const scroller1 = new tabScroller('.tabScroller', {
//  spaceBetween: 15,
//  clickToActive: true,
//  clickToScroll: true,
//  breakpoints: {
//    576: {
//      spaceBetween: 25
//    },
//    991: {
//      spaceBetween: 50,
//      clickToActive: false,
//      clickToScroll: false
//    },
//  }
// });

/* HTML 結構
  <ul class="tabScroller">
    <!-- 如果需要預設有 active 的話，在 scroller-item 加上 scroller-item-active 的 class name -->
    <li class="scroller-item scroller-item-active">
      <!-- 這層可以自定義 html tag -->
      <a href="">ALL</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2024</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2023</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2022</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2021</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2020</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2019</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2018</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2017</a>
    </li>
    <li class="scroller-item">
      <!-- 這層可以自定義 html tag -->
      <a href="">2016</a>
    </li>
  </ul>
*/

/* CSS 設定，目的在於：
  1. 取消原本 ul 的 list-style 以及讓 ul 成為內容寬度超過容器時可以繼續 scroll
  2. 取消 scroll 捲軸樣式
  3. scroller-item 內元素的 transition 設定

  .tabScroller {
    list-style: none;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .tabScroller::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .tabScroller::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  .tabScroller::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }

  .tabScroller::-webkit-scrollbar {
    background-color: transparent;
    display: none;
  }

  .scroller-item .transition-none {
    transition: unset;
  }
*/