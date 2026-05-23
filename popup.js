/**
 * Popup 脚本 - 处理用户界面交互
 */

let currentStatus = false;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 获取当前状态
  getCurrentStatus();

  // 绑定按钮事件
  document.getElementById('toggleButton').addEventListener('click', toggleUnlock);

  // 绑定反馈链接
  document.getElementById('reportIssue').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/issues' });
  });
});

/**
 * 获取当前解锁状态
 */
function getCurrentStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const tabId = tabs[0].id;

    // 向 content script 发送消息获取状态
    chrome.tabs.sendMessage(tabId, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        // 如果 content script 未加载，尝试注入
        console.log('Content script not loaded, injecting...');
        injectContentScript(tabId, () => {
          // 重试获取状态
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { action: 'getStatus' }, (response) => {
              if (response) {
                currentStatus = response.unlocked;
                updateUI();
              }
            });
          }, 100);
        });
      } else if (response) {
        currentStatus = response.unlocked;
        updateUI();
      }
    });
  });
}

/**
 * 注入 content script
 */
function injectContentScript(tabId, callback) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  }, () => {
    if (callback) callback();
  });
}

/**
 * 切换解锁状态
 */
function toggleUnlock() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const tabId = tabs[0].id;

    // 向 content script 发送切换命令
    chrome.tabs.sendMessage(tabId, { action: 'toggle' }, (response) => {
      if (chrome.runtime.lastError) {
        // 如果 content script 未加载，先注入
        injectContentScript(tabId, () => {
          // 重试切换
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { action: 'toggle' }, (response) => {
              if (response) {
                currentStatus = response.unlocked;
                updateUI();
              }
            });
          }, 100);
        });
      } else if (response) {
        currentStatus = response.unlocked;
        updateUI();
      }
    });
  });
}

/**
 * 更新 UI 显示
 */
function updateUI() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const toggleButton = document.getElementById('toggleButton');

  if (currentStatus) {
    // 已解锁状态
    statusIndicator.className = 'status-indicator unlocked';
    statusText.textContent = '当前状态：已解锁';
    toggleButton.textContent = '恢复复制限制';
    toggleButton.className = 'toggle-button lock';
  } else {
    // 已锁定状态
    statusIndicator.className = 'status-indicator locked';
    statusText.textContent = '当前状态：已锁定';
    toggleButton.textContent = '解除复制限制';
    toggleButton.className = 'toggle-button unlock';
  }
}
