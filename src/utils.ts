// URL kontrol fonksiyonu
export function isChatGPTUrl(url: string): boolean {
  return url.startsWith("https://chatgpt.com/") || url === "https://chatgpt.com" || (url.startsWith("https://chatgpt.com/") && url !== "https://chatgpt.com/gpts");
}

// DOM'dan mesajları okuyan fonksiyon
export function readDOM(): any[] {
  const elements = document.querySelectorAll('[data-message-author-role]');
  if (!elements) {
    console.error('Elements not found');
    return [];
  }
  return Array.from(elements).map((element, index) => ({
    id: index,
    content: element.textContent,
    authorRole: element.getAttribute('data-message-author-role')
  }));
}

// DOM GPT'ye mesaj gönderen fonksiyon
export function sendRequestToGPT(message: string) {
  const textarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;
  if (textarea) {
    textarea.focus();
    textarea.value = message;
    const inputEvent = new Event('input', { bubbles: true });
    textarea.dispatchEvent(inputEvent);
    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
      bubbles: true
    });
    setTimeout(() => {
      textarea.dispatchEvent(enterKeyEvent);
    }, 300);
  } else {
    console.error('Textarea element not found');
  }
}
