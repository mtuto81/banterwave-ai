
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './fallback.css' // Import fallback CSS first
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
