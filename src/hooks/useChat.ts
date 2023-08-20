import OpenAI from 'openai';

const openai = new OpenAI({
   apiKey: process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY,
   dangerouslyAllowBrowser: true
});

export const useChat =  () => {
  
  const getChatgpt = async (message:string) => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { getChatgpt }
}