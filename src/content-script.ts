console.log('Content script loaded');
var elements = null;
var contents = null;
function readDOM() {
  // `data-message-author-role` özniteliğine sahip tüm elementleri seç. Bu bizim mesajları alacağımız elementlerdir
  elements = document.querySelectorAll('[data-message-author-role]');
  contents = Array.from(elements).map(element => {
    return {
      content: element.textContent, // Elementin metin içeriğini al
      authorRole: element.getAttribute('data-message-author-role') // Elementin `data-message-author-role` özniteliğinin değerini al
    };
  });
  // `textarea` elementini seçin
  var textarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;
  // `textarea`'ya bir değer ekleyin
  textarea.focus();

  // Web sayfasına mesajı iletmek için:
  chrome.runtime.sendMessage({ type: 'MESSAGES', data: contents });


  // `textarea`'ya son mesajı ekleyin
  textarea.value = contents[contents.length - 1].content ?? '';
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


//setTimeout(readDOM, 2000); // 1000 ms = 1 saniye

// DOMContentLoaded fonksiyonunu kullanın
document.addEventListener('DOMContentLoaded', readDOM);



