// src/contexts/GroupContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('group');
    if (saved) setGroup(JSON.parse(saved));
  }, []);

  return (
    <GroupContext.Provider value={{ group, setGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);
