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
        max_tokens : 2000,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      alert(`制限に到達した可能性があります。\n内容をリセットして5分以上時間を置いてからお試しください。
      \n\n ${error}`);
      return null;
    }
  };

  return { getChatgpt };
};