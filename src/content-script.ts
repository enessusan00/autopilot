import { isChatGPTUrl, readDOM, sendRequestToGPT } from './utils';
import { detectTopicAndCreateMap, detectTopicAndScore } from './gpt-controller';

let messages: any[] = [];

// Başlangıç fonksiyonu
function init() {
  // Eğer ChatGPT URL'si ise mesajları oku ve analiz et
  if (isChatGPTUrl(window.location.href)) {
    messages = readDOM();
    userMessages = messages.filter(msg => msg.authorRole === 'user').map(msg => msg.content);
    if (userMessages.length >= 3) {
      analyzeMessages();
    }
    setTimeout(() => {
      addStatusComponent()
      if (!autopilotMod) {
        UpdateComponent();
      }
    }, 300);
  }
  else {
    console.log('URL uygun değil');
  }
}

// Mesajları front-end'e gönderen fonksiyon
function sendMessagesToFront(data: any) {
  chrome.runtime.sendMessage({ messages: data });
  chrome.storage.sync.set({ ['message']: data }, () => {
  }
  );
}



var componentBody = ``;
var status = 0;

// Dom'a Modalı ekleyen fonksiyon
function addStatusComponent() {
  const body = document.querySelector('body');
  if (body) {
    const component = document.getElementById('auto-pilot-body');
    if (!component) {
      const newComponent = document.createElement('div');
      newComponent.id = 'auto-pilot-body';
      newComponent.innerHTML = `
        <div class="flex items-center w-full h-full ">
          <div style="color: #3F3F46;" class="flex flex-col auto-pilot-body items-center justify-center rounded-xl gap-2 bg-white bg-opacity-40 w-full h-full">
            <div id="auto-pilot-body-inner" class="flex flex-col items-center h-full justify-center">
            
            </div>
          </div>
        </div>`;
      newComponent.classList.add('absolute', 'right-8', 'bottom-16', 'w-80', 'min-h-72', 'p-0', 'bg-white', 'rounded-xl', 'border-2', 'border-gray-200', 'shadow-md');
      body.appendChild(newComponent);


      setTimeout(() => {
        if (!autopilotMod) {
          UpdateComponent();
        }
      }, 300);
    }
  } else {
    console.error('Body element not found');
  }
}
// Modal body'i güncelleyen fonksiyon
function UpdateComponent() {
  const component = document.getElementById('auto-pilot-body');
  if (component) {
    const componentModalInner = document.getElementById('auto-pilot-body-inner');
    if (componentModalInner) {
      componentBody = '';
      switch (status) {
        case 0:
          if (userMessages.length == 1) {
            componentBody += `
            <h1 class="text-xl font-bold">AutoPilot 🚀</h1>
            <p class="text-lg">Awesome! Keep it coming! ✍️✨ </p>
            <p class="text-lg animate-pulse">⌨️ type type type 😩</p>
          `
          } else if (userMessages.length == 2) {
            componentBody += `
              <h1 class="text-xl font-bold">AutoPilot 🚀</h1>
              <p class="text-lg"> 🤔 </p>
              <p class="text-lg animate-pulse">Thinking cap on! 🧠💡</p>
            `
          } else if (userMessages.length >= 3) {
            componentBody += `
                <h1  class="text-xl font-bold">AutoPilot 🚀</h1>
                <p class="text-lg">💬 </p>
                <p class="text-lg animate-pulse">Almost there! One more push! 💥</p>
              `
          } else if (userMessages.length == 0) {
            componentBody += `
                  <h1 class="text-xl font-bold">AutoPilot 🚀</h1>
                  <p class="text-lg text-center">Hey! Let’s chat with GPT! Just type away! 🎉</p>
                  <p class="text-lg animate-pulse">We'll get ready ...</p>
                `;
          }
          break;
        case 1:
          componentBody = `
          <h1  class="text-xl font-bold">AutoPilot 🚀</h1>
          <p class="text-lg"> Check these out!</p>
        `
          for (var i = 0; i < topicQuestions.length; i++) {

            componentBody += `
        <button id="question-${i}" class="bg-token-sidebar-surface-primary dark:text-white text-black border-2 font-bold py-2 px-4 rounded-md mx-2 mb-2">
        ${trimFirstAndLast(topicQuestions[i])}
        </button>
          `
          }
          componentBody += `
          <div class="flex  items-center justify-between">
          <button id="autopilot-start" class=" border-2 font-bold py-2 px-4 rounded-md mx-2 mb-2">
        Start AutoPilot Mode 🚀
          </button>
          <button id="reset-questions" class=" border-2 font-bold py-2 px-4 rounded-md mx-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
              d="M12.0789 2.25001C7.28487 2.25001 3.34487 5.91301 2.96087 10.583H1.99987C1.85118 10.5829 1.70582 10.6271 1.58227 10.7098C1.45871 10.7925 1.36253 10.9101 1.30595 11.0476C1.24936 11.1851 1.23492 11.3363 1.26446 11.482C1.29401 11.6278 1.3662 11.7614 1.47187 11.866L3.15187 13.532C3.29232 13.6712 3.48209 13.7494 3.67987 13.7494C3.87764 13.7494 4.06741 13.6712 4.20787 13.532L5.88787 11.866C5.99353 11.7614 6.06572 11.6278 6.09527 11.482C6.12481 11.3363 6.11037 11.1851 6.05378 11.0476C5.9972 10.9101 5.90102 10.7925 5.77746 10.7098C5.65391 10.6271 5.50855 10.5829 5.35987 10.583H4.46687C4.84687 6.75201 8.10487 3.75001 12.0789 3.75001C13.3891 3.74729 14.6781 4.0808 15.8227 4.71863C16.9672 5.35646 17.9289 6.27728 18.6159 7.39301C18.6661 7.47958 18.7332 7.55521 18.8132 7.61544C18.8932 7.67567 18.9844 7.71928 19.0815 7.7437C19.1785 7.76812 19.2795 7.77287 19.3785 7.75764C19.4774 7.74242 19.5723 7.70755 19.6576 7.65507C19.7428 7.6026 19.8167 7.53359 19.8749 7.45211C19.933 7.37063 19.9743 7.27834 19.9962 7.18066C20.0181 7.08298 20.0203 6.98191 20.0025 6.88339C19.9848 6.78486 19.9475 6.69089 19.8929 6.60701C19.0718 5.27329 17.9224 4.17243 16.5546 3.40962C15.1867 2.64682 13.645 2.24756 12.0789 2.25001ZM20.8409 10.467C20.7005 10.3284 20.5111 10.2507 20.3139 10.2507C20.1166 10.2507 19.9272 10.3284 19.7869 10.467L18.0999 12.133C17.9939 12.2375 17.9214 12.3712 17.8917 12.517C17.8619 12.6628 17.8762 12.8141 17.9327 12.9518C17.9892 13.0895 18.0853 13.2072 18.209 13.29C18.3326 13.3729 18.4781 13.4171 18.6269 13.417H19.5259C19.1439 17.247 15.8749 20.25 11.8819 20.25C10.5675 20.2537 9.27409 19.9207 8.12488 19.2828C6.97568 18.6449 6.00897 17.7234 5.31687 16.606C5.26512 16.5222 5.19738 16.4493 5.11749 16.3917C5.0376 16.334 4.94713 16.2926 4.85125 16.2699C4.75538 16.2472 4.65597 16.2436 4.5587 16.2593C4.46143 16.2751 4.36821 16.3098 4.28437 16.3615C4.11502 16.466 3.99413 16.6335 3.94828 16.8271C3.90243 17.0208 3.93537 17.2247 4.03987 17.394C4.86641 18.7292 6.02104 19.8304 7.39376 20.593C8.76649 21.3555 10.3116 21.7538 11.8819 21.75C16.6899 21.75 20.6469 18.09 21.0319 13.417H21.9999C22.1487 13.4171 22.2941 13.3729 22.4178 13.29C22.5414 13.2072 22.6376 13.0895 22.6941 12.9518C22.7506 12.8141 22.7648 12.6628 22.7351 12.517C22.7053 12.3712 22.6328 12.2375 22.5269 12.133L20.8409 10.467Z"
              fill="currentColor" />
      </svg>
          </button>
          </div>
          `
          break;
        default:
          componentBody = `
          ${totalScore}
            <h1 class="text-xl font-bold">AutoPilot 🚀</h1>
            <p class="text-lg">Start a conversation with GPT </p>
            <p class="text-lg animate-pulse">We'll get ready ...</p>
          `;
          break;
      }
      componentModalInner.innerHTML = componentBody;
      if (status == 1) {
        listenQuestions()
      }

    } else {
      console.log('AUTO-PILOT BODY INNER NOT FOUND');
    }
  } else {
    console.log('AUTO-PILOT BODY NOT FOUND');
  }
}
function trimFirstAndLast(str: string): string {
  if (str.length <= 2) {
    return ''; // Eğer stringin uzunluğu 2 veya daha az ise, boş string döndür.
  }
  if (str.startsWith(`'`) || str.startsWith(`"`)) {
    return str.substring(1, str.length - 1);
  }
  return str;
}
function listenQuestions() {
  for (var i = 0; i < topicQuestions.length; i++) {
    const questionButton = document.getElementById(`question-${i}`) as HTMLButtonElement;
    if (questionButton) {
      questionButton.addEventListener('click', () => {
        // sendRequestToGPT(topicQuestions[i]); // Asenkron fonksiyon çağrısı
        sendRequestToGPT('🚀' + questionButton.textContent);
        questionButton.disabled = true;
        questionButton.textContent = '👍';
        disableAllButtons()
        setTimeout(() => {
          updateBodySkeleton()
        }, 500);
      });
    } else {
      console.error('demo-button not found');
    }
  }
  const resetButton = document.getElementById('reset-questions') as HTMLButtonElement;
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetButton.textContent = '👍';
      isResetDisabled = true;
      updateBodySkeleton()
      createTopicMap(userMessages);
    });
  } else {
    console.error('reset-button not found');
  }
  const autpilotStart = document.getElementById('autopilot-start') as HTMLButtonElement;
  if (autpilotStart) {
    autpilotStart.addEventListener('click', () => {
      toggleAutpilotMode();
    });
  } else {
    console.error('autpilot-start not found');
  }
  const autpilotStop = document.getElementById('autopilot-stop') as HTMLButtonElement;
  if (autpilotStop) {
    autpilotStop.addEventListener('click', () => {
      toggleAutpilotMode();
    });
  } else {
    console.error('autpilot-stop not found');
  }
}
// AutoPilot mod: Her bir soruyu sırayla gönderir ve kullanıcı durdurmadığı sürece yeni soru üretilip gönderilir.
function toggleAutpilotMode() {
  autopilotMod = !autopilotMod;
  if (autopilotMod == true) {
    sendRequestToGPT(topicQuestions[0]);
    const component = document.getElementById('auto-pilot-body');
    if (component) {
      const componentModalInner = document.getElementById('auto-pilot-body-inner');
      if (componentModalInner) {
        componentModalInner.innerHTML =
          `<div class=" w-80 h-24 rounded-md  flex  items-center justify-center  animate-pulse"> 
        Autopilot mode on 🚀
         </div>
         <button id="autopilot-stop" class=" border-2 font-bold py-2 px-4 rounded-md mx-2 mb-2">
          Stop Autopilot 🛑
          </button> 
         `;
        if (autopilotMod) {
          listenQuestions()
        }
      }
    }
  } else {
    UpdateComponent()
  }
}
var autopilotMod = false;


function updateBodySkeleton() {
  const component = document.getElementById('auto-pilot-body');
  if (component) {
    const componentModalInner = document.getElementById('auto-pilot-body-inner');
    if (componentModalInner) {
      componentModalInner.innerHTML = '<div class=" w-80 h-24 rounded-md  flex  items-center justify-center  animate-pulse">Waiting for response </div>';

    }
  }

}
var isResetDisabled = false;


var isDisabled = false;
function disableAllButtons() {
  isDisabled = !isDisabled;
  for (var i = 0; i < topicQuestions.length; i++) {
    const questionButton = document.getElementById(`question-${i}`) as HTMLButtonElement;
    if (questionButton) {
      questionButton.disabled = isDisabled;
    }
  }
  const resetButton = document.getElementById('reset-questions') as HTMLButtonElement;
  if (resetButton) {
    resetButton.disabled = isResetDisabled;
  }
}

var userMessages = []

// MutationObserver kullanarak DOM değişikliklerini izleme
const observer = new MutationObserver(async (mutations, obs) => {
  if (isChatGPTUrl(window.location.href)) {
    setTimeout(() => {
      readDOM();
      addStatusComponent();
    }, 300);
  }
});

function resetAll() {
  status = 0;
  totalScore = 0;
  topicQuestions = []
  userMessages = []
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "webRequestCompleted" || request.action === "changed") {
    console.log('Web request tamamlandı');
    init();
    sendResponse({ status: 'Content script received the message' });
  } else if (request.action === "changed") {
    console.log('Tab URL değişti: ');
    resetAll()
    init();
    sendResponse({ status: 'Content script received the message' });
  }
});


// Başlangıçta observer'ı başlat
observer.observe(document.body, {
  childList: true,
  subtree: true
});




var topic = '';
var totalScore = -50;
var scoreThreshold = 200; // Kararlılık düzeyi için pozitif eşik değeri
var negativeScoreThreshold = 0; // Kararlılık düzeyi için negatif eşik değeri
async function analyzeMessages() {
  const questions = messages.filter(msg => msg.authorRole === 'user').map(msg => msg.content);
  if (questions.length === 0) {
    return;
  }
  const response = await detectTopicAndScore(questions);
  messages.push({ id: messages.length, content: response, authorRole: 'assistant' });
  const [analysis, scoreSection] = response.split('Benzerlik Skorları:');
  // Analiz edilen konuyu çıkar
  const analysisLines = analysis.split('\n');
  topic = analysisLines.find((line: string) => line.startsWith('Ana Konu:'))?.replace('Ana Konu:', '').trim();
  // Benzerlik skorlarını çıkar
  const scoreLines = scoreSection.trim().split('\n').map(line => line.split('. ')[1]);
  const scores = scoreLines.map(score => parseInt(score, 10));
  // Toplam skoru hesapla
  totalScore = scores.reduce((acc, score) => acc + score, 0);
  userMessages = questions
  // Eşik değerine ulaşıldığında veya altında kaldığında analiz yap
  if (!autopilotMod) {
    UpdateComponent()
  }
  if (totalScore >= scoreThreshold) {
    await createTopicMap(userMessages);
  } else if (totalScore <= negativeScoreThreshold) {
    resetAnalysis();
  }
}
var topicQuestions = []

async function createTopicMap(messages: string[]) {
  topicQuestions = []
  const response = await detectTopicAndCreateMap(messages);
  console.log('response:', response)

  var questions = response
  // .replace(/Konu Haritası ve İlgili Sorular:/g, '');
  console.log('topicQuestions:', questions)

  questions = questions.split('\n').filter(line => line.trim()).map(line => line.trim());
  let cleanedQuestions = questions.map((question, index) => {
    if (typeof question === 'string') {
      const cleaned = question.replace(/^\d+\.\s*/, '');
      console.log(`cleanedQuestions[${index}]:`, cleaned);
      return cleaned;
    } else {
      console.warn(`questions[${index}] is not a string:`, question);
      return question;
    }
  });
  topicQuestions = cleanedQuestions
  console.log('questions:', questions)
  console.log('topicQuestions:', topicQuestions)

  status = 1;
  setTimeout(() => {
    if (autopilotMod) {
      sendRequestToGPT(topicQuestions[0]);
      return;
    }
    if (!autopilotMod) {
      UpdateComponent()
    }
  }, 500);
}

function resetAnalysis() {
  topic = '';
  totalScore = 0;
  topicQuestions = [];
}

setTimeout(init, 2000);