import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SocketProvider from "./context/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
