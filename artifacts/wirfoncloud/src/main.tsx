import { createRoot } from "react-dom/client";
import App from "./App";
import { SiteProvider } from "./hooks/useSite";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <SiteProvider>
    <App />
  </SiteProvider>,
);
