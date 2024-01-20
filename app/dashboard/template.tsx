'use client'

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    if (!session || !session.user) {
        redirect('/login');
    }

    return <>{children}</>;
}