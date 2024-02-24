import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <DndProvider backend={HTML5Backend}>
    <LocationProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </LocationProvider>
    </DndProvider>
  </React.StrictMode>
);
reportWebVitals();
