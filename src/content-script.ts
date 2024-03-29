console.log('Content script loaded');
var elements = null;
var contents = null;
function readDOM() {
   // `data-message-author-role` özniteliğine sahip tüm elementleri seç
 elements = document.querySelectorAll('[data-message-author-role]');

// `textarea` ve butonu seç
var textarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;


// Gönder düğmesinin disabled özelliğini kaldır
// `textarea`'ya bir değer atayın

// `textarea`'ya değer atandıktan sonra, butonun `disabled` özelliğini kontrol edin ve değiştirin
// if (textarea.value !== '' && (button as HTMLButtonElement).disabled) {
//     (button as HTMLButtonElement).disabled = false;
// }
// "Enter" tuşuna basıldığını simüle eden bir KeyboardEvent oluştur

// "Space" tuşuna basıldığını simüle eden bir KeyboardEvent oluştur
// Bir "Space" KeyboardEvent tetikleyin
textarea.focus();


  // `textarea` elementini seçin

// `textarea`'ya bir değer ekleyin


// `textarea`'nın değerinde değişiklik yapıldığını belirten bir 'input' olayı tetikleyin


// Nokta tuşuna basıldığını simüle eden bir KeyboardEvent tetikleyin

// Seçilen elementlerin içeriklerini bir diziye aktar
 contents = Array.from(elements).map(element => {
    return {
        content: element.textContent, // Elementin metin içeriğini al
        authorRole: element.getAttribute('data-message-author-role') // Elementin `data-message-author-role` özniteliğinin değerini al
    };
});


console.log(contents);

// Önceki adımda content script'ten mesaj gönderildiği varsayılmaktadır.
// Web sayfasına mesajı iletmek için:
chrome.runtime.sendMessage({type:'MESSAGES', data: contents });



// Önceki mesaj gönderme kodunun devamı


textarea.value = contents[contents.length - 1].content ?? '';

var event = new Event('input', { bubbles: true });
textarea.dispatchEvent(event);


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
  
 
  setTimeout(readDOM, 2000); // 1000 ms = 1 saniye
  // DOMContentLoaded yerine delayedReadDOM fonksiyonunu kullanın

  
