import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import OpsDashboard from "./OpsDashboard.jsx"
import { Analytics } from "@vercel/analytics/react"

const isOps = window.location.pathname === "/ops";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isOps ? <OpsDashboard /> : <App />}
    <Analytics />
  </React.StrictMode>,
)
