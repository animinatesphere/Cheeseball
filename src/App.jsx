import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { RatesProvider } from "@/context/RatesContext";

const App = () => {
  return (
    <ThemeProvider>
      <RatesProvider>
        <AppRoutes />
      </RatesProvider>
    </ThemeProvider>
  );
};

export default App;

