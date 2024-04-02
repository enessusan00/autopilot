console.log('Content script loaded');
var messages: any = [];

// Start the interval
function init() {
  messages = readDOM();
  console.log('İlk mesajlar', messages)
  // İlk okuma
  sendMessagesToFront(messages);
}

function readNewMessages() {
  // elements listesini tekrar oku ve önceki halinden farklı olanları gönder

  // Yeni mesajları gönder
  sendMessagesToFront(readDOM());
  // Güncel mesajları kaydet
  messages = readDOM()
}




function readDOM(): Array<any> {
  var elements = document.querySelectorAll('[data-message-author-role]');
  var contents = Array.from(elements).map((element, index) => {
    return {
      id: index, // Elementin sıra numarasını al
      content: element.textContent, // Elementin metin içeriğini al
      authorRole: element.getAttribute('data-message-author-role') // Elementin `data-message-author-role` özniteliğinin değerini al
    };
  });
  return contents;
}

// Tüm mesajları gönder
function sendMessagesToFront(data: any) {
  chrome.runtime.sendMessage({ messages: data });
}

// Bu fonksiyon sayesinde mesaj gönderilir
function sendRequestToGPT(message: string) {
  var textarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;
  // `textarea`'ya bir değer ekleyin
  textarea.focus();
  // `textarea`'ya bir değer ekleyin
  textarea.value = message;
  // `textarea`'ya bir `input` olayı gönderin
  var event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
  // `textarea`'ya bir `keydown` olay gönderin
  var enterKeyEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    charCode: 13,
    bubbles: true
  });
  // Oluşturulan KeyboardEvent'i `textarea`'ya gönder
  setTimeout(() => {
    textarea.dispatchEvent(enterKeyEvent);
  }, 300);
}



setTimeout(init, 2000);


// background.ts'den mesaj alır
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // Yanıt gönder
    readNewMessages();
    sendResponse({ farewell: "Hoşça kal background script" });
  }
);

// DOM'a bir button ekle
var button = document.createElement('button');
button.textContent = 'Click Me';
document.body.appendChild(button);