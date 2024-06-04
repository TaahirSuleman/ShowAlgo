import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppView from './views/AppView';
import HomeView from './views/HomeView';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* <Route path="/" element={<AppView />} /> */}
        <Route path="/" element={<HomeView />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
