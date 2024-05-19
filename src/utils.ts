// URL kontrol fonksiyonu
export function isChatGPTUrl(url: string): boolean {
    return url.startsWith("https://chatgpt.com/") || url === "https://chatgpt.com" || (url.startsWith("https://chatgpt.com/") && url !== "https://chatgpt.com/gpts") ;
  }
  