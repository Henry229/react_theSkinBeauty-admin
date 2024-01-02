import React from 'react';
import { NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function Navbar() {
  const activeNavClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? 'text-lg font-bold' : 'text-lg';
  };

  return (
    <nav className='flex items-center justify-between p-4 bg-gray-100'>
      <span className='text-xl font-bold'>Logo</span>
      <div className='flex gap-4'>
        <NavLink to='/calendar' className={activeNavClass}>
          Calendar
        </NavLink>
        <NavLink to='/customer' className={activeNavClass}>
          Customer
        </NavLink>
        <NavLink to='/service' className={activeNavClass}>
          Service
        </NavLink>
      </div>
      <SignedOut>
        <NavLink
          to='/sign-in'
          className='px-4 py-2 text-white bg-blue-500 rounded'
        >
          Sign In
        </NavLink>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl='/' />
      </SignedIn>
    </nav>
  );
}
