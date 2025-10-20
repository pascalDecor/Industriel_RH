"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SideBar from "./components/sidebar";
import Header from "./components/header";
import { useSession } from "@/hooks/useSession";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/models/user";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 60 * 1000, // 30 minutes - cache très long
            gcTime: 60 * 60 * 1000, // 1 heure - garde en mémoire
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Ne pas refetch au mount si données fraîches
            refetchOnReconnect: false,
            retry: 1, // Réduire les tentatives pour échecs rapides
            retryDelay: 500, // Délai court entre tentatives
        },
    },
});



export default function LayoutAdmin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { session, isLoading } = useSession();
    const [initialisation, setInitialisation] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!initialisation) {
            console.log("useEffect", session, isLoading, !session && !isLoading);
            try {
                setUser(User.fromJSON(session?.user));
                console.log("user", user);
                setInitialisation(true);
                if (user?.id === "") {
                    return redirect('/login');
                } 
            } catch (error) {
                console.log(error);
            }
        }
    }, [session, isLoading, user]);


    if (isLoading) {
        return <p className="text-center text-gray-800">Chargement...</p>;
    }

    if (!session && !isLoading) {
        return redirect('/login');
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" />
            <section className="dark:text-gray-400 text-gray-800 h-[100vh]">
                <div className="flex gap-0 h-full">
                    <div className="h-full">
                        <SideBar />
                    </div>
                    <div className="bg-slate-100 w-full h-full overflow-y-auto">
                        {user?.id !== "" && <Header user={user} />}
                        <main className="py-5 px-10">
                            {children}
                        </main>
                    </div>
                </div>
            </section>
        </QueryClientProvider>
    );
}
