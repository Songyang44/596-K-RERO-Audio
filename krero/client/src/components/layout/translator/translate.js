// translate.js
import axios from 'axios';

export const translateText = async (text) => {
  try {
    const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {}, {
      params: {
        q: text,
        target: 'mi', // 设置为毛利语代码
        key: 'AIzaSyAF1cCD0POJpm15tmYWlxNhIUKblr5ihvk' // 替换为您的API密钥
      }
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error during translation', error);
    return '';
  }
};
