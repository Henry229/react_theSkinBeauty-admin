import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';

function App() {
  return (
    <div className='container'>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
