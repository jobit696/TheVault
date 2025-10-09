import { createContext, useContext, useEffect, useState } from 'react';
import SessionContext from './SessionContext';
import { useYoutubePreference } from '../hook/useYoutubePreference';

export const YoutubeChannelContext = createContext(null);

export const YoutubeChannelProvider = ({ children }) => {
  const sessionData = useContext(SessionContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let id = null;
    
    if (sessionData?.session?.user?.id) {
      id = sessionData.session.user.id;
    } else if (sessionData?.user?.id) {
      id = sessionData.user.id;
    } else if (sessionData?.id) {
      id = sessionData.id;
    }
    
    setUserId(id);
  }, [sessionData]);

  const { channelId, loading, updateChannelId } = useYoutubePreference(userId);

  return (
    <YoutubeChannelContext.Provider value={{ channelId, loading, updateChannelId }}>
      {children}
    </YoutubeChannelContext.Provider>
  );
};

export const useYoutubeChannel = () => {
  const context = useContext(YoutubeChannelContext);
  if (!context) {
    throw new Error('useYoutubeChannel must be used within YoutubeChannelProvider');
  }
  return context;
};