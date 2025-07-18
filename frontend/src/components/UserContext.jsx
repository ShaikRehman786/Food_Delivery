import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState('');

  // Load username from localStorage on initial mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Function to set username after login or OTP verification
  const login = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
  };

  // Optional: Function to clear username on logout
  const logout = () => {
    setUsername('');
    localStorage.removeItem('username');
  };

  return (
    <UserContext.Provider value={{ username, setUsername, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
