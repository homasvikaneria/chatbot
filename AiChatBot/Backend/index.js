// Ai-Chatpot/Backend/index.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5174"], // Update with your frontend's deployed link
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

const uri = "xyz"; // MongoDB URI
const client = new MongoClient(uri);
const dbName = "just_home"; // Database name

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    const chatbotCollection = db.collection("chatbot");

    app.post('/chatbot/query', async (req, res) => {
      try {
        const { question } = req.body;
        if (!question) {
          return res.status(400).json({ error: "Question is required" });
        }

        const prompt = `You are an AI assistant for an e-commerce platform specializing in organic products. Your role is to assist consumers with product-related queries, explain organic farming practices, provide information about IoT-based verification, and help consumers make informed purchasing decisions. 

**Rules:**
1. If the question is unrelated to organic farming, IoT-based verification, or purchasing organic products, respond ONLY with: "I'm sorry, I can only assist with questions related to organic farming, IoT-based verification, and purchasing organic products."
2. Do not provide any additional information or engage in off-topic conversations.
3. Do not suggest or offer anything outside the domain (e.g., drinks, unrelated facts).

Answer this question: ${question}`;
        const result = await model.generateContent(prompt);
        const botResponse = result.response.text() || "Sorry, I couldn't generate a response.";

        // Store the chat
        const chatEntry = {
          question,
          response: botResponse,
          timestamp: new Date(),
        };
        await chatbotCollection.insertOne(chatEntry);

        res.status(200).json({ response: botResponse });
      } catch (error) {
        console.error('Error in chatbot query:', error);
        res.status(500).json({ error: "Failed to process query" });
      }
    });

    app.get('/chatbot/history', async (req, res) => {
      try {
        const history = await chatbotCollection.find().sort({ timestamp: 1 }).toArray();
        res.status(200).json(history);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: "Failed to fetch chat history" });
      }
    });

    app.delete('/chatbot/history', async (req, res) => {
      try {
        const result = await chatbotCollection.deleteMany({});
        res.status(200).json({ message: `Deleted ${result.deletedCount} chat entries` });
      } catch (error) {
        console.error('Error deleting chat history:', error);
        res.status(500).json({ error: "Failed to delete chat history" });
      }
    });

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();

process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
