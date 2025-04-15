import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { UserDataProvider } from "./contexts/UserDataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserDataProvider>
      <App />
    </UserDataProvider>
  </StrictMode>
);

serviceWorkerRegistration.register();
