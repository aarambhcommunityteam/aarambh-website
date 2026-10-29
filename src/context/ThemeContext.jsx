
import React, { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
    document.body.style.backgroundColor = "#080d1a";
    document.body.style.color = "#F9FAFB";
  }, []);

  const value = {
    theme: "dark",
    toggleTheme: () => {},
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
