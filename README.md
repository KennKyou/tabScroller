# tabScroller 類別

`tabScroller` 是一個用於創建可滾動選項卡的 JavaScript 類別。它允許使用者通過點擊或拖動來選擇不同的選項卡，並且可以根據不同的螢幕尺寸調整選項卡的行為和樣式。

## 使用方法

首先，您需要在您的 HTML 文件中添加一個包含選項卡項目的容器，例如：
``` html 
<ul class="tabScroller">
    <li class="scroller-item scroller-item-active">
        <!-- 可自定義 HTML tag與結構 -->
        <a href="">ALL</a>
    </li>
    <li class="scroller-item">
        <!-- 可自定義 HTML tag與結構 -->
        <a href="">2024</a>
    </li>
    <li class="scroller-item">
        <!-- 可自定義 HTML tag與結構 -->
        <a href="">2023</a>
    </li>
    <!-- 更多選項卡項目 -->
</ul>
```

然後，在您的 JavaScript 文件中創建一個 `tabScroller` 實例：
``` javascript
const scroller = new tabScroller('.tabScroller', {
    spaceBetween: 15,
    clickToActive: true,
    clickToScroll: true,
    breakpoints: {
        576: {
            spaceBetween: 25
        },
        991: {
            spaceBetween: 50,
            clickToActive: false,
            clickToScroll: false
        }
    }
});
```

## 配置選項

- `spaceBetween` (Number): 選項卡項目之間的間距（px）。
- `clickToActive` (Boolean): 是否啟用點擊選項卡項目時添加 active 狀態。
- `clickToScroll` (Boolean): 是否啟用點擊選項卡項目時自動滾動到該項目。
- `breakpoints` (Object): 斷點設定，用於根據螢幕寬度調整選項。

## 方法

- `init()`: 初始化選項卡滾動器。
- `applyOptions()`: 根據當前螢幕寬度和配置選項應用設定。
- `setScroller()`: 設定滾動行為。
- `setSpaceBetween()`: 設定選項卡項目之間的間距。
- `setInitActive()`: 初始化時設定 active 選項卡的位置。
- `setActive()`: 設定 active 選項卡的點擊行為。
- `setSlide()`: 設定點擊選項卡項目時的滾動行為。

## CSS 設定

為了正確顯示滾動選項卡，您需要在 CSS 中添加一些基本樣式：
``` css
.tabScroller {
    list-style: none;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.tabScroller::-webkit-scrollbar {
    background-color: transparent;
    display: none;
}
.scroller-item .transition-none {
    transition: unset;
}
```

這些樣式將移除標準滾動條，並確保選項卡可以在容器內自由滾動。

## 事件處理

`tabScroller` 類別使用以下事件來增強用戶互動：

- `mousedown`: 當用戶開始拖動時觸發。
- `mousemove`: 當用戶拖動時更新滾動位置。
- `mouseup` 和 `mouseleave`: 當用戶停止拖動時觸發。

這些事件確保用戶可以通過拖動來平滑地滾動選項卡。

## 注意事項

在使用 `tabScroller` 類別時，請確保您的 HTML 和 CSS 結構正確設置，以支持滾動功能。特別是，選項卡容器應該設置為可滾動的，並且選項卡項目應該適當地排列。

此外，如果您啟用了 `clickToActive` 或 `clickToScroll` 功能，應注意更新相關選項卡項目的狀態或位置，以反映當前的活動選項卡或滾動位置。

## 結論

`tabScroller` 類別提供了一個靈活且功能豐富的解決方案，用於在網頁上實現選項卡的水平滾動。通過簡單的配置和方法調用，開發者可以輕鬆地為他們的網站添加這種互動式選項卡滾動功能。

---

# tabScroller Class

`tabScroller` is a JavaScript class designed for creating scrollable tabs. It allows users to select different tabs by clicking or dragging and adjusts the behavior and style of the tabs based on different screen sizes.

## Usage

First, you need to add a container with tab items in your HTML document, for example:
``` html
<ul class="tabScroller">
    <li class="scroller-item scroller-item-active">
        <!-- Customizable HTML tag and structure -->
        <a href="">ALL</a>
    </li>
    <li class="scroller-item">
        <!-- Customizable HTML tag and structure -->
        <a href="">2024</a>
    </li>
    <li class="scroller-item">
        <!-- Customizable HTML tag and structure -->
        <a href="">2023</a>
    </li>
    <!-- More tab items -->
</ul>
```

Then, create a `tabScroller` instance in your JavaScript file:
``` javascript
const scroller = new tabScroller('.tabScroller', {
    spaceBetween: 15,
    clickToActive: true,
    clickToScroll: true,
    breakpoints: {
        576: {
            spaceBetween: 25
        },
        991: {
            spaceBetween: 50,
            clickToActive: false,
            clickToScroll: false
        }
    }
});
```

## Configuration Options

- `spaceBetween` (Number): The spacing between tab items (px).
- `clickToActive` (Boolean): Whether to enable adding an active state when a tab item is clicked.
- `clickToScroll` (Boolean): Whether to enable automatic scrolling to the item when a tab item is clicked.
- `breakpoints` (Object): Breakpoint settings to adjust options based on screen width.

## Methods

- `init()`: Initializes the tab scroller.
- `applyOptions()`: Applies settings based on the current screen width and configuration options.
- `setScroller()`: Sets up the scrolling behavior.
- `setSpaceBetween()`: Sets the spacing between tab items.
- `setInitActive()`: Sets the position of the active tab at initialization.
- `setActive()`: Sets the click behavior for the active tab.
- `setSlide()`: Sets the scrolling behavior when a tab item is clicked.

## CSS Settings

To display the scrollable tabs correctly, you need to add some basic styles in CSS:
``` css
.tabScroller {
    list-style: none;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.tabScroller::-webkit-scrollbar {
    background-color: transparent;
    display: none;
}
.scroller-item .transition-none {
    transition: unset;
}
```

These styles remove the standard scrollbar and ensure that the tabs can freely scroll within the container.

## Event Handling

The `tabScroller` class uses the following events to enhance user interaction:

- `mousedown`: Triggered when the user starts dragging.
- `mousemove`: Updates the scroll position as the user drags.
- `mouseup` and `mouseleave`: Triggered when the user stops dragging.

These events ensure that users can smoothly scroll through the tabs by dragging.

## Notes

When using the `tabScroller` class, ensure that your HTML and CSS structures are correctly set up to support the scrolling functionality. Specifically, the tab container should be set to scrollable, and the tab items should be properly aligned.

Additionally, if you have enabled the `clickToActive` or `clickToScroll` features, be mindful to update the status or position of the related tab items to reflect the current active tab or scroll position.

## Conclusion

The `tabScroller` class offers a flexible and feature-rich solution for implementing horizontal tab scrolling on web pages. With simple configuration and method calls, developers can easily add this interactive tab scrolling feature to their websites.

---
[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="150"/>](https://www.buymeacoffee.com/KenKyou)