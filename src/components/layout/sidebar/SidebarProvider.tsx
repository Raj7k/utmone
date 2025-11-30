import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SidebarState = 'collapsed' | 'expanded' | 'searching';

interface SidebarContextValue {
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    const stored = localStorage.getItem('sidebar_state');
    return (stored as SidebarState) || 'expanded';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_state', sidebarState);
  }, [sidebarState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && sidebarState !== 'searching') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && sidebarState === 'searching') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarState]);

  const toggleSidebar = () => {
    setSidebarState(prev => prev === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const openSearch = () => {
    setSidebarState('searching');
  };

  const closeSearch = () => {
    setSidebarState('expanded');
  };

  return (
    <SidebarContext.Provider value={{ sidebarState, setSidebarState, toggleSidebar, openSearch, closeSearch }}>
      {children}
    </SidebarContext.Provider>
  );
};
