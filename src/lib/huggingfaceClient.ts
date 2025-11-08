const HF_API_URL = 'https://api-inference.huggingface.co/models/CodeferSystem/GPT2-Hacker-password-generator';
const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;

export const generateAIPassword = async (): Promise<string> => {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: "Question: generate password.\nAnswer:",
        parameters: {
          max_length: 50,
          temperature: 2.0,
          top_k: 50,
          top_p: 0.95,
          do_sample: true,
          no_repeat_ngram_size: 2,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result && result[0] && result[0].generated_text) {
      // Extract password from generated text
      const generatedText = result[0].generated_text;
      const password = generatedText.split('Answer:')[1]?.trim() || generatedText.trim();
      
      // Clean up the password (remove extra text, keep only the password part)
      const cleanPassword = password.split(/\s+/)[0] || password;
      
      return cleanPassword.length > 8 ? cleanPassword : generateFallbackPassword();
    }
    
    return generateFallbackPassword();
  } catch (error) {
    console.error('Error generating AI password:', error);
    return generateFallbackPassword();
  }
};

// Fallback password generator if AI fails
const generateFallbackPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};