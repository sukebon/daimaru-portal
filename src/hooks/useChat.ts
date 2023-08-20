import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY,
  dangerouslyAllowBrowser: true
});

export const useChat = () => {

  const getChatgpt = async (message: string, conversation: any) => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [...conversation, { role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  //   const getChatgpt2 = async () => {
  //     const API_URL = 'https://api.openai.com/v1/';
  // const MODEL = 'gpt-3.5-turbo';
  //     const API_KEY = process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY
  //     const response = await axios.post( `${ API_URL }chat/completions`, {
  //       model: MODEL,
  //       messages: [
  //           ...coversation,
  //         {
  //           'role': 'user',
  //           'content': message,
  //         }
  //       ],
  //     }, {
  //       // HTTPヘッダー(認証)
  //       headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${ API_KEY }`
  //       }
  //     });
  // }

  return { getChatgpt };
};