"use client";
import React from 'react'
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button 
      onClick={() => signOut()}
      className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
      title="Logout"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  )
}

export default LogoutButton
