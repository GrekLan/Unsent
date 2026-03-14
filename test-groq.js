// Simple test script to verify Groq API
require('dotenv').config({ path: '.env.local' });

const Groq = require('groq-sdk');

async function testGroq() {
  console.log('Testing Groq API...');
  console.log('API Key exists:', !!process.env.GROQ_API_KEY);
  console.log('API Key preview:', process.env.GROQ_API_KEY?.substring(0, 10) + '...');
  
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    console.log('\nTrying model: llama-3.3-70b-versatile');
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say hello in 5 words or less" }],
      max_tokens: 50,
    });
    
    console.log('SUCCESS! Response:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('ERROR:', error.message);
    
    // Try alternative models
    console.log('\n--- Trying alternative models ---');
    const models = ['llama3-70b-8192', 'mixtral-8x7b-32768', 'llama-3.2-90b-text-preview'];
    
    for (const model of models) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        console.log(`\nTrying model: ${model}`);
        const completion = await groq.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: "Say hello" }],
          max_tokens: 20,
        });
        console.log(`SUCCESS with ${model}:`, completion.choices[0]?.message?.content);
      } catch (e) {
        console.log(`FAILED with ${model}:`, e.message?.substring(0, 100));
      }
    }
  }
}

testGroq();
