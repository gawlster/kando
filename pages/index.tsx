import DefaultLayout from "@/layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { LoggedOut } from "@/components/auth-forms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSwimlanes } from "@/data/swimlanes";
import Swimlane from "@/components/swimlane";

function getAuthCookie() {
    if (typeof document === "undefined") {
        return "";
    }
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "auth") {
            return decodeURIComponent(value);
        }
    }
    return ""
}

const queryClient = new QueryClient();

export default function IndexPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const authCookie = getAuthCookie();
        if (authCookie !== "") {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            {loggedIn ? <LoggedIn /> : <LoggedOut />}
        </QueryClientProvider>
    )
}

function LoggedIn() {
    const { data: swimlanes } = useSwimlanes();
    return (
        <Layout>
            {swimlanes?.map((swimlane) => (
                <Swimlane key={swimlane.id} details={swimlane} />
            ))}
        </Layout>
    )
}


function Layout({ children }: { children?: React.ReactNode }) {
    return (
        <DefaultLayout>
            <div className="flex gap-4 h-full w-fit">
                {children}
            </div>
        </DefaultLayout>
    )
}
