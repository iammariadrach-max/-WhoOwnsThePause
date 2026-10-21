import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/manrope/cyrillic-500.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/ibm-plex-mono/cyrillic-400.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/cormorant/cyrillic-300-italic.css";
import "@fontsource/cormorant/latin-300-italic.css";
import App from "./App";
import "./styles.css";
import "./styles/art-direction.css";
import "./styles/editorial.css";
import "./styles/reference-cover.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
