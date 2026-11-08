import { colors } from "@/constants/Colors";
import { createContext, ReactNode, useContext, useState } from "react";


type ThemeColors = typeof colors.light;

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider component to wrap your app
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const themeColors = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook with type checking
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
