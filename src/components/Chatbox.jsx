import { useContext } from "react";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";
import RealtimeChat from "./RealTimeChat";
import styles from "../css/Chatbox.module.css";

export default function Chatbox({ data }) {
  const { session } = useContext(SessionContext);

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const inputMessage = event.currentTarget;
    const { message } = Object.fromEntries(new FormData(inputMessage));
    
    if (typeof message === "string" && message.trim().length !== 0) {
      const gameId = parseInt(data?.id, 10);
      
      if (isNaN(gameId)) {
        console.error("Invalid game ID:", data?.id);
        return;
      }
      
 const { error } = await supabase
  .from("messages")
  .insert([
    {
      profile_id: session?.user.id,
      profile_username: session?.user.user_metadata.username,
      game_id: gameId,
      game_name: data?.name,
      game_slug: data?.slug, 
      content: message,
    },
  ])
  .select();
      
      if (error) {
        console.log(error);
      } else {
        inputMessage.reset();
      }
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <h4 className={styles.chatTitle}>Gamers chat</h4>
      <RealtimeChat data={data} />
      <form onSubmit={handleMessageSubmit} className={styles.chatForm}>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            name="message" 
            placeholder="Chat..." 
            className={styles.chatInput}
          />
          <button type="submit" className={styles.sendButton}>
            Invia
          </button>
        </div>
      </form>
    </div>
  );
}