import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicDetectionService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions/gpt-4o';
  private apiKey = '<YOUR API KEY>';

  constructor(private http: HttpClient) {}

  detectTopicAndScore(messages: string[]): Observable<any> {
    const prompt = `
      Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve her mesajın ana konuyla olan benzerlik skorunu (0-100 arasında) değerlendirin. Ana konuya en yakın olan mesajlar için yüksek skor verin.

      Kullanıcı Mesajları:
      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}

      Analiz:
      Ana Konu: [Buraya ana konuyu yazın]
      Benzerlik Skorları:
      ${messages.map((_, index) => `${index + 1}. [Buraya ${index + 1}. mesajın benzerlik skorunu yazın]`).join('\n')}
    `;

    const payload = {
      prompt: prompt,
      max_tokens: 300
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }

  detectTopicAndCreateMap(messages: string[]): Observable<any> {
    const prompt = `
      Aşağıdaki kullanıcı mesajlarını analiz ederek ana konuyu belirleyin. Kullanıcının isteklerine ve ihtiyaçlarına paralel olduğundan emin olun. Ardından, kullanıcıya yardımcı olabilecek ilgili konular ve bu konularla ilgili sorular içeren bir konu haritası oluşturun. Kullanıcı mesajları ve konu haritasını adım adım analiz edin.

      Kullanıcı Mesajları:
      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}

      Analiz:
      Ana Konu: [Buraya ana konuyu yazın]
      Kullanıcı İstekleri:
      - [Buraya kullanıcı isteklerini yazın]

      Konu Haritası ve İlgili Sorular:
      1. [İlk konuyu ve ilgili soruları yazın]
      2. [İkinci konuyu ve ilgili soruları yazın]
      3. [Üçüncü konuyu ve ilgili soruları yazın]

      Sonuç:
      Ana Konu: [Buraya analiz edilen ana konuyu yazın]
      Kullanıcı İstekleri: [Buraya kullanıcı isteklerini yazın]
      Konu Haritası ve İlgili Sorular:
      1. [İlk konuyu ve ilgili soruları yazın]
      2. [İkinci konuyu ve ilgili soruları yazın]
      3. [Üçüncü konuyu ve ilgili soruları yazın]
    `;

    const payload = {
      prompt: prompt,
      max_tokens: 300
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }
}
