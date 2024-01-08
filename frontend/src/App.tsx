import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import { Toaster } from 'react-hot-toast';
import CustomerProvider from './context/customerContext';

function App() {
  return (
    <div className='container'>
      <CustomerProvider>
        <Toaster />
        <Navbar />
        <Outlet />
      </CustomerProvider>
    </div>
  );
}

export default App;
