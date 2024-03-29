import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
messages: any;
  ngOnInit(): void {
   chrome.storage.sync.get(['message'], (data:any) => {
      console.log('Background script\'ten gelen mesaj:', data);
      this.messages = data.message.data;
      console.log('messages ', this.messages);
    }
      );
  }

 

}
