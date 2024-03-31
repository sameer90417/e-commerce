import React from 'react'

export default function EmailVerificationBanner() {
  return (
    <div className='p-2 text-center bg-blue-gray-50'>
        <span>It looks like you haven't verified your email.</span>
        <button className='ml-2 font-semibold underline'>Get Verification link.</button>
    </div>
  )
}
