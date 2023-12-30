import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className='container'>
      <Toaster />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
