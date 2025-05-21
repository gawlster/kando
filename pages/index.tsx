import DefaultLayout from "@/layouts/DefaultLayout";
import { default as Swimlane } from "../components/swimlane"
import { useFetch } from "@/hooks/useFetch";
import { type ResponseType as GetSwimlanesResponse, url } from "./api/getSwimlanes"
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { LoggedOut } from "@/components/auth-forms";

export const AuthContext = createContext<{
    authCookie: string | null,
    clearAuthCookie: () => void,
    refetchAuthCookie: () => void
}>({
    authCookie: null,
    clearAuthCookie: () => null,
    refetchAuthCookie: () => null
})

export default function IndexPage() {
    const [authCookie, setAuthCookie] = useState<string | null>(null)
    const refetchAuthCookie = useCallback(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('auth='))
        if (cookie) {
            const value = cookie.split('=')[1]
            setAuthCookie(value)
        } else {
            setAuthCookie(null)
        }
    }, [])
    const clearAuthCookie = useCallback(() => {
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        refetchAuthCookie()
    }, [refetchAuthCookie])
    useEffect(() => {
        refetchAuthCookie()
    }, [refetchAuthCookie])
    if (!authCookie) {
        return (
            <AuthContext.Provider value={{ authCookie, clearAuthCookie, refetchAuthCookie }}>
                <Toaster />
                <LoggedOut />
            </AuthContext.Provider>
        )
    }
    return (
        <AuthContext.Provider value={{ authCookie, clearAuthCookie, refetchAuthCookie }}>
            <Toaster />
            <LoggedIn />
        </AuthContext.Provider>
    )
}


export const AvailableSwimlanesContext = createContext<{ swimlanes: { id: number, title: string }[] }>({ swimlanes: [] })
export const RefetchDataFunctionsContext = createContext<
    [
        Record<number, () => Promise<void>>,
        React.Dispatch<React.SetStateAction<Record<number, () => Promise<void>>>>
    ]
>([{}, () => { }])

function LoggedIn() {
    const { data: swimlanes, loading } = useFetch<GetSwimlanesResponse>(url)
    const refetchDataFunctionsState = useState<Record<number, () => Promise<void>>>({})

    if (loading || !swimlanes) {
        return (
            <ContextProviders swimlanes={[]} refetchDataFunctionsState={refetchDataFunctionsState}>
                <Layout></Layout>
            </ContextProviders>
        )
    }

    return (
        <ContextProviders swimlanes={swimlanes} refetchDataFunctionsState={refetchDataFunctionsState}>
            <Layout>
                {swimlanes.map((swimlane) => (
                    <Swimlane key={swimlane.id} details={swimlane} />
                ))}
            </Layout>
        </ContextProviders>
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

function ContextProviders({ children, swimlanes, refetchDataFunctionsState }: {
    children: React.ReactNode;
    swimlanes: { id: number, title: string }[]
    refetchDataFunctionsState: [Record<number, () => Promise<void>>, React.Dispatch<React.SetStateAction<Record<number, () => Promise<void>>>>]
}) {
    return (
        <AvailableSwimlanesContext.Provider value={{ swimlanes: swimlanes }}>
            <RefetchDataFunctionsContext.Provider value={refetchDataFunctionsState}>
                {children}
            </RefetchDataFunctionsContext.Provider>
        </AvailableSwimlanesContext.Provider>
    )
}
