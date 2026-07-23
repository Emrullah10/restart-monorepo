import { GoogleGenerativeAI } from '@google/generative-ai';

export const makeCalculateImpact = ({ geminiApiKey }) => {
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  return async ({ productModel, condition }) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Cihaz: ${productModel}, Durum: ${condition}.
    Bu cihazın geri dönüştürülmesiyle kurtarılan tahmini karbon miktarını (kg cinsinden sadece sayı)
    ve kullanıcı için 1 cümlelik, doğa temalı, çok motive edici bir mesaj üret.
    Yanıtı SADECE geçerli bir JSON formatında ver. Başka hiçbir metin ekleme.
    Format: {"carbon": 12.5, "message": "Harikasın! ..."}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('AI Use Case Error:', error);
      return { carbon: 0, message: 'Doğa için yaptığın katkı paha biçilemez!' };
    }
  };
};
