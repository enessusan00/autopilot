// background.ts

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
  


  // background.ts
chrome.runtime.onMessage.addListener(
    (message: any, sender: chrome.runtime.MessageSender, sendResponse: Function) => {
      console.log('Content Script\'ten gelen mesaj:', message);
     chrome.storage.sync.set({message: message}, () => {
        console.log('Mesaj kaydedildi');
      }
        );
      sendResponse({status: 'Mesaj alındı', received: true});
      return true;
    }
    
  );
  