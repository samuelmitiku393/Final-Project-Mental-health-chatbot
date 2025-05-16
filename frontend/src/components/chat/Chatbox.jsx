import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const ChatContainer = styled.div`
  background-color: #2f3645;
  color: #e2dad6;
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  margin: 20px auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 90vh;
  overflow: hidden;

  @media (min-width: 1024px) {
    width: 80%;
  }

  @media (min-width: 1440px) {
    width: 60%;
  }
`;

const ChatHeader = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #e2dad6;
  border-bottom: 2px solid #758694;
  padding-bottom: 10px;
  margin-bottom: 20px;
  text-align: center;
  flex-shrink: 0;
`;

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100px;
`;

// User message style (right side)
const UserMessage = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px 16px 0 16px;
  background-color: #4a6fa5;
  color: #fff;
  align-self: flex-end;
  transition: all 0.3s;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: -8px;
    bottom: 0;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-left-color: #4a6fa5;
    border-right: 0;
    border-bottom: 0;
    margin-bottom: 0px;
  }
`;

// Bot message style (left side)
const BotMessage = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px 16px 16px 0;
  background-color: #5a768a;
  color: #fff;
  align-self: flex-start;
  transition: all 0.3s;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -8px;
    bottom: 0;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-right-color: #5a768a;
    border-left: 0;
    border-bottom: 0;
    margin-bottom: 0px;
  }
`;

const InputArea = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 30px;
    border: none;
    outline: none;
    font-size: 16px;
    background-color: #e2dad6;
    color: #2f3645;
    transition: box-shadow 0.2s;

    &:focus {
      box-shadow: 0 0 0 2px #758694;
    }

    &:disabled {
      background-color: #c5c0bd;
    }
  }

  button {
    background-color: #758694;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #5e6b79;
    }

    &:disabled {
      background-color: #a7a7a7;
      cursor: not-allowed;
    }
  }
`;

const QuickRepliesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  justify-content: flex-end;
`;

const QuickReply = styled.button`
  background-color: #4a6fa5;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #3a5a8a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ConnectionStatus = styled.div`
  text-align: center;
  font-size: 14px;
  color: #e2dad6;
  animation: ${blink} 1.5s infinite;
`;

const Disclaimer = styled.div`
  font-size: 12px;
  color: #a7a7a7;
  text-align: center;
  margin-top: 16px;
  flex-shrink: 0;
`;

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messageEndRef = useRef(null);

  const defaultPrompts = useMemo(
    () => [
      "I'm feeling anxious. What should I do?",
      "How can I calm down during a panic attack?",
      "What are some ways to manage stress?",
      "Can you help me sleep better?",
      "What is mindfulness?",
      "How do I practice deep breathing?",
      "I feel overwhelmed. Can you help?",
      "Tell me something positive.",
      "How do I deal with negative thoughts?",
      "Can you explain depression?",
      "What are the signs of burnout?",
      "Give me a self-care tip.",
      "How do I stop overthinking?",
      "What are grounding techniques?",
      "I need motivation today.",
      "How do I set healthy boundaries?",
      "How can I boost my mood?",
      "What are symptoms of anxiety?",
      "How can I manage social anxiety?",
      "Help me feel more confident.",
      "What is emotional intelligence?",
      "How can I feel less lonely?",
      "Suggest a quick relaxation exercise.",
      "What are signs of a mental breakdown?",
      "Can you help me with self-esteem?",
      "How do I manage anger in a healthy way?",
      "Tell me a calming affirmation.",
      "What are common mental health myths?",
      "How do I support a friend with depression?",
      "What does a healthy routine look like?",
      "Give me a 5-minute meditation guide.",
      "How do I identify toxic relationships?",
      "What are some healthy coping mechanisms?",
      "How do I get through a bad day?",
      "Can journaling improve my mental health?",
      "How does diet affect my mood?",
      "What is cognitive behavioral therapy (CBT)?",
      "I feel stuck in life. What now?",
      "Tell me something encouraging.",
      "Why do I feel tired all the time?",
      "How do I develop resilience?",
      "Is it okay to feel sad without a reason?",
      "What does emotional burnout feel like?",
      "How do I balance work and life?",
      "Can exercise help mental health?",
      "What is imposter syndrome?",
      "How do I handle rejection?",
      "Can I talk to you when I feel lonely?",
      "Give me a small goal for today.",
      "What are the stages of grief?",
      "How do I know if I need professional help?",
    ],
    []
  );

  const generateQuickReplies = useCallback(() => {
    const shuffled = [...defaultPrompts].sort(() => 0.5 - Math.random());
    setQuickReplies(shuffled.slice(0, 3));
  }, [defaultPrompts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus("connected");
      setMessages([
        { text: "Hello! How can I assist you today?", sender: "bot" },
      ]);
      generateQuickReplies();
    }, 1000);
    return () => clearTimeout(timer);
  }, [generateQuickReplies]);

  const sendMessage = async (msg) => {
    const userMessage = msg || input.trim();
    if (!userMessage || isBotResponding) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setShowQuickReplies(false);
    setIsBotResponding(true);

    try {
      const response = await axios.post("http://localhost:8000/api/chat", {
        text: userMessage,
      });
      const botReply =
        response.data.message || "Sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Server error. Please try again later.", sender: "bot" },
      ]);
    } finally {
      setIsBotResponding(false);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatContainer>
      <ChatHeader>Ask Our Assistant</ChatHeader>
      {connectionStatus !== "connected" ? (
        <ConnectionStatus>Connecting to AI assistant...</ConnectionStatus>
      ) : (
        <>
          <ChatContent>
            <MessageContainer>
              {messages.map((msg, i) =>
                msg.sender === "user" ? (
                  <UserMessage key={i}>{msg.text}</UserMessage>
                ) : (
                  <BotMessage key={i}>{msg.text}</BotMessage>
                )
              )}
              <div ref={messageEndRef} />
            </MessageContainer>
          </ChatContent>

          <InputArea>
            {showQuickReplies && (
              <QuickRepliesContainer>
                {quickReplies.map((reply, index) => (
                  <QuickReply
                    key={index}
                    onClick={() => sendMessage(reply)}
                    disabled={isBotResponding}
                  >
                    {reply}
                  </QuickReply>
                ))}
              </QuickRepliesContainer>
            )}

            <InputContainer>
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isBotResponding && sendMessage()
                }
                disabled={connectionStatus !== "connected" || isBotResponding}
              />
              <button
                onClick={() => sendMessage()}
                disabled={
                  !input.trim() ||
                  connectionStatus !== "connected" ||
                  isBotResponding
                }
              >
                {isBotResponding ? "..." : "Send"}
              </button>
            </InputContainer>
            <Disclaimer>
              ⚠ AI responses may be inaccurate or misleading. Use your own
              judgment.
            </Disclaimer>
          </InputArea>
        </>
      )}
    </ChatContainer>
  );
}

export default Chatbox;
