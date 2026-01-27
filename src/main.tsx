import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// تم حذف كل ما يتعلق بـ Convex ليعمل الموقع بشكل محلي تماماً
createRoot(document.getElementById("root")!).render(<App />);