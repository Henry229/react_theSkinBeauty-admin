import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedPage from './protectedPage';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const ClerkWithRoutes = () => {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path='/' element={<App />} />
        <Route
          path='/sign-in/*'
          element={
            <SignIn redirectUrl={'/protected'} routing='path' path='/sign-in' />
          }
        />
        <Route
          path='/sign-up/*'
          element={
            <SignUp redirectUrl={'/protected'} routing='path' path='/sign-up' />
          }
        />
        <Route
          path='/protected'
          element={
            <>
              <SignedIn>
                <ProtectedPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkWithRoutes />
    </BrowserRouter>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider> */}
  </React.StrictMode>
);
