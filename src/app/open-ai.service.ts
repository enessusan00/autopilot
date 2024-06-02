import { Injectable } from '@angular/core';
import OpenAI from 'openai';


@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
      dangerouslyAllowBrowser: true // This is the default and can be omitted
    });
  }

  async detectTopicAndScore(messages: string[]): Promise<any> {
    const prompt = `
      Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve her mesajın ana konuyla olan benzerlik skorunu (-100 ile 100 arasında) değerlendirin. Ana konuya en yakın olan mesajlar için yüksek pozitif skor, en alakasız olanlar için yüksek negatif skor verin.

      Örnek Kullanıcı Mesajları:
      1. 'Merhaba, yeni bir telefon almayı düşünüyorum. Hangi marka ve model önerirsiniz?'
      2. 'Telefonun kamerası da önemli, özellikle gece çekimleri.'
      3. 'Motor da almak istiyorum, bu konuda ne düşünüyorsunuz?'

      Örnek Analiz:
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

    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    }).then((response: any) => {
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
    );

    return response;
  }

  async detectTopicAndCreateMap(messages: string[]): Promise<any> {
    const prompt = `
    Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve kullanıcının bu konu üzerinde detaylı araştırma yaptığını düşünün sorduğu sorular HARİCİNDE hangi soruları sorabileceğini belirleyin. Olası diğer ilgili 5 soru içeren bir konu haritası oluşturun.CEVAP OLARAK SADECE KONU HARİTASI İLE İLGİLİ SORULARI YAZIN.

    Kullanıcı Mesajları:

      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}


      Konu Haritası ve İlgili Sorular:
      1. [Ana konu ile ilgili bir soru yazın]
      2. [Ana konu ile ilgili bir sonraki soruyu yazın]
      3. [Ana konu ile ilgili bir sonraki soruyu yazın]
    `;

    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    }).then((response: any) => {
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
    );


    return response
  }
}
