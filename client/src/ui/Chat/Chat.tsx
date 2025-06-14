import './chat.css'
import React, { useEffect, useRef, useState } from 'react';
import { useRecipientId } from '../../store/recipienId';
import { useRecipientName } from '../../store/recipientName';
import { useMyUserId } from '../../store/myUserId';
import { useUsername } from '../../store/authUsername';

type Message = {
  myUserId: string;
  recipientId: string;
  username: string;
  recipientName: string;
  message: string;
}

export const Chat = () => {
  const { recipientId } = useRecipientId();
  const { myUserId } = useMyUserId();
  const { recipientName } = useRecipientName();
  const { username } = useUsername();

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    socketRef.current = socket;
    socket.onopen = () =>
      socket.send(JSON.stringify({ type: 'login', myUserId, recipientId, username }));

    socket.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'isOnline') setIsOnline(msg.isOnline);

      if (msg.myUserId !== recipientId) return;
      if (msg.type === 'message') setMessages(prev => [...prev, msg]);

      if (msg.type === 'typing') setIsTyping(true);
      if (msg.type === 'stop-typing') setIsTyping(false);
    };

    return () => socket.close();
  }, [myUserId, recipientId]);

  useEffect(() => {
      fetch(`http://localhost:3000/messages?myUserId=${myUserId}&recipientId=${recipientId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
  }, [myUserId, recipientId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msg = {
      type: 'message',
      myUserId,
      recipientId,
      username,
      recipientName,
      message,
    };
    socketRef.current?.send(JSON.stringify(msg));

    setMessages(prev => [ ...prev, msg ]);
    setMessage('');
  }

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!recipientId || !socketRef.current) return;

    socketRef.current.send(JSON.stringify({ type: 'typing', myUserId, recipientId }))

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socketRef.current?.send(JSON.stringify({ type: 'stop-typing', myUserId, recipientId }))
    }, 2000)
  }

  return (
    <div className='chat'>
      <p className='status'>
        {isOnline ? '🟢' : '🔴'} {recipientName}
        {' '}
        {isTyping &&
        <div className="dots-container">
          печатает
          <span style={{ marginLeft: '4px'}}></span><span></span><span></span>
        </div>}
      </p>
      {/* {isTyping && <span>{recipientName} печатает...</span>} */}
      {/* <div style={{ border: '1px solid #ccc', height: 300, width: 500, overflowY: 'auto', padding: 10 }}> */}
      <div className='chat-messages-wrapper'>
        <div className='chat-messages'>
          {messages.map((msg, i) => (
            <p className='message-wrapper' key={i} style={{ textAlign: msg.myUserId === myUserId ? 'right' : 'left' }}>
              <span className='message'>{msg.message}</span>
              {/* {msg.message} */}
            </p>
          ))}
        </div>
      </div>
      <form
        className='chat-form'
        onSubmit={e => e.preventDefault()}>
        <input
          style={{ width: '80%' }}
          value={message}
          onChange={handleInput}
          placeholder="Введите сообщение..."
        />
        <button type="submit" onClick={sendMessage}>Отправить</button>
      </form>
    </div>
  )
}
