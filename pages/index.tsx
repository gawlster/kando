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
type RefetchDataFunctionsContextType = {
    refetchAllSwimlanes: () => Promise<void>,
    registerRefetchFunction: (swimlaneId: number, refetchFunction: () => Promise<void>) => void,
    refetchSwimlane: (swimlaneId: number) => Promise<void>
}
export const RefetchDataFunctionsContext = createContext<RefetchDataFunctionsContextType>({
    refetchAllSwimlanes: async () => { },
    registerRefetchFunction: () => { },
    refetchSwimlane: async () => { }
})

function LoggedIn() {
    const { data: swimlanes, loading, refetch } = useFetch<GetSwimlanesResponse>(url)
    const [refetchDataFunctions, setRefetchDataFunctions] = useState<{
        refetchAllSwimlanes: () => Promise<void>,
        swimlanes: Record<number, () => Promise<void>>
    }>({
        refetchAllSwimlanes: refetch,
        swimlanes: {}
    })

    const registerRefetchFunction = useCallback((swimlaneId: number, refetchFunction: () => Promise<void>) => {
        setRefetchDataFunctions(prev => ({
            ...prev,
            swimlanes: {
                ...prev.swimlanes,
                [swimlaneId]: refetchFunction
            }
        }))
    }, [setRefetchDataFunctions]);

    const refetchSwimlane = useCallback(async (swimlaneId: number) => {
        if (swimlaneId in refetchDataFunctions.swimlanes) {
            const refetchFunction = refetchDataFunctions.swimlanes[swimlaneId];
            await refetchFunction();
        } else {
            console.warn(`No refetch function registered for swimlane ID ${swimlaneId}`);
        }
    }, [refetchDataFunctions]);

    if (loading || !swimlanes) {
        return (
            <ContextProviders swimlanes={[]} refetchDataFunctionsState={{
                refetchAllSwimlanes: refetch,
                registerRefetchFunction,
                refetchSwimlane
            }}>
                <Layout></Layout>
            </ContextProviders>
        )
    }

    return (
        <ContextProviders swimlanes={swimlanes} refetchDataFunctionsState={{
            refetchAllSwimlanes: refetch,
            registerRefetchFunction,
            refetchSwimlane
        }}>
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
    swimlanes: { id: number, title: string }[];
    refetchDataFunctionsState: RefetchDataFunctionsContextType;
}) {
    return (
        <AvailableSwimlanesContext.Provider value={{ swimlanes: swimlanes }}>
            <RefetchDataFunctionsContext.Provider value={refetchDataFunctionsState}>
                {children}
            </RefetchDataFunctionsContext.Provider>
        </AvailableSwimlanesContext.Provider>
    )
}
