import { useContext, useState, useEffect } from "react";
import supabase from "../../supabase/supabase-client";
import SessionContext from "../../context/SessionContext";
import styles from '../../css/FavoriteButton.module.css';

export default function ToggleFavorite({ data, className = "" }) {
  const { session } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      loadFavorites();
    }
  }, [session]);

  const loadFavorites = async () => {
    if (!session?.user?.id) return;
    
    const { data: favData, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error loading favorites:", error);
    } else if (favData) {
      setFavorites(favData);
    }
  };

  const isFavorite = () => favorites.find((el) => el.game_id === data.id);

  const addFavorites = async (game) => {
    setLoading(true);
    
    const genresString = game.genres 
      ? game.genres.map(g => g.name).join(', ') 
      : '';

    const { data: insertedData, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: session?.user.id,
          game_id: game.id,
          game_name: game.name,
          game_slug: game.slug, 
          game_image: game.background_image,
          genres: genresString, 
        },
      ])
      .select();

    if (error) {
      alert(error.message);
    } else {
      setFavorites([...favorites, ...insertedData]);
    }
    setLoading(false);
  };

  const removeFavorite = async (game) => {
    setLoading(true);
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("game_id", game.id)
      .eq("user_id", session?.user.id);

    if (error) {
      alert(error.message);
    } else {
      setFavorites(favorites.filter((fav) => fav.game_id !== game.id));
    }
    setLoading(false);
  };

  const toggleFavorite = () => {
    if (!session) {
      alert("Please login to add favorites");
      return;
    }

    if (isFavorite()) {
      removeFavorite(data);
    } else {
      addFavorites(data);
    }
  };

  return (
    <button 
      className={`${styles.favoriteButton} ${isFavorite() ? styles.favoriteActive : ''} ${className}`}
      onClick={toggleFavorite} 
      disabled={loading}
      title={isFavorite() ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <i className="fa-solid fa-spinner fa-spin"></i>
      ) : isFavorite() ? (
        <i className="fa-solid fa-heart"></i>
      ) : (
        <i className="fa-regular fa-heart"></i>
      )}
    </button>
  );
}