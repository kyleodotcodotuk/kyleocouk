import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCurrentUser } from '../../data/users';
import chatService from '../../services/chatService';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = useMemo(() => getCurrentUser(), []);
  const canAccessChat = chatService.canAccessChat(currentUser);

  useEffect(() => {
    if (!canAccessChat) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    const loadMessages = async () => {
      try {
        const loadedMessages = await chatService.getMessages();
        if (active) {
          setMessages(loadedMessages);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || 'Failed to load chat messages');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    const unsubscribe = chatService.subscribeToMessages((latestMessages) => {
      if (active) {
        setMessages(latestMessages);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [canAccessChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!loading && canAccessChat) {
      inputRef.current?.focus();
    }
  }, [loading, canAccessChat]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!newMessage.trim()) {
      return;
    }

    setSending(true);
    const result = await chatService.sendMessage(newMessage, currentUser);

    if (!result.success) {
      setError(result.error || 'Failed to send message');
    } else {
      setNewMessage('');
    }

    setSending(false);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!sending && newMessage.trim()) {
        await handleSubmit(event);
      }
    }
  };

  return (
    <AdminLayout>
      <section className="cms-section cms-chat-section">
        <div className="cms-chat-top">
          <h1>Chat</h1>
        </div>

        {!canAccessChat ? (
          <div className="cms-chat-access-denied">
            <p>{chatService.getAccessErrorMessage()}</p>
          </div>
        ) : (
          <>
            {error && <div className="cms-chat-error">{error}</div>}

            <div className="cms-chat-window" role="log" aria-live="polite">
              {loading ? (
                <p className="cms-chat-empty">Loading chat...</p>
              ) : messages.length === 0 ? (
                <p className="cms-chat-empty">No messages yet. Start the conversation.</p>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderUsername === currentUser?.username;

                  return (
                    <article
                      key={message.id}
                      className={`cms-chat-message ${isOwnMessage ? 'own' : ''}`}
                    >
                      <div className="cms-chat-meta">
                        <strong>{isOwnMessage ? 'You' : (message.senderName || message.senderUsername)}</strong>
                        <span>{formatMessageTime(message.createdAt)}</span>
                      </div>
                      <div className={`cms-chat-bubble ${isOwnMessage ? 'own' : 'other'}`}>
                        <p>{message.content}</p>
                      </div>
                    </article>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="cms-chat-form" onSubmit={handleSubmit}>
              <label htmlFor="chat-message" className="sr-only">
                Type your message
              </label>
              <input
                ref={inputRef}
                id="chat-message"
                type="text"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a message..."
                maxLength={1000}
                disabled={sending}
              />
              <button type="submit" className="btn" disabled={sending || !newMessage.trim()}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        )}
      </section>
    </AdminLayout>
  );
}