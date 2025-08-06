import { tabScroller } from '../src/tabScroller.js';

describe('tabScroller', () => {
  let container;
  let mockHTML;

  beforeEach(() => {
    // Create mock HTML structure
    mockHTML = `
      <ul class="test-container">
        <li class="scroller-item scroller-item-active">
          <button>Item 1</button>
        </li>
        <li class="scroller-item">
          <button>Item 2</button>
        </li>
        <li class="scroller-item">
          <button>Item 3</button>
        </li>
      </ul>
    `;
    document.body.innerHTML = mockHTML;
    container = document.querySelector('.test-container');
  });

  describe('Constructor', () => {
    test('should create instance with valid selector', () => {
      const scroller = new tabScroller('.test-container');
      expect(scroller).toBeInstanceOf(tabScroller);
      expect(scroller.containerSelector).toBe('.test-container');
    });

    test('should throw error with empty selector', () => {
      expect(() => new tabScroller('')).toThrow('containerSelector must be a non-empty string');
    });

    test('should throw error with non-string selector', () => {
      expect(() => new tabScroller(123)).toThrow('containerSelector must be a non-empty string');
    });

    test('should throw error when element not found', () => {
      expect(() => new tabScroller('.non-existent')).toThrow('Element with selector ".non-existent" not found');
    });

    test('should warn when no scroller items found', () => {
      document.body.innerHTML = '<div class="empty-container"></div>';
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      new tabScroller('.empty-container');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'tabScroller: No elements with class "scroller-item" found in ".empty-container"'
      );
      consoleSpy.mockRestore();
    });

    test('should set default options correctly', () => {
      const scroller = new tabScroller('.test-container');
      expect(scroller.options.spaceBetween).toBe(0);
      expect(scroller.options.clickToActive).toBe(false);
      expect(scroller.options.clickToScroll).toBe(false);
      expect(scroller.options.breakpoints).toEqual({});
    });

    test('should merge custom options with defaults', () => {
      const options = {
        spaceBetween: 20,
        clickToActive: true,
        customOption: 'test'
      };
      const scroller = new tabScroller('.test-container', options);
      expect(scroller.options.spaceBetween).toBe(20);
      expect(scroller.options.clickToActive).toBe(true);
      expect(scroller.options.clickToScroll).toBe(false);
      expect(scroller.options.customOption).toBe('test');
    });
  });

  describe('Initialization', () => {
    test('should find container and items correctly', () => {
      const scroller = new tabScroller('.test-container');
      expect(scroller.wrap).toBe(container);
      expect(scroller.item).toHaveLength(3);
    });

    test('should set cursor style on container', () => {
      new tabScroller('.test-container');
      expect(container.style.cursor).toBe('grab');
    });
  });

  describe('Options Application', () => {
    test('should apply breakpoint options correctly', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800
      });

      const options = {
        spaceBetween: 10,
        breakpoints: {
          576: { spaceBetween: 20 },
          768: { spaceBetween: 30 }
        }
      };

      const scroller = new tabScroller('.test-container', options);
      expect(scroller.spaceBetween).toBe(20); // Should use 576 breakpoint
    });

    test('should handle invalid breakpoint options', () => {
      const options = {
        spaceBetween: 10,
        breakpoints: {
          invalid: 'not an object',
          576: { spaceBetween: 20 }
        }
      };

      const scroller = new tabScroller('.test-container', options);
      expect(scroller.spaceBetween).toBe(20);
    });
  });

  describe('Event Handling', () => {
    test('should handle click to active', () => {
      const scroller = new tabScroller('.test-container', { clickToActive: true });
      const secondItem = scroller.item[1];
      
      // Simulate click
      secondItem.click();
      
      expect(secondItem.classList.contains('scroller-item-active')).toBe(true);
      expect(scroller.item[0].classList.contains('scroller-item-active')).toBe(false);
    });

    test('should emit custom event on active change', () => {
      const scroller = new tabScroller('.test-container', { clickToActive: true });
      const eventListener = jest.fn();
      container.addEventListener('tabScrollerActiveChange', eventListener);
      
      const secondItem = scroller.item[1];
      secondItem.click();
      
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeItem: secondItem,
            activeIndex: 1
          }
        })
      );
    });

    test('should handle click to scroll', () => {
      const scroller = new tabScroller('.test-container', { clickToScroll: true });
      const scrollSpy = jest.spyOn(container, 'scroll');
      
      const secondItem = scroller.item[1];
      secondItem.click();
      
      expect(scrollSpy).toHaveBeenCalledWith({
        left: expect.any(Number),
        behavior: 'smooth'
      });
    });
  });

  describe('Resize Handling', () => {
    test('should handle resize with debounce', () => {
      jest.useFakeTimers();
      const scroller = new tabScroller('.test-container');
      const applyOptionsSpy = jest.spyOn(scroller, 'applyOptions');
      
      // Trigger multiple resize events
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      
      expect(applyOptionsSpy).toHaveBeenCalledTimes(1); // Initial call
      
      // Fast-forward time
      jest.advanceTimersByTime(300);
      
      expect(applyOptionsSpy).toHaveBeenCalledTimes(2); // Debounced call
      
      jest.useRealTimers();
    });
  });

  describe('Cleanup', () => {
    test('should remove event listeners on destroy', () => {
      const scroller = new tabScroller('.test-container');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      scroller.destroy();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', scroller.handleResize);
    });

    test('should clear timers on destroy', () => {
      jest.useFakeTimers();
      const scroller = new tabScroller('.test-container');
      
      // Trigger resize to create timer
      window.dispatchEvent(new Event('resize'));
      
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      scroller.destroy();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing items gracefully', () => {
      document.body.innerHTML = '<div class="empty-container"></div>';
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const scroller = new tabScroller('.empty-container');
      
      // Should not throw errors
      expect(() => {
        scroller.setSpaceBetween();
        scroller.setInitActive();
        scroller.setActive();
        scroller.setSlide();
      }).not.toThrow();
      
      consoleSpy.mockRestore();
    });

    test('should handle invalid spaceBetween value', () => {
      const scroller = new tabScroller('.test-container', { spaceBetween: 'invalid' });
      expect(scroller.spaceBetween).toBe(0);
    });

    test('should handle boolean conversion for options', () => {
      const scroller = new tabScroller('.test-container', { 
        clickToActive: 'true',
        clickToScroll: 1
      });
      expect(scroller.clickToActive).toBe(true);
      expect(scroller.clickToScroll).toBe(true);
    });
  });
});