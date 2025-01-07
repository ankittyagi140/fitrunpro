import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ColorTheme, ThemeName, themes, setTheme } from '../theme/colors';

interface ThemeContextType {
  theme: ColorTheme;
  themeName: ThemeName;
  changeTheme: (newTheme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  themeName: 'light',
  changeTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [theme, setCurrentTheme] = useState<ColorTheme>(themes.light);

  const changeTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    const updatedTheme = setTheme(newTheme);
    setCurrentTheme(updatedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
