import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true // This is the default and can be omitted
  });

export async function  detectTopicAndScore(messages: string[]): Promise<any> {
    const prompt = `
      Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve her mesajın ana konuyla olan benzerlik skorunu (-100 ile 100 arasında) değerlendirin. Ana konuya en yakın olan mesajlar için yüksek pozitif skor, en alakasız olanlar için yüksek negatif skor verin.

      Örnek Kullanıcı Mesajları:
      1. selam
      2. yeni bir telefon almayı düşünüyorum. Hangi marka ve model önerirsiniz?
      3. Telefonun kamerası da önemli, özellikle gece çekimleri.
      4. Motor da almak istiyorum, bu konuda ne düşünüyorsunuz?
      5. Telefon kameraları mı daha iyi yoksa profesyonel kameralar mı?

      Örnek Analiz:
      Ana Konu: Satın alma konusunda yardım
      Benzerlik Skorları:
      1. 0
      2. 90
      3. 85
      4. -60
      5. 50

      Şimdi aşağıdaki kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve benzerlik skorlarını (-100 ile 100 arasında) verin:

      Kullanıcı Mesajları:
      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}

      Analiz:
      Ana Konu: [Buraya ana konuyu yazın]
      Benzerlik Skorları:
      ${messages.map((_, index) => `${index + 1}. [Buraya ${index + 1}. mesajın benzerlik skorunu yazın]`).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    }).then((response: any) => {
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
    );

    return response;
  }

 export async function detectTopicAndCreateMap(messages: string[]): Promise<any> {
    const prompt = `
    Kullanıcı mesajlarını analiz ederek ana konuyu belirleyin ve kullanıcının bu konu üzerinde detaylı araştırma yaptığını düşünün sorduğu sorular DIŞINDA O konu ile ilgili başka hangi soruları sorabileceğini belirleyin. Olası diğer ilgili 5 soru içeren bir konu haritası oluşturun.CEVAP OLARAK SADECE KONU HARİTASINDAKİ KULLANICI SORULARI DIŞINDA OLMALI VE EN FAZLA 5 SORU AYRICA HER BİR SORU EN FAZLA 8 KELİMEDEN OLUŞABİLİR. CEVPLARINDA ASLA '' KULLANMA VE SORULARA SIRA NUMARASI VERME.

    Örnek Kullanıcı Mesajları:
    1. selam
    2. yeni bir telefon almayı düşünüyorum. Hangi marka ve model önerirsin?
    3. Telefonun kamerası da önemli, özellikle gece çekimleri
    4. Motor almak istiyorum, 50 CC deki motor marka ve modelleri ne?

    Örnek Konu Haritası ve İlgili Sorular:
     Son çıkan telefon modelleri hangileri?
     Bütçe dostu telefonlar hangileri?
     Hangi telefon modeli fiyat performans açısından iyi?
     100 CC motorlar hakkında bilgi ver?

      ${messages.map((msg, index) => `${index + 1}. '${msg}'`).join('\n')}
    EĞER KULLANICI 20 den fazla mesaj gönderdiyse sadece son 10 mesajı kullan.

      Konu Haritası ve İlgili Sorular:
       [Ana konu ile ilgili bir soru yazın]
       [Ana konu ile ilgili bir sonraki soruyu yazın]
       [Ana konu ile ilgili bir sonraki soruyu yazın]
    `;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    }).then((response: any) => {
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
    );


    return response
  }