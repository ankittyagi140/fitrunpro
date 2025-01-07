export interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  white: string;
  black: string;
  gray: string;
  success: string;
  danger: string;
  warning: string;
  text: {
    primary: string;
    secondary: string;
  };
}

export const lightTheme: ColorTheme = {
  primary: '#3498db',     // Bright blue
  secondary: '#2ecc71',   // Bright green
  background: '#f4f6f7',  // Light gray-blue
  white: '#ffffff',
  black: '#2c3e50',
  gray: '#7f8c8d',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  text: {
    primary: '#2c3e50',
    secondary: '#34495e'
  }
};

export const darkTheme: ColorTheme = {
  primary: '#2980b9',     // Deep blue
  secondary: '#27ae60',   // Forest green
  background: '#2c3e50',  // Dark blue-gray
  white: '#ecf0f1',
  black: '#141a23',
  gray: '#95a5a6',
  success: '#2ecc71',
  danger: '#c0392b',
  warning: '#d35400',
  text: {
    primary: '#ecf0f1',
    secondary: '#bdc3c7'
  }
};

export const energeticTheme: ColorTheme = {
  primary: '#e74c3c',     // Vibrant red
  secondary: '#f1c40f',   // Bright yellow
  background: '#34495e',  // Dark slate gray
  white: '#ecf0f1',
  black: '#2c3e50',
  gray: '#95a5a6',
  success: '#2ecc71',
  danger: '#c0392b',
  warning: '#d35400',
  text: {
    primary: '#ecf0f1',
    secondary: '#bdc3c7'
  }
};

export const pastelTheme: ColorTheme = {
  primary: '#6a89cc',     // Soft blue
  secondary: '#82e0aa',   // Mint green
  background: '#f5f5f5',  // Very light gray
  white: '#ffffff',
  black: '#2c3e50',
  gray: '#95a5a6',
  success: '#7dcea0',
  danger: '#ec7063',
  warning: '#f4d03f',
  text: {
    primary: '#2c3e50',
    secondary: '#34495e'
  }
};

// Theme management
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  energetic: energeticTheme,
  pastel: pastelTheme
};

export type ThemeName = keyof typeof themes;

export let currentTheme: ColorTheme = lightTheme;

export function setTheme(themeName: ThemeName) {
  currentTheme = themes[themeName];
  return currentTheme;
}

export function getCurrentTheme(): ColorTheme {
  return currentTheme;
}
