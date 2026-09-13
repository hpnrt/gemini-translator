const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/translate', async (req, res) => {
  try {
    const { q, target } = req.body;
    
    if (!q) {
      return res.status(400).json({ error: 'Missing text' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Translate to ${target} language. Only provide translation:\n\n${q}`
          }]
        }],
        generationConfig: { temperature: 0.3 }
      }
    );

    const translatedText = response.data.candidates[0].content.parts[0].text;

    res.json({
      data: {
        translations: [{ translatedText }]
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Gemini Translator Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
