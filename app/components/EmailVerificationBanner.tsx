'use client'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'

export default function EmailVerificationBanner() {
  const {profile} = useAuth()

  const applyForReverification = async () => {
    if(!profile) return 
    const res = await fetch('/api/users/verify?userId='+profile.id, {
      method : 'GET'
    })

    const {message, error} = await res.json();
    if(!res.ok && error){
      toast.error(error);
    }

    toast.success(message);

  }

  if(profile?.verified) return null;

  return (
    <div className='p-2 text-center bg-blue-gray-50'>
        <span>It looks like you haven't verified your email.</span>
        <button className='ml-2 font-semibold underline'>Get Verification link.</button>
    </div>
  )
}
