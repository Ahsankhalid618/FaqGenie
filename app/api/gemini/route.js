// app/api/gemini/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req) {
  if (req.method === "POST") {
    try {
      const { prompt } = await req.json(); // Extract prompt from the request body

      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: {
          parts: [
            {
              text: `You are a helpful and informative assistant. Your primary task is to provide concise, informative, and well-structured responses to user prompts in plain text. 

When responding to a prompt, please follow these guidelines:

1. Generate 4 FAQs: Create 4 relevant frequently asked questions (FAQs) that address the core aspects of the prompt and their answers in brief.

2. Format as a numbered list: Present the FAQs in a clear and easy-to-read numbered list format with a line break between each FAQ.

3. Maintain clarity and conciseness: Ensure that the FAQs are easy to understand and avoid unnecessary complexity and must be plain text with proper formatting and no ## or **, just plain text.

4. Provide accurate and helpful information: The answers should be informative, correct, and address the user's needs effectively.
`,
            },
          ],
          role: "model",
        },
      });

      const parts = [{ text: prompt }];

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });

      if (
        result.response.promptFeedback &&
        result.response.promptFeedback.blockReason
      ) {
        return new Response(
          JSON.stringify({
            error: `Blocked for ${result.response.promptFeedback.blockReason}`,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      let answer = result.response.candidates[0].content.parts[0].text.trim();

      // Remove any extra text if present
      // answer = answer
      //   .replace(/\[{.*}\]/g, "") // Remove extra JSON formatting
      //   .replace(/^\s*[\[\{]/, "") // Remove starting brackets
      //   .replace(/[\]\}]$/, "") // Remove ending brackets
      //   .replace(/\d+\.\s+/, "");
      return new Response(JSON.stringify({ text_content: answer }), {
        status: 200,
        headers: { "Content-Type": "application/plain" },
      });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Failed to get a response from Gemini" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}
