import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserDataProvider } from "./contexts/UserDataContext.tsx";
import { registerSW } from "virtual:pwa-register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserDataProvider>
      <App />
    </UserDataProvider>
  </StrictMode>
);

registerSW({ immediate: true });
