import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/Notfound';
import HomePage from './pages/homepage';
import CalendarPage from './pages/calendarpage';
import CustomerPage from './pages/customerpage';
import ServicePage from './pages/servicepage';

import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/', element: <HomePage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/customer', element: <CustomerPage /> },
      { path: '/service', element: <ServicePage /> },
      {
        path: '/sign-in/*',
        element: <SignIn redirectUrl='/' />,
      },
      {
        path: '/sign-up/*',
        element: <SignUp redirectUrl='/' />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
