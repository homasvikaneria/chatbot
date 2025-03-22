// Ai-Chatpot/chatbot/src/FloatingChatButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import './ChatBot.css'; // Keep this since styling is here

export const FloatingChatButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="floating-chat-button"
      aria-label="Chat with Coffee Assistant"
    >
      <MessageCircle className="chat-icon" />
    </motion.button>
  );
};

export default FloatingChatButton;