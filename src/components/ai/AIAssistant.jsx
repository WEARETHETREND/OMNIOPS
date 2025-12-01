import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatPanel from './ChatPanel';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatPanel isOpen={isOpen} />
      <ChatButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />
    </>
  );
}