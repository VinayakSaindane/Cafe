import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const style = document.createElement('style');
style.textContent = `
  :root {
    --font-heading: "Playfair Display", serif;
    --font-body: "Lato", sans-serif;
    --font-accent: "Montserrat", sans-serif;
    --color-primary: #5C4033;
    --color-secondary: #F5F5DC;
    --color-accent: #8B4513;
    --color-neutral-light: #F8F8F8;
    --color-neutral-dark: #333333;
    --color-status-success: #4CAF50;
    --color-status-error: #F44336;
  }
  
  body {
    font-family: var(--font-body);
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
