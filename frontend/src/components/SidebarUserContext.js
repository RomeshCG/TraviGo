import { createContext, useContext } from 'react';

export const SidebarUserContext = createContext({ collapsed: false });
export const useSidebarUser = () => useContext(SidebarUserContext);
