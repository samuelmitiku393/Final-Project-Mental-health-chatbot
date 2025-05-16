import React from "react";
import styled from "styled-components";

const MessageBubble = styled.div`
  max-width: 75%;
  margin-bottom: 12px;
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 1rem;
  line-height: 1.5;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.sender === "user"
      ? `
    background: #667eea;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  `
      : `
    background: white;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 4px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  `}
`;

const MessageMeta = styled.div`
  font-size: 0.8rem;
  margin-top: 6px;
  color: ${(props) =>
    props.sender === "user" ? "rgba(255, 255, 255, 0.7)" : "#666"};
  text-align: ${(props) => (props.sender === "user" ? "right" : "left")};
`;

function Message({ text, sender, timestamp }) {
  return (
    <MessageBubble sender={sender}>
      <p>{text}</p>
      <MessageMeta sender={sender}>{timestamp}</MessageMeta>
    </MessageBubble>
  );
}

export default Message;
