import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) redirect("/auth/signin");  

  return <AdminSidebar>
    {children}
    </AdminSidebar>;
}
