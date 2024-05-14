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

// Call init function immediately
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
// var element = document.querySelector('[role="presentation"]');
// element?.classList.add('bg-red-500', 'bg-opacity-40');

var form = document.querySelector('form') as HTMLFormElement;

// DOM'a bir buton ve resim ekle
var button = document.createElement('button');
var svg = `
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-700" 
 width="128.000000pt" height="128.000000pt" viewBox="0 0 128.000000 128.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
fill="currentColor" stroke="none">
<path d="M412 1269 c-150 -25 -299 -171 -318 -312 -5 -34 -13 -47 -40 -65 -22
-14 -36 -34 -43 -59 -14 -49 -14 -297 -1 -345 14 -48 56 -78 108 -78 34 0 44
-5 63 -31 33 -47 73 -59 191 -59 141 1 176 17 218 99 40 81 58 81 102 -1 49
-90 71 -100 231 -96 l129 3 33 37 c27 29 42 37 77 40 l43 3 0 -81 c-1 -88 -13
-119 -62 -151 -22 -15 -55 -19 -185 -21 l-158 -4 0 25 c0 57 -1 57 -156 57
-169 0 -164 4 -164 -119 0 -111 -1 -111 165 -111 123 0 135 2 145 19 5 11 10
29 10 40 0 18 8 20 173 23 169 3 175 4 214 30 22 15 51 44 64 65 24 37 24 42
27 340 3 331 2 340 -56 382 -21 15 -31 31 -35 60 -13 99 -103 223 -195 270
-82 42 -145 51 -342 50 -102 -1 -209 -5 -238 -10z m623 -729 l0 -135 -119 -3
c-133 -3 -136 -2 -171 67 -33 65 -59 86 -106 85 -46 -2 -73 -22 -101 -79 -38
-75 -38 -75 -169 -75 -107 0 -119 2 -129 19 -13 25 -13 201 0 235 l10 26 392
-2 393 -3 0 -135z"/>
</g>
</svg>
`;
button.innerHTML = svg;

// Butona tıklanma olayını dinle
button.classList.add('absolute', 'left-0', 'bottom-20', 'p-2', 'bg-blue-500', 'text-white', 'rounded');
form.parentNode?.insertBefore(button, form.nextSibling);
button.addEventListener('click', () => {
  console.log('Button clicked');
});
