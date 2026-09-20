import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "Farmer Katta",
    status: "Backend Online"
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "Question required"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    `तुम्ही Farmer Katta मधील AI कृषी सहाय्यक आहात.
शेतकऱ्याला सोप्या मराठीत प्राथमिक माहिती द्या.

शेतकऱ्याचा प्रश्न:
${question}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error"
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "उत्तर मिळाले नाही.";

    res.json({ answer });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI server error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Farmer Katta backend running on port ${PORT}`);
});
