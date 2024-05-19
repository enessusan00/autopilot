import { Component, OnInit } from '@angular/core';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: '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' ,
  dangerouslyAllowBrowser : true// This is the default and can be omitted
});
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  messages: any[] = [];


  ngOnInit(): void {
    chrome.storage.sync.get(['message'], (data: any) => {
      console.log('Data:', data);
      this.messages = data.message;
      console.log('Messages:', this.messages);
    }
    );
  }

  async sendMessage(): Promise<void> {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo',
    }).then((response:any) => {
      console.log(response.choices[0].message.content);
      this.messages.push({ role: 'assistant', content: response.choices[0].message.content });
    });
  }
}
