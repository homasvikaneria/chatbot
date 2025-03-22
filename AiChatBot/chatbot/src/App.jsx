// Ai-Chatpot/chatbot/src/App.jsx
import React, { useState } from 'react';
import ChatModal from './ChatModal';
import FloatingChatButton from './FloatingChatButton';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatButtonClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="app">
      <FloatingChatButton onClick={handleChatButtonClick} />
      <ChatModal isOpen={isChatOpen} onClose={handleCloseChat} />
    </div>
  );
}

export default App;