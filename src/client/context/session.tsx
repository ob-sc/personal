import { Context, createContext, useContext, useState } from 'react';
import { CProps } from '../../../types';

// Context um 403 einzuordnen (session expired oder noch keine vorhanden)
// sagt einfach nur mit boolean ob eine session existieren müsste

interface SessionContext {
  session: boolean;
  updateSession: (state: boolean) => void;
}

const initContext: SessionContext = {
  session: false,
  updateSession: () => undefined,
};

const context: Context<SessionContext> = createContext(initContext);
export const useSessionContext = () => useContext(context);

export const SessionContextProvider = ({ children }: CProps) => {
  const [session, setSession] = useState(false);
  const updateSession = (state: boolean) => {
    setSession(state);
  };

  const ctxt: SessionContext = { session, updateSession };

  return <context.Provider value={ctxt}>{children}</context.Provider>;
};
