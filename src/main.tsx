import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
const node=document.getElementById("root");
if(!node)throw new Error("CEStudy root element was not found.");
createRoot(node).render(<StrictMode><App/></StrictMode>);
