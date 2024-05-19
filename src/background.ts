import { isChatGPTUrl } from './utils';

// Sekmenin URL'sini kontrol eden ve eklenti simgesini güncelleyen fonksiyon
function checkTabAndToggleIcon(tabId: number, url?: string) {
  if (url && isChatGPTUrl(url)) {
    chrome.action.enable(tabId); // Eklenti simgesini aktif yap
  } else {
    chrome.action.disable(tabId); // Eklenti simgesini pasif yap
  }
}

// Sekme güncellendiğinde çalışacak olay dinleyicisi
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkTabAndToggleIcon(tabId, tab.url);
  }
});

// Sekme aktifleştirildiğinde (kullanıcı başka bir sekmeye geçtiğinde) çalışacak olay dinleyicisi
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      checkTabAndToggleIcon(activeInfo.tabId, tab.url);
    }
  });
});

// background.ts'ten front-end'e mesaj gönderme
chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
  chrome.storage.sync.set({ message }, () => {
    sendResponse({ status: 'Mesaj alındı', received: true });
  });
  return true;
});

// Sekme URL'si değiştiğinde yapılacak işlemler
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log('Tab URL değişti: ', changeInfo.url);
    // Yeni URL ile bir şeyler yapın
  }
});

// Web request tamamlandığında yapılacak işlemler
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url === 'https://chat.openai.com/backend-api/conversation') {
      console.log('Web request tamamlandı');
      setTimeout(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "İstek Tamamlandı background.ts" }, (response) => {
              chrome.storage.sync.set({ response }, () => {
                console.log('Response saved:', response);
              });
            });
          }
        });
      }, 300);
    }
  },
  { urls: ['<all_urls>'] }
);
