/**
 * Background Service Worker
 * 处理扩展的后台任务
 */

console.log('[Unlock Copy] Background service worker started');

/**
 * 安装事件
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Unlock Copy] Extension installed/updated', details);

  if (details.reason === 'install') {
    // 首次安装
    console.log('[Unlock Copy] First install');

    // 可以打开欢迎页面或设置页面
    // chrome.tabs.create({ url: 'welcome.html' });
  } else if (details.reason === 'update') {
    // 更新
    console.log('[Unlock Copy] Updated to version', chrome.runtime.getManifest().version);
  }
});

/**
 * 监听来自 content script 的消息
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Unlock Copy] Background received message:', request);

  // 处理消息
  if (request.action === 'log') {
    console.log('[Unlock Copy] Content log:', request.message);
    sendResponse({ status: 'logged' });
  }

  return true; // 保持消息通道开放
});

/**
 * 标签页更新时注入 content script
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // 页面加载完成时，可以确保 content script 已注入（通过 manifest 配置）
    console.log('[Unlock Copy] Tab updated:', tab.url);
  }
});

/**
 * 快捷键命令处理
 */
chrome.commands?.onCommand?.addListener((command) => {
  console.log('[Unlock Copy] Command received:', command);

  if (command === 'toggle-unlock') {
    // 获取当前标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      const tabId = tabs[0].id;

      // 发送切换命令
      chrome.tabs.sendMessage(tabId, { action: 'toggle' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('[Unlock Copy] Error sending command:', chrome.runtime.lastError);
        } else {
          console.log('[Unlock Copy] Toggle result:', response);
        }
      });
    });
  }
});
