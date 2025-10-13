import { createContext, useContext } from "react"; // ← AGGIUNTO useContext

const SessionContext = createContext(null);

// ← AGGIUNTO: Hook custom
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export default SessionContext;