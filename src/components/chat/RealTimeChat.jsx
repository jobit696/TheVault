import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import supabase from '../../supabase/supabase-client';
import { useAdmin } from '../../context/AdminContext';
import styles from '../../css/RealtimeChat.module.css';

dayjs.extend(relativeTime);

export default function RealtimeChat({ data }) {
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const messageRef = useRef(null);
  const { isAdmin } = useAdmin();

  const scrollSmoothToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const getInitialMessages = useCallback(async () => {
    setLoadingInitial(true);
    setError("");
    
    const gameId = parseInt(data?.id, 10);
    
    if (isNaN(gameId)) {
      setError("Invalid game ID");
      setLoadingInitial(false);
      return;
    }
    
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles!inner(sex)
        `)
        .eq("game_id", gameId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Messages loaded:', messages?.length || 0);
      setMessages(messages || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err.message || 'Error loading messages');
    } finally {
      setLoadingInitial(false);
    }
  }, [data?.id]);

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Delete this message?')) return;

    setDeletingMessageId(messageId);
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      console.log('✅ Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('❌ Error deleting message: ' + error.message);
    } finally {
      setDeletingMessageId(null);
    }
  };

  useEffect(() => {
    if (data?.id) {
      console.log('🔍 Loading messages for game:', data.id);
      getInitialMessages();
    }
    
    const gameId = parseInt(data?.id, 10);
    const channel = supabase
      .channel(`messages-${gameId}`)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "messages",
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('📨 Real-time update:', payload);
          getInitialMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.id, getInitialMessages]);

  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]);

  return (
    <div className={styles.chatContainer} ref={messageRef}>
      {loadingInitial && (
        <div className={styles.loading}>Loading messages...</div>
      )}
      {error && (
        <div className={styles.error}>
          Error: {error}
          <button onClick={getInitialMessages} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}
      {messages.length === 0 && !loadingInitial && !error && (
        <div className={styles.emptyState}>No comments yet. Be the first!</div>
      )}
      {messages.map((message) => {
        // Classe CSS in base al sesso
        const userSex = message.profiles?.sex;
        const cardClass = userSex === 'F' 
          ? `${styles.messageCard} ${styles.female}` 
          : userSex === 'M' 
          ? `${styles.messageCard} ${styles.male}` 
          : styles.messageCard;

        return (
          <div key={message.id} className={cardClass}>
            <div className={styles.messageHeader}>
              <div className={styles.messageHeaderLeft}>
                {message.profile_id ? (
                  <Link 
                    to={`/user/${message.profile_id}`}
                    className={styles.usernameLink}
                  >
                    <span className={styles.username}>
                      {message.profile_username || 'Anonymous'}
                    </span>
                  </Link>
                ) : (
                  <span className={styles.username}>
                    {message.profile_username || 'Anonymous'}
                  </span>
                )}
                <span className={styles.timestamp}>
                  {dayjs(message.created_at).fromNow()}
                </span>
              </div>
              
              {isAdmin && (
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  disabled={deletingMessageId === message.id}
                  className={styles.deleteButton}
                  title="Delete message"
                >
                  {deletingMessageId === message.id ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-trash"></i>
                  )}
                </button>
              )}
            </div>
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        );
      })}
    </div>
  );
}