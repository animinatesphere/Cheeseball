import React, { useEffect, useState } from "react";
import Routee from "./Routee";
import { supabase } from "./lib/supabaseClient";
import { ThemeProvider } from "./context/ThemeProvider";

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <Routee />
    </ThemeProvider>
  );
};

export default App;
