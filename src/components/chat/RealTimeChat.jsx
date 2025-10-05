import { useEffect, useState, useRef, useCallback } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import supabase from '../../supabase/supabase-client';
import styles from '../../css/RealtimeChat.module.css';

dayjs.extend(relativeTime);

export default function RealtimeChat({ data }) {
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  const scrollSmoothToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const getInitialMessages = useCallback(async () => {
    setLoadingInitial(true);
    
    // 🔧 SOLUZIONE: Converti l'ID in numero intero
    const gameId = parseInt(data?.id, 10);
    
    // Verifica che sia un numero valido
    if (isNaN(gameId)) {
      setError("Invalid game ID");
      setLoadingInitial(false);
      return;
    }
    
    const { data: messages, error } = await supabase
      .from("messages")
      .select()
      .eq("game_id", gameId)  // ✅ Ora passa un numero
      .order('created_at', { ascending: true });
    
    if (error) {
      setError(error.message);
      setLoadingInitial(false);
      return;
    }
    setLoadingInitial(false);
    setMessages(messages);
  }, [data?.id]);

  useEffect(() => {
    if (data) {
      getInitialMessages();
    }
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "messages",
          filter: `game_id=eq.${parseInt(data?.id, 10)}`  // 🔧 Filtro specifico per questo game
        },
        () => getInitialMessages()
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [data, getInitialMessages]);

  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]);

  return (
    <div className={styles.chatContainer} ref={messageRef}>
      {loadingInitial && (
        <div className={styles.loading}>Loading messages...</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
      {messages.length === 0 && !loadingInitial && (
        <div className={styles.emptyState}>No messages yet. Be the first to chat!</div>
      )}
      {messages.map((message) => (
        <div key={message.id} className={styles.messageCard}>
          <div className={styles.messageHeader}>
            <span className={styles.username}>{message.profile_username}</span>
            <span className={styles.timestamp}>
              {dayjs(message.created_at).fromNow()}
            </span>
          </div>
          <div className={styles.messageContent}>{message.content}</div>
        </div>
      ))}
    </div>
  );
}