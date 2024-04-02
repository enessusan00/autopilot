// Sekmenin URL'sini kontrol eden ve eklenti simgesini güncelleyen fonksiyon
function checkTabAndToggleIcon(tabId: number, url?: string) {
  if (url && url.includes("chat.openai.com")) {
    chrome.action.enable(tabId); // Eklenti simgesini aktif yap
  } else {
    chrome.action.disable(tabId); // Eklenti simgesini pasif yap
  }
}

// Sekme güncellendiğinde çalışacak olay dinleyicisi
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // URL değişikliği olduğunda veya sekme yeniden yüklendiğinde kontrol yap
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

// background.ts fronta mesaj gönderme
chrome.runtime.onMessage.addListener(
  (message: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
    chrome.storage.sync.set({ message: message }, () => {
    }
    );
    sendResponse({ status: 'Mesaj alındı', received: true });
    return true;
  }

);





chrome.webRequest.onCompleted.addListener(
  (details) => {
    // GPT yanıtı alındığında
    if (details.url === 'https://chat.openai.com/backend-api/conversation') {
      console.log('Web request tamamlandı');
      setTimeout(() => {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
          // Aktif sekmeye mesaj gönder
          chrome.tabs.sendMessage(tabs[0].id, { greeting: "İstek Tamamlandı background.ts" }, function (response) {
            chrome.storage.sync.set({ response: response }, () => {
              console.log('Response saved:', response);
            });
          });
        }
        );
      }, 300);

    }
  },
  { urls: ['<all_urls>'] }
);
