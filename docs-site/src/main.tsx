import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Side effect: pulls in the library's tokens/reset plus every component's CSS.
import "@your-job-search-genius/odyssey-ui";
// Shared chrome for react-aria hook demos (token-based boxes, event log, etc.).
import "../../src/react-aria-hooks/shared/hook-demos.css";
// Docs chrome styles load last so they win specificity ties with the library.
import "./styles/site.css";
import App from "./App";
import { SplashLoader } from "./components/SplashLoader";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      Mounted outside the router (once per full document load/refresh, not
      per route) so it plays every time this page loads and is unaffected
      by client-side navigation between routes.
    */}
    <SplashLoader />
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>,
);
