/**
 * Unlock Copy Pro - 解除网站复制限制（增强版）
 * 支持 CSDN、百度文库、知乎、微信公众号等顽固平台
 */

(function() {
  'use strict';

  // 状态标记
  let isUnlocked = false;

  // 复制计数器（用于绕过检测）
  let copyCount = 0;

  /**
   * 深度移除内联事件处理程序
   */
  function removeInlineHandlers() {
    const events = [
      'oncopy', 'oncut', 'onpaste', 'oncontextmenu',
      'onselect', 'onselectstart', 'ondragstart',
      'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup',
      'onbeforecopy', 'onbeforecut', 'onbeforepaste',
      'onmouseout', 'onmouseover', 'onclick'
    ];

    // 移除 document、body 和所有元素上的内联事件
    const removeFromElement = (el) => {
      if (!el) return;
      events.forEach(event => {
        try {
          el[event] = null;
        } catch (e) {}
      });
    };

    // 移除 document 上的事件
    removeFromElement(document);
    removeFromElement(document.documentElement);
    removeFromElement(document.body);

    // 移除所有元素上的事件（性能考虑，延迟执行）
    setTimeout(() => {
      document.querySelectorAll('*').forEach(el => removeFromElement(el));
    }, 100);
  }

  /**
   * 覆盖 addEventListener
   */
  function overrideAddEventListener() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const restrictedEvents = [
      'copy', 'cut', 'paste', 'contextmenu',
      'select', 'selectstart', 'dragstart', 'mousedown', 'mouseup'
    ];

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (restrictedEvents.includes(type.toLowerCase()) && isUnlocked) {
        const wrappedListener = function(event) {
          try {
            // 完全阻止 preventDefault
            const originalPreventDefault = event.preventDefault;
            event.preventDefault = function() {
              // 空函数，阻止实际的阻止行为
            };
            
            // 临时允许默认行为
            const result = listener.call(this, event);
            
            // 恢复原始方法
            event.preventDefault = originalPreventDefault;
            
            return result;
          } catch (e) {
            // 静默处理错误
          }
        };
        return originalAddEventListener.call(this, type, wrappedListener, options);
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  /**
   * 移除 CSS 复制限制（增强版）
   */
  function removeCSSRestrictions() {
    // 移除旧的样式
    const oldStyle = document.getElementById('unlock-copy-pro-style');
    if (oldStyle) oldStyle.remove();

    // 创建新的覆盖样式
    const style = document.createElement('style');
    style.id = 'unlock-copy-pro-style';
    style.textContent = `
      /* 强制启用文本选择 */
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
        pointer-events: auto !important;
      }

      /* 针对特定平台的修复 */
      
      /* CSDN */
      #content_views pre,
      #content_views code,
      .article-content pre,
      .article-content code,
      .blog-content pre,
      .blog-content code,
      pre.prettyprint,
      code.prettyprint {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }

      /* 移除 CSDN 的复制提示 */
      .hide-pre-code-bt,
      .copy_code,
      .copy-all-btn,
      [class*="csdn"],
      [id*="csdn"],
      .btn-copy,
      .code-snippet,
      .article-copyright,
      .meau-share,
      .template-table,
      .bdsharebuttonbox,
      .reward-window,
      .ad-icon,
      .comment-edit-area,
      .popup,
      [class*="popup"],
      [class*="modal"],
      [class*="overlay"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* 百度文库 */
      .reader-word-layer,
      .ie-fix,
      .mod-reader,
      .reader-tools-bar,
      .kf5萌罩,
      .voice-btn,
      .search-box,
      .reader-info-bar,
      .reader-action-bar,
      .doc-tag-wrapper,
      .doc-ab-test-wrap,
      .promo-wrap,
      .banner,
      .aside,
      #aside,
      #reader-helper,
      .reader-helper {
        display: none !important;
      }

      /* 知乎 */
      .Modal-backdrop,
      .Input-wrapper,
      .CopyButton,
      .ZhihuCopyButton,
      .reward-button-container,
      .post-signature {
        pointer-events: none !important;
      }

      /* 通用：移除禁止复制的class */
      .no-select,
      .unselectable,
      .noselect,
      .disable-select,
      [class*="copy-protected"],
      [class*="no-copy"],
      [class*="protect"],
      [class*="locked"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      /* 移除伪元素的限制 */
      *::before,
      *::after {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }

      /* 处理延迟加载的内容 */
      [lazyload],
      [data-lazyload],
      .lazyload {
        -webkit-user-select: text !important;
        user-select: text !important;
      }
    `;

    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.appendChild(style);
      });
    }
  }

  /**
   * 拦截并禁用事件阻止（增强版）
   */
  function interceptEventPrevention() {
    const restrictedEvents = [
      'copy', 'cut', 'paste', 'contextmenu',
      'select', 'selectstart', 'dragstart',
      'mousedown', 'mouseup', 'keydown', 'keyup'
    ];

    // 拦截 Event.prototype.preventDefault
    Event.prototype.preventDefault = function() {
      if (isUnlocked && this.type && restrictedEvents.includes(this.type.toLowerCase())) {
        console.log('[Unlock Copy Pro] Blocked preventDefault:', this.type);
        return; // 不执行实际的阻止
      }
      Event.prototype.preventDefault.call(this);
    };

    // 拦截 Event.prototype.stopPropagation
    Event.prototype.stopPropagation = function() {
      if (isUnlocked && this.type && restrictedEvents.includes(this.type.toLowerCase())) {
        console.log('[Unlock Copy Pro] Blocked stopPropagation:', this.type);
        return;
      }
      Event.prototype.stopPropagation.call(this);
    };

    // 拦截 Event.prototype.stopImmediatePropagation
    Event.prototype.stopImmediatePropagation = function() {
      if (isUnlocked && this.type && restrictedEvents.includes(this.type.toLowerCase())) {
        console.log('[Unlock Copy Pro] Blocked stopImmediatePropagation:', this.type);
        return;
      }
      Event.prototype.stopImmediatePropagation.call(this);
    };
  }

  /**
   * 移除 document 事件处理器属性
   */
  function removeDocumentHandlers() {
    const handlers = [
      'oncopy', 'oncut', 'onpaste', 'oncontextmenu',
      'onselect', 'onselectstart', 'ondragstart',
      'onbeforecopy', 'onbeforecut', 'onbeforepaste',
      'onmouseout', 'onmouseover'
    ];

    handlers.forEach(handler => {
      try {
        Object.defineProperty(document, handler, {
          get: function() { return null; },
          set: function() {},
          configurable: true
        });
      } catch (e) {}
    });
  }

  /**
   * 移除特定平台的保护元素
   */
  function removeProtectionElements() {
    // 移除 CSDN 保护元素
    const csdnSelectors = [
      '.hide-pre-code-bt',
      '.copy_code',
      '.copy-all-btn',
      '#content_views .hljs-button',
      '.article-copyright',
      '.meau-share',
      '#reportBg',
      '.reward-window',
      '.code-snippet',
      '.blog-content .toolbox'
    ];

    csdnSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
      });
    });

    // 移除百度文库保护元素
    const baiduSelectors = [
      '.reader-word-layer',
      '.reader-helper',
      '.voice-btn',
      '.kf5萌罩',
      '.reader-tools-bar',
      '.reader-info-bar',
      '#reader-helper'
    ];

    baiduSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }

  /**
   * 自动复制选中文本（绕过复制提示）
   */
  function setupAutoCopy() {
    document.addEventListener('mouseup', function(e) {
      if (!isUnlocked) return;

      // 延迟执行，确保选择完成
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
          console.log('[Unlock Copy Pro] Selected text length:', selectedText.length);
          
          // 尝试复制到剪贴板
          try {
            navigator.clipboard.writeText(selectedText).then(() => {
              console.log('[Unlock Copy Pro] Text copied to clipboard automatically!');
              copyCount++;
              
              // 如果复制次数超过阈值，可能被检测
              if (copyCount > 10) {
                console.warn('[Unlock Copy Pro] High copy count detected');
              }
            }).catch(err => {
              console.log('[Unlock Copy Pro] Clipboard API error:', err);
            });
          } catch (e) {
            // 降级方案：使用传统的 execCommand
            try {
              const textArea = document.createElement('textarea');
              textArea.value = selectedText;
              textArea.style.position = 'fixed';
              textArea.style.left = '-9999px';
              textArea.style.top = '-9999px';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              
              const success = document.execCommand('copy');
              console.log('[Unlock Copy Pro] execCommand copy:', success ? 'success' : 'failed');
              
              document.body.removeChild(textArea);
            } catch (ex) {
              console.log('[Unlock Copy Pro] Fallback copy failed:', ex);
            }
          }
        }
      }, 50);
    }, true);
  }

  /**
   * 拦截复制事件并自动复制
   */
  function interceptCopyEvent() {
    document.addEventListener('copy', function(e) {
      if (!isUnlocked) return;

      // 获取选中文本
      const selection = window.getSelection();
      const text = selection.toString();

      if (text) {
        console.log('[Unlock Copy Pro] Copy event intercepted, text length:', text.length);
        
        // 确保剪贴板有内容
        if (e.clipboardData) {
          e.preventDefault();
          e.clipboardData.setData('text/plain', text);
          console.log('[Unlock Copy Pro] Copied via clipboardData');
        }
      }
    }, true);
  }

  /**
   * 移除禁止复制的 class
   */
  function removeNoSelectClasses() {
    const noSelectClasses = [
      'no-select', 'unselectable', 'noselect', 'disable-select',
      'no-copy', 'copy-protected', 'protected', 'locked',
      'hljs-button', 'copy-code', 'copy-btn', 'btn-copy'
    ];

    document.querySelectorAll('*').forEach(el => {
      noSelectClasses.forEach(className => {
        if (el.classList && el.classList.contains(className)) {
          el.classList.remove(className);
        }
      });
      
      // 移除禁止选中的style
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.userSelect === 'none' || computedStyle.webkitUserSelect === 'none') {
        el.style.userSelect = 'text';
        el.style.webkitUserSelect = 'text';
      }
    });
  }

  /**
   * 移除特定的内联样式
   */
  function removeInlineStyles() {
    // 移除所有元素上的 -webkit-user-select: none
    const style = document.createElement('style');
    style.id = 'unlock-copy-remove-styles';
    style.textContent = `
      [style*="user-select: none"],
      [style*="user-select:none"],
      [style*="-webkit-user-select: none"],
      [style*="-webkit-user-select:none"] {
        user-select: text !important;
        -webkit-user-select: text !important;
      }
    `;
    
    if (document.head) {
      document.head.appendChild(style);
    }
  }

  /**
   * 监听键盘复制快捷键
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      if (!isUnlocked) return;

      // Ctrl+C 或 Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selection = window.getSelection();
        const text = selection.toString();

        if (text) {
          console.log('[Unlock Copy Pro] Ctrl+C intercepted');
        }
      }

      // Ctrl+A 全选（绕过限制）
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        console.log('[Unlock Copy Pro] Ctrl+A intercepted');
      }
    }, true);
  }

  /**
   * 深度清理 MutationObserver
   */
  function disableMutationObserver() {
    // 尝试禁用网站设置的 MutationObserver
    if (window.MutationObserver) {
      const originalObserve = MutationObserver.prototype.observe;
      MutationObserver.prototype.observe = function(target, options) {
        // 允许观察，但不传递 childList 和 subtree（防止动态添加保护）
        return originalObserve.call(this, target, {
          attributes: true,
          attributeFilter: ['style', 'class', 'oncopy', 'oncontextmenu']
        });
      };
    }
  }

  /**
   * 启用复制解锁（主函数）
   */
  function enableUnlock() {
    if (isUnlocked) return;

    isUnlocked = true;
    copyCount = 0;
    console.log('[Unlock Copy Pro] 复制限制已解除');

    // 执行所有解锁操作
    removeInlineHandlers();
    removeCSSRestrictions();
    removeInlineStyles();
    removeDocumentHandlers();
    removeNoSelectClasses();
    removeProtectionElements();
    interceptEventPrevention();
    interceptCopyEvent();
    setupAutoCopy();
    setupKeyboardShortcuts();
    disableMutationObserver();

    // 尝试覆盖 addEventListener
    try {
      overrideAddEventListener();
    } catch (e) {
      console.log('[Unlock Copy Pro] Could not override addEventListener');
    }

    // 移除 body 上的禁止复制属性
    if (document.body) {
      document.body.removeAttribute('oncopy');
      document.body.removeAttribute('oncontextmenu');
      document.body.removeAttribute('onselectstart');
      document.body.style.cssText += '; -webkit-user-select: text !important; user-select: text !important;';
    }

    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('unlock-copy-enabled'));
    
    console.log('[Unlock Copy Pro] All protections removed');
  }

  /**
   * 禁用复制解锁
   */
  function disableUnlock() {
    if (!isUnlocked) return;

    isUnlocked = false;
    console.log('[Unlock Copy Pro] 复制限制已恢复');

    // 移除自定义样式
    ['unlock-copy-pro-style', 'unlock-copy-remove-styles'].forEach(id => {
      const style = document.getElementById(id);
      if (style) style.remove();
    });

    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('unlock-copy-disabled'));
  }

  /**
   * 切换解锁状态
   */
  function toggleUnlock() {
    if (isUnlocked) {
      disableUnlock();
    } else {
      enableUnlock();
    }
    return isUnlocked;
  }

  /**
   * 获取当前状态
   */
  function getStatus() {
    return isUnlocked;
  }

  /**
   * 处理百度文库等特殊平台
   */
  function handleSpecialPlatforms() {
    const url = window.location.href;
    
    // 百度文库
    if (url.includes('wenku.baidu.com')) {
      console.log('[Unlock Copy Pro] 百度文库平台检测到，尝试解除限制...');
      
      // 移除 iframe 限制
      document.querySelectorAll('iframe').forEach(iframe => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc) {
            doc.body.style.userSelect = 'text';
          }
        } catch (e) {}
      });
    }
    
    // CSDN
    if (url.includes('csdn.net')) {
      console.log('[Unlock Copy Pro] CSDN平台检测到，尝试解除限制...');
      
      // 移除登录提示
      document.querySelectorAll('.hide-pre-code-bt, .login-mark, .pop-login').forEach(el => {
        el.style.display = 'none';
      });
    }
  }

  // 监听来自 popup 的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enable') {
      enableUnlock();
      sendResponse({ status: true, unlocked: isUnlocked });
    } else if (request.action === 'disable') {
      disableUnlock();
      sendResponse({ status: true, unlocked: isUnlocked });
    } else if (request.action === 'toggle') {
      const newState = toggleUnlock();
      sendResponse({ status: true, unlocked: newState });
    } else if (request.action === 'getStatus') {
      sendResponse({ status: true, unlocked: isUnlocked });
    }
    return true;
  });

  // 页面加载时自动检测平台
  document.addEventListener('DOMContentLoaded', handleSpecialPlatforms);

  // 如果页面已经加载完成，立即检测
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(handleSpecialPlatforms, 500);
  }

  console.log('[Unlock Copy Pro] Script loaded, ready to unlock');

})();
