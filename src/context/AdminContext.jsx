/* @refresh reset */
import { createContext, useState, useContext, useEffect } from 'react';
import { useIsAdmin } from '../hook/useIsAdmin';
import { getSiteSettings } from '../services/siteSettingsService';

const AdminContext = createContext();

const ADMIN_OPTIONS_KEY = 'show_admin_options';

export function AdminProvider({ children }) {
  const { isAdmin, loading } = useIsAdmin();
  
  const [showAdminOptions, setShowAdminOptionsState] = useState(() => {
    const saved = localStorage.getItem(ADMIN_OPTIONS_KEY);
    return saved === 'true';
  });

  // Stato per disabilitare video
  const [disableRelatedVideos, setDisableRelatedVideos] = useState(false);

  const setShowAdminOptions = (value) => {
    setShowAdminOptionsState(value);
    
    if (value) {
      localStorage.setItem(ADMIN_OPTIONS_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_OPTIONS_KEY);
    }
  };

  const effectiveShowAdminOptions = isAdmin && showAdminOptions;

  // Carica impostazioni globali
  useEffect(() => {
    async function loadSettings() {
      const settings = await getSiteSettings();
      setDisableRelatedVideos(settings.disable_related_videos);
    }
    loadSettings();
  }, []);

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      loading, 
      showAdminOptions: effectiveShowAdminOptions,
      setShowAdminOptions,
      disableRelatedVideos, 
      setDisableRelatedVideos 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve essere usato dentro AdminProvider');
  }
  return context;
}