import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  messages: any[] = [];


  ngOnInit(): void {
    chrome.storage.sync.get(['message'], (data: any) => {
      this.messages = data.message.messages;
    }
    );
  }
}
