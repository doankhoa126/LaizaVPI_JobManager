import './App.css';
import StickyHeadTable from './views/jobManagement';
import React from 'react';
import dotenv from 'dotenv';

dotenv.config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          <StickyHeadTable></StickyHeadTable>
        </p>
      </header>
    </div>
  );
}

export default App;
