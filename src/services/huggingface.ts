const API_URL = 'https://api-inference.huggingface.co/models/';
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

export async function queryModel(model: string, inputs: string) {
  try {
    const response = await fetch(API_URL + model, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при запросе к модели');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка при работе с Hugging Face API:', error);
    throw error;
  }
} 