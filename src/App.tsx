import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './pages/homepage';
import CalendarPage from './pages/calendarpage';
import CustomerPage from './pages/customerpage';
import SalesPage from './pages/salespage';
import SignInPage from './sign-in/[[...index]]';

function App() {
  return (
    // <Router>
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/calendar' element={<CalendarPage />} />
        <Route path='/customer' element={<CustomerPage />} />
        <Route path='/sales' element={<SalesPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-in/sso-callback' element={<HomePage />} />
      </Routes>
    </div>
    // </Router>
  );
}

export default App;
