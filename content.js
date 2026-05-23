/**
 * Unlock Copy - 解除网站复制限制
 * 通过多种方式移除网站的复制、选择、右键菜单限制
 */

(function() {
  'use strict';

  // 存储原始事件监听器
  let isUnlocked = false;

  /**
   * 移除内联事件处理程序
   */
  function removeInlineHandlers() {
    const events = [
      'oncopy', 'oncut', 'onpaste', 'oncontextmenu',
      'onselect', 'onselectstart', 'ondragstart',
      'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup'
    ];

    // 移除 document 上的内联事件
    events.forEach(event => {
      if (document[event]) {
        document[event] = null;
      }
    });

    // 移除 body 上的内联事件
    if (document.body) {
      events.forEach(event => {
        if (document.body[event]) {
          document.body[event] = null;
        }
      });
    }

    // 移除所有元素上的内联事件（可选，可能影响性能）
    if (window.unlockCopyRemoveAll) {
      document.querySelectorAll('*').forEach(el => {
        events.forEach(event => {
          if (el[event]) {
            el[event] = null;
          }
        });
      });
    }
  }

  /**
   * 覆盖 addEventListener 来阻止复制相关的事件阻止
   */
  function overrideAddEventListener() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // 如果是复制限制相关的事件，不阻止添加，但在触发时绕过
      const restrictedEvents = [
        'copy', 'cut', 'paste', 'contextmenu',
        'select', 'selectstart', 'dragstart'
      ];

      if (restrictedEvents.includes(type.toLowerCase())) {
        // 包装监听器，使其无法阻止默认行为
        const wrappedListener = function(event) {
          // 如果已经解锁，让事件正常传播但不阻止默认行为
          if (isUnlocked) {
            try {
              // 临时保存并恢复 preventDefault
              const originalPreventDefault = event.preventDefault;
              event.preventDefault = function() {
                console.log(`[Unlock Copy] Blocked preventDefault on ${type}`);
                // 不执行阻止
              };
              listener.call(this, event);
              event.preventDefault = originalPreventDefault;
            } catch (e) {
              listener.call(this, event);
            }
          } else {
            listener.call(this, event);
          }
        };

        return originalAddEventListener.call(this, type, wrappedListener, options);
      }

      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  /**
   * 移除 CSS 复制限制
   */
  function removeCSSRestrictions() {
    // 创建样式来覆盖 user-select
    const style = document.createElement('style');
    style.id = 'unlock-copy-style';
    style.textContent = `
      * {
        -webkit-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
      }
      
      body, div, p, span, article, section, main {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;

    // 移除旧的样式（如果存在）
    const oldStyle = document.getElementById('unlock-copy-style');
    if (oldStyle) {
      oldStyle.remove();
    }

    // 添加到 head 或 document
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild(style);
      });
    }
  }

  /**
   * 拦截并禁用事件阻止
   */
  function interceptEventPrevention() {
    // 保存原始的 preventDefault 和 stopPropagation
    const originalPreventDefault = Event.prototype.preventDefault;
    const originalStopPropagation = Event.prototype.stopPropagation;

    const restrictedEvents = [
      'copy', 'cut', 'paste', 'contextmenu',
      'select', 'selectstart', 'dragstart',
      'mousedown', 'mouseup'
    ];

    Event.prototype.preventDefault = function() {
      // 如果已经解锁，且是受限事件，不执行 preventDefault
      if (isUnlocked && this.type && restrictedEvents.includes(this.type.toLowerCase())) {
        console.log(`[Unlock Copy] Prevented preventDefault on ${this.type}`);
        return; // 不执行阻止默认行为
      }
      return originalPreventDefault.call(this);
    };

    Event.prototype.stopPropagation = function() {
      // 如果已经解锁，且是受限事件，不执行 stopPropagation
      if (isUnlocked && this.type && restrictedEvents.includes(this.type.toLowerCase())) {
        console.log(`[Unlock Copy] Prevented stopPropagation on ${this.type}`);
        return;
      }
      return originalStopPropagation.call(this);
    };
  }

  /**
   * 移除 document 上的事件处理器属性
   */
  function removeDocumentHandlers() {
    const handlers = [
      'oncopy', 'oncut', 'onpaste', 'oncontextmenu',
      'onselect', 'onselectstart', 'ondragstart',
      'onbeforecopy', 'onbeforecut', 'onbeforepaste'
    ];

    handlers.forEach(handler => {
      try {
        Object.defineProperty(document, handler, {
          value: null,
          writable: true,
          configurable: true
        });
      } catch (e) {
        // 忽略错误
      }
    });
  }

  /**
   * 启用复制解锁
   */
  function enableUnlock() {
    if (isUnlocked) return;

    isUnlocked = true;
    console.log('[Unlock Copy] 复制限制已解除');

    removeInlineHandlers();
    removeCSSRestrictions();
    removeDocumentHandlers();
    interceptEventPrevention();

    // 触发一个自定义事件通知其他脚本
    document.dispatchEvent(new CustomEvent('unlock-copy-enabled'));
  }

  /**
   * 禁用复制解锁
   */
  function disableUnlock() {
    if (!isUnlocked) return;

    isUnlocked = false;
    console.log('[Unlock Copy] 复制限制已恢复');

    // 移除自定义样式
    const style = document.getElementById('unlock-copy-style');
    if (style) {
      style.remove();
    }

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
    return true; // 保持消息通道开放
  });

  // 可选：自动解锁（如果需要）
  // enableUnlock();

})();
