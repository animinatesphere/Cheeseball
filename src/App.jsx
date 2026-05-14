import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;

