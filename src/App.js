// src/App.js
import React, { useState } from 'react';
import AISelection from './components/AISelection';
import ChatInterface from './components/ChatInterface';

function App() {
  const [selectedAI, setSelectedAI] = useState(null);

  const handleSelectAI = (aiId) => {
    setSelectedAI(aiId);
  };

  const handleBackToSelection = () => {
    setSelectedAI(null);
  };

  return (
      <>
        {!selectedAI ? (
            <AISelection onSelectAI={handleSelectAI} />
        ) : (
            <ChatInterface
                selectedModel={selectedAI}
                onBack={handleBackToSelection}
            />
        )}
      </>
  );
}

export default App;