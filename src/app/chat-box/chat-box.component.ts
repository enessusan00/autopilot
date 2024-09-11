import { animate, animateChild, query as q, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { OpenAIService } from 'src/app/open-ai.service';

const query = (s, a, o = { optional: true }) => q(s, a, o);

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query('@items',
          stagger(600, animateChild())
        )
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1) ,translateY(150%)', opacity: 1 }))
      ]),
    ]),
    trigger('talkAnimation', [
      transition(":enter", [
        style({ transform: "translateY(1500%)" }),
        animate(
          "1s cubic-bezier(0.64, 0.4, 0.12, 0.97)",
          style({
            transform: "translateY(0%)"
          })
        )
      ]),
      transition(":leave", [
        animate(
          "1s 0.4s cubic-bezier(0.64, 0.4, 0.12, 0.97)",
          style({
            transform: "translateY(-1000%)"
          })
        )
      ])
    ]),
  ]
})
export class ChatBoxComponent implements OnInit {
  messages: any[] = [];
  input: string = '';
  topic: string = '';
  userRequests: string[] = [];
  topicMap: any = {};
  totalScore: number = 0;
  scoreThreshold: number = 250; // Kararlılık düzeyi için pozitif eşik değeri
  negativeScoreThreshold: number = -50; // Kararlılık düzeyi için negatif eşik değeri

  constructor(private openaiService: OpenAIService) { }

  async ngOnInit() {

  }

  state = "nothing"
  async sendMessage() {
    const newMessage = { content: this.input, role: 'user' };
    this.messages.push(newMessage);
    this.input = '';

    // Mesaj sayısı 3'e ulaştığında analiz yap
    if (this.messages.length >= 3) {
      await this.analyzeMessages();
    }
  }
  async sendMessageToOllama3() {
    const newMessage = { content: this.input, role: 'user' };
    this.messages.push(newMessage);
    this.input = '';
    this.openaiService.postChatStream(this.messages).subscribe(
        (response) => {
            console.log(response);

            try {
                // Split the response text by newlines to get individual JSON strings
                const jsonObjects = response.split('\n').filter(line => line.trim() !== '');

                // Combine all message contents into a single string
                let combinedContent = '';
                jsonObjects.forEach(jsonString => {
                    try {
                        const data = JSON.parse(jsonString);
                        combinedContent += data.message.content;
                    } catch (innerError) {
                        console.error('Inner JSON parsing error:', innerError);
                    }
                });

                // Add the combined message content to the messages array
                this.messages.push({ content: combinedContent, role: 'assistant' });

            } catch (error) {
                console.error('Overall JSON parsing error:', error);
            }
        }
    );

    if (this.messages.length >= 5) {
        await this.analyzeMessages();
    }
}

  
  async sendSelectedQuestion(question: string) {
    const newMessage = { content: question, role: 'user' };
    this.messages.push(newMessage);
    this.input = '';
    this.state = "nothing"

    this.userRequests.push(question);
    setTimeout(() => {
      this.topicQuestions = []
    }, 300);

    await this.analyzeMessages();

  }
  async analyzeMessages() {
    const userMessages = this.messages.filter(msg => msg.role === 'user').map(msg => msg.content);

    this.openaiService.detectTopicAndScore(userMessages).subscribe((response) => {
      ;
      // this.messages.push({ content: response.response, role: 'assistant' });
      const [analysis, scoreSection] = response.response.split('Benzerlik Skorları:');

      // Analiz edilen konuyu çıkar
      const analysisLines = analysis.split('\n');
      this.topic = analysisLines.find((line: string) => line.startsWith('Ana Konu:'))?.replace('Ana Konu:', '').trim();

      // Benzerlik skorlarını çıkar
      const scoreLines = scoreSection.trim().split('\n').map(line => line.split('. ')[1]);
      const scores = scoreLines.map(score => parseInt(score, 10));

      // Toplam skoru hesapla
      this.totalScore = scores.reduce((acc, score) => acc + score, 0);
      this.allMessages = userMessages
      // Eşik değerine ulaşıldığında veya altında kaldığında analiz yap
      if (this.totalScore >= this.scoreThreshold) {
        this.createTopicMap(userMessages);
      } else if (this.totalScore <= this.negativeScoreThreshold) {
        this.resetAnalysis();
      }
    })
  }
  async autoPilotMode() {
    this.messages.push({ content: this.input, role: 'user' });
    const userMessages = this.messages.filter(msg => msg.role === 'user').map(msg => msg.content);

    this.openaiService.detectTopicAndScore(userMessages).subscribe((response) => {
      // this.messages.push({ content: response.response, role: 'assistant' });
      const [analysis, scoreSection] = response.response.split('Benzerlik Skorları:');

      // Analiz edilen konuyu çıkar
      const analysisLines = analysis.split('\n');
      this.topic = analysisLines.find((line: string) => line.startsWith('Ana Konu:'))?.replace('Ana Konu:', '').trim();

      // Benzerlik skorlarını çıkar
      const scoreLines = scoreSection.trim().split('\n').map(line => line.split('. ')[1]);
      const scores = scoreLines.map(score => parseInt(score, 10));

      // Toplam skoru hesapla
      this.totalScore = scores.reduce((acc, score) => acc + score, 0);
      this.allMessages = userMessages
      // Eşik değerine ulaşıldığında veya altında kaldığında analiz yap
    }
    )
  }
  allMessages = []
  topicQuestions = [];
  createTopicMap(messages: string[]) {
    this.topicQuestions = []
    this.openaiService.detectTopicAndCreateMap(messages, this.topic).subscribe((response) => {
      var questions = response.response.replace(/Konu Haritası ve İlgili Sorular:/g, '');
      questions = questions.split('\n').filter(line => line.trim()).map(line => line.trim());
      questions = questions.map(question =>
        question.replace(/^\d+\.\s*/, ''))
      this.topicQuestions = questions
      setTimeout(() => {
        this.state = "animate"
      }, 400);
    })
  }
  i = 0
  async startAutopilot() {
    this.input = this.topicQuestions[this.i];
    await this.autoPilotMode().then(() => {
    }).then(() => {
      this.i++;
      if (this.i < this.topicQuestions.length) {
        this.startAutopilot()
      }
      else {
        this.i = 0
        this.regenerateQuestions()
      }
    });
  }
  async regenerateQuestions() {
    await this.createTopicMap(this.allMessages)
  }
  resetAnalysis() {
    // Puanı ve mesajları sıfırlayın
    this.totalScore = 0;
    this.messages = [];
    this.topic = '';
    this.userRequests = [];
    this.topicMap = {};
  }

  sendExampleMessages() {
    this.openaiService.sendRequest()
  }
}
