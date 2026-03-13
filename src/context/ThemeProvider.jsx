import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cheeseball_theme") || "dark";
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("cheeseball_theme", theme);
  }, [theme]);

  // Sync with Supabase for logged-in users
  useEffect(() => {
    const syncTheme = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from("user_preferences")
          .select("theme")
          .eq("user_id", session.user.id)
          .single();

        if (data?.theme) {
          setTheme(data.theme);
        }
      } catch (err) {
        // Table may not exist yet — silently use localStorage fallback
      }
    };
    syncTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("user_preferences").upsert({
          user_id: session.user.id,
          theme: newTheme,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    } catch (err) {
      console.error("Failed to save theme preference:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
