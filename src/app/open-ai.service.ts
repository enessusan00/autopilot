import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private openai: OpenAI;

  constructor(
    private http: HttpClient
  ) {
    this.openai = new OpenAI({
      baseURL: 'http://localhost:1234/v1',
      apiKey: 'lm-studio',
      dangerouslyAllowBrowser: true // This is the default and can be omitted
    });
  }
  sendRequest(message?: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const prompt = `
    SENDEN BİR ANALİZÖR GİBİ DAVRANMANI İSTİYORUM.
      Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve her mesajın ana konuyla olan benzerlik skorunu (-100 ile 100 arasında) değerlendirin. Ana konuya en yakın olan mesajlar için yüksek pozitif skor, en alakasız olanlar için yüksek negatif skor verin.VERİLEN ÖRNEK FORMATIN DIŞINA ÇIKMAYIN. VERİLEN FORMATIN DIŞINDA CEVAP VERME. HİÇBİR AÇIKLAMA YAPMA


      Örnek Kullanıcı Mesajları:
      1. 'Merhaba, yeni bir telefon almayı düşünüyorum. Hangi marka ve model önerirsiniz?'
      2. 'Telefonun kamerası da önemli, özellikle gece çekimleri.'
      3. 'Motor da almak istiyorum, bu konuda ne düşünüyorsunuz?'

      Örnek Response:
      Ana Konu: Yeni bir telefon satın alma
      Benzerlik Skorları:
      1. 90
      2. 85
      3. -60

      Şimdi aşağıdaki kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve benzerlik skorlarını (-100 ile 100 arasında) verin:

      Kullanıcı Mesajları:
      1. Kök alma işlemi nedir?
      2. Kök alma işlemi nasıl yapılır?
      3. Kök alma işlemi ne zaman yapılır?

      Analiz:
      Ana Konu: [Buraya ana konuyu yazın]
      Benzerlik Skorları:
      1. [Buraya 1. mesajın benzerlik skorunu yazın]
      2. [Buraya 2. mesajın benzerlik skorunu yazın]
      3. [Buraya 3. mesajın benzerlik skorunu yazın]
      ....
    `;
    return this.http.post('http://localhost:11434/api/generate',
      {
        "model": "aya",
        "prompt": prompt,
        "stream": false
      }, { headers: header }
    ).subscribe((response) => {
      console.log(response);
    });
  }
  detectTopicAndScore(messages: string[]): Observable<any> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const prompt = `
    SENDEN BİR ANALİZÖR GİBİ DAVRANMANI İSTİYORUM.
    Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve her mesajın ana konuyla olan benzerlik skorunu (-100 ile 100 arasında) değerlendirin. Ana konuya en yakın olan mesajlar için yüksek pozitif skor, en alakasız olanlar için yüksek negatif skor verin.VERİLEN ÖRNEK FORMATIN DIŞINA ÇIKMAYIN. VERİLEN FORMATIN DIŞINDA CEVAP VERME. HİÇBİR AÇIKLAMA YAPMA


    Örnek Kullanıcı Mesajları:
    1. 'Merhaba, yeni bir telefon almayı düşünüyorum. Hangi marka ve model önerirsiniz?'
    2. 'Telefonun kamerası da önemli, özellikle gece çekimleri.'
    3. 'Motor da almak istiyorum, bu konuda ne düşünüyorsunuz?'

    Örnek Response:
    Ana Konu: Yeni bir telefon satın alma
    Benzerlik Skorları:
    1. 90
    2. 85
    3. -60

      Şimdi aşağıdaki kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve benzerlik skorlarını (-100 ile 100 arasında) verin:

      Kullanıcı Mesajları:
      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}

      Analiz:
      Ana Konu: [Buraya ana konuyu yazın]
      Benzerlik Skorları:
      ${messages.map((_, index) => `${index + 1}. [Buraya ${index + 1}. mesajın benzerlik skorunu yazın]`).join('\n')}
    `;

    return this.http.post('http://localhost:11434/api/generate',
      {
        "model": "aya",
        "prompt": prompt,
        "stream": false
      }, { headers: header }
    )

  }

  detectTopicAndCreateMap(messages: string[], topic: string): Observable<any> {
    const prompt = `
    Kullanıcının odaklanmak istediği ana konuyu  üzerinde detaylı araştırma yaptığını düşünün ve sorduğu sorular HARİCİNDE bu konu ile ilgili hangi soruları sorabileceğini belirleyin. Kullanıcının odaklanmak istediği konu ile ilgili en fazla 5 soru içeren bir konu haritası oluşturun. CEVAP OLARAK SADECE KONU HARİTASI İLE İLGİLİ SORULARI YAZIN. TÜRKÇE ve Anlamlı CEVAP VERİN. ÜRETTİĞİN SORULAR VE  SORULARIN CEVAPLARI KULLANICI SORULARINA VE SORULARININ CEVAPLARINA BENZEMEMELİDİR. ÜRETİLECEK SORUNUN CEVABI KULLANICI SORULARININ CEVAPLARI İLE BENZER OLAMAZ. VERİLEN ÖRNEK FORMATIN DIŞINA ÇIKMAYIN. VERİLEN FORMATIN DIŞINDA CEVAP VERME. HİÇBİR AÇIKLAMA YAPMA. HAZIRSAN BAŞLA.
    
    ÖRNEK ÇIKTI FORMATI:
    Konu Haritası ve İlgili Sorular:    
    [İlk ilgili soruyu yazın]
    [İkinci ilgili soruyu yazın]
    [Üçüncü ilgili soruyu yazın]
    
    Ana Konu : ${topic}

    Kullanıcı Mesajları:

      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}



      Konu haritası ile  İlgili Sorular:
      [Buraya konu haritası ile ilgili soruları yazın]
     
    `;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });



    return this.http.post('http://localhost:11434/api/generate',
      {
        "model": "aya",
        "prompt": prompt,
        "stream": false
      }, { headers: header }
    )
  }
}
