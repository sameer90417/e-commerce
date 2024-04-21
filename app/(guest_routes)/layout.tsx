import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';


interface Props{
    children : ReactNode
}


export default async function GuestLayout({ children } : Props) {
  const session = await auth();
  if(session) redirect('/');
  return (
    <div>{children}</div>
  )
}
