import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Side effect: pulls in the library's tokens/reset plus every component's CSS.
import "@your-job-search-genius/odyssey-ui";
// Docs chrome styles load last so they win specificity ties with the library.
import "./styles/site.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>,
);
