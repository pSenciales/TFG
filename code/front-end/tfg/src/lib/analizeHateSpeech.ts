import OpenAI from "openai";
import ChatCompletionMessage from "openai";

interface MyChatCompletionMessage extends ChatCompletionMessage {
  reasoning_content: string;
  content: string;
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export default async function analizeHateSpeech(content_input: string, context: string, language: string) {
  try {
    console.log("\n\nENTRAMOS EN EL HANDLEANALIZEHATE\n\n");
    const userContent = context
      ? `Analyze this text: ${content_input}. Some context: ${context}`
      : `Analyze this text: ${content_input}.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI hate speech analyzer, return just 'hate speech' or 'not hate speech' based on the text"
        },
        {
          role: "user",
          content: userContent
        }
      ],
      model: "deepseek-reasoner"
    });
    const message = completion.choices[0].message as unknown as MyChatCompletionMessage;
    const content = message?.content; 
    const reasoning = message?.reasoning_content;
    

    return { content: content, reasoning: reasoning};

  } catch (error) {
    console.error("Error en analizeHateSpeech:", error);

    return {
      reasoning: "",
      content: "",
      error: error || "Error desconocido"
    };
  }
}
