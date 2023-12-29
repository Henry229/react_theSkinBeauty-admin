import React from 'react';
import { NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function Navbar() {
  const activeNavClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? 'text-lg font-bold' : 'text-lg';
  };

  return (
    <nav className='flex justify-between items-center p-4 bg-gray-100'>
      <span className='text-xl font-bold'>Logo</span>
      <div className='flex gap-4'>
        <NavLink to='/calendar' className={activeNavClass}>
          Calendar
        </NavLink>
        <NavLink to='/customer' className={activeNavClass}>
          Customer
        </NavLink>
        <NavLink to='/sales' className={activeNavClass}>
          Sales
        </NavLink>
      </div>
      <SignedOut>
        <NavLink
          to='/sign-in'
          className='bg-blue-500 text-white px-4 py-2 rounded'
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