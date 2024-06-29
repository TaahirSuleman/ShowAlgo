import React from 'react';
import HomePage from '../components/HomePage';
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import '../styles/HomePage.css';

const HomeView: React.FC = () => {
  return (
    <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

        <div className='home-view-container'>
            <h1>ShowAlgo</h1>
            <HomePage />
        </div>
    </div>
  );
}

export default HomeView;