import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useSpeechToText } from "../../utils/speechToText";
import { speak } from "../../utils/textToSpeech";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  animation: ${fadeIn} 0.3s ease-out;

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
  animation: ${fadeIn} 0.3s ease-out;

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
    transition: all 0.2s;

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
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background-color: #5e6b79;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background-color: #a7a7a7;
      cursor: not-allowed;
      transform: none;
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

const MicButton = styled.button`
  background-color: ${(props) => (props.listening ? "#ff4d4d" : "#758694")};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.listening ? "#ff3333" : "#5e6b79")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #a7a7a7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
`;

const MessageActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  color: #e2dad6;
  border: none;
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

const ToastNotification = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in,
    ${fadeIn} 0.3s ease-out 1.7s reverse forwards;
`;

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const messageEndRef = useRef(null);

  // Speech to text hook
  const { transcript, listening, start, stop } = useSpeechToText();

  const defaultPrompts = useMemo(
    () => [
      "I'm feeling anxious right now",
      "I'm having a panic attack",
      "I feel really depressed today",
      "I'm overwhelmed with stress",
      "I can't stop worrying",
      "I feel lonely and isolated",
      "I'm struggling with my emotions",
      "I feel like I'm losing control",
      "I'm having trouble sleeping",
      "I'm having trouble coping with stress",
      "I feel hopeless about everything",
      "My mind won't stop racing",
      "I'm feeling extremely sad",
    ],
    []
  );

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const generateQuickReplies = useCallback(() => {
    const shuffled = [...defaultPrompts].sort(() => 0.5 - Math.random());
    setQuickReplies(shuffled.slice(0, 3));
  }, [defaultPrompts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus("connected");
      const welcomeMessage = "Hello! How are you feeling today?";
      setMessages([{ text: welcomeMessage, sender: "bot" }]);
      generateQuickReplies();
    }, 1000);
    return () => clearTimeout(timer);
  }, [generateQuickReplies]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage("Copied to clipboard!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    });
  };

  const sendMessage = async (msg) => {
    const userMessage = msg || input.trim();
    if (!userMessage || isBotResponding) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setShowQuickReplies(false);
    setIsBotResponding(true);
    stop(); // Stop speech recognition if active

    try {
      const response = await axios.post("http://localhost:8000/api/chat", {
        text: userMessage,
      });
      const botReply =
        response.data.message || "Sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      const errorMessage = "Server error. Please try again later.";
      setMessages((prev) => [...prev, { text: errorMessage, sender: "bot" }]);
    } finally {
      setIsBotResponding(false);
      generateQuickReplies();
    }
  };

  const toggleSpeechRecognition = () => {
    if (listening) {
      stop();
      if (transcript) {
        sendMessage(transcript);
      }
    } else {
      start();
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
                  <div key={i}>
                    <BotMessage>{msg.text}</BotMessage>
                    <MessageActions>
                      <ActionButton onClick={() => speak(msg.text)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                        Speak
                      </ActionButton>
                      <ActionButton onClick={() => copyToClipboard(msg.text)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                      </ActionButton>
                    </MessageActions>
                  </div>
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
                placeholder={
                  listening ? "Listening..." : "Type your message..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isBotResponding && sendMessage()
                }
                disabled={
                  connectionStatus !== "connected" ||
                  isBotResponding ||
                  listening
                }
              />
              <MicButton
                onClick={toggleSpeechRecognition}
                disabled={isBotResponding || connectionStatus !== "connected"}
                listening={listening}
                aria-label={listening ? "Stop listening" : "Start voice input"}
              >
                {listening ? (
                  <img
                    src="/assets/mic.svg"
                    alt="Stop listening"
                    width="20"
                    height="20"
                  />
                ) : (
                  <img
                    src="/assets/mic.svg"
                    alt="Start voice input"
                    width="20"
                    height="20"
                  />
                )}
              </MicButton>
              <button
                onClick={() => sendMessage()}
                disabled={
                  !input.trim() ||
                  connectionStatus !== "connected" ||
                  isBotResponding
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Send
              </button>
            </InputContainer>
            <Disclaimer>
              ⚠ AI responses may be inaccurate or misleading. Use your own
              judgment.
            </Disclaimer>
          </InputArea>
          {toastVisible && (
            <ToastNotification>{toastMessage}</ToastNotification>
          )}
        </>
      )}
    </ChatContainer>
  );
}

export default Chatbox;
