import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function validateTaxRules() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a Canadian tax expert. Verify and update tax calculations if needed."
        },
        {
          role: "user",
          content: "Please verify the current tax brackets and rates for all provinces."
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error validating tax rules:', error);
    return null;
  }
}