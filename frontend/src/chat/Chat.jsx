import React, { useState, useEffect, useRef } from "react";
import ChatBody from "../components/ChatBody";
import ChatInput from "../components/ChatInput";

const Chat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [typingIntervalId, setTypingIntervalId] = useState(null);
  const [typingIndicatorMessage, setTypingIndicatorMessage] = useState("Typing");
  const EXPRESS_PORT = 3000; // Puerto del servidor Express

  const firstRender = useRef(true);

  const displayUserMessage = (message) => {
    // Agrega el mensaje del usuario al estado de chatMessages
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { message, type: "user" },
    ]);
    setUserInput("");
  };

  const displayChatbotMessage = (message) => {
    // Detiene el indicador de escritura
    if (isChatbotTyping) {
      clearInterval(typingIntervalId);
      setIsChatbotTyping(false);
    }

    // Agrega el mensaje del chatbot al estado de chatMessages
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { message, type: "chatbot" },
    ]);
  };

  const displayTypingIndicator = () => {
    if (!isChatbotTyping) {
      setIsChatbotTyping(true);
      clearInterval(typingIntervalId);
      const intervalId = setInterval(() => {
        setTypingIndicatorMessage((prevMessage) => {
          if (prevMessage === "Typing...") return "Typing";
          else if (prevMessage === "Typing") return "Typing.";
          else if (prevMessage === "Typing.") return "Typing..";
          else if (prevMessage === "Typing..") return "Typing...";
        });
      }, 400);
      setTypingIntervalId(intervalId);
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    displayUserMessage(userInput);
    displayTypingIndicator();
  
    try {
      const response = await fetch(`http://127.0.0.1:${EXPRESS_PORT}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      const mensajeF = data.message.response
      
      // Llama a displayChatbotMessage con solo el contenido del mensaje
      displayChatbotMessage(mensajeF); 
      setIsChatbotTyping(false);
    } catch (error) {
      console.error("Error:", error);
      displayChatbotMessage(`Sorry, an error has occurred... (${error.message})`);
      setIsChatbotTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      displayChatbotMessage("Hola, ¿qué quiere saber sobre fútbol?");
    }
  }, []);

  return (
    <div className='chat-container'>
      <div className='chat-title'>GeekTech Chatbot</div>
      <ChatBody
        chatMessages={chatMessages}
        isChatbotTyping={isChatbotTyping}
        typingIndicatorMessage={typingIndicatorMessage}
      />
      <ChatInput
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='Escribe tu mensaje aquí...'
        onClick={sendMessage}
      />
    </div>
  );
};

export default Chat;
