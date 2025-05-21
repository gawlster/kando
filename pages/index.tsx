import DefaultLayout from "@/layouts/DefaultLayout";
import { default as Swimlane } from "../components/swimlane"
import { useFetch } from "@/hooks/useFetch";
import { type ResponseType as GetSwimlanesResponse, url } from "./api/getSwimlanes"
import React, { createContext, use, useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
import { usePost } from "@/hooks/usePost";
import {
    type BodyType as LoginPostBody,
    type ResponseType as LoginPostResponse,
    url as loginPostUrl
} from "./api/login";

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
                <LoggedOut />
            </AuthContext.Provider>
        )
    }
    return (
        <AuthContext.Provider value={{ authCookie, clearAuthCookie, refetchAuthCookie }}>
            <LoggedIn />
        </AuthContext.Provider>
    )
}

function LoggedOut() {
    const { refetchAuthCookie } = useContext(AuthContext)
    const {
        doPost: doLogin,
        loading: loginLoading,
    } = usePost<LoginPostBody, LoginPostResponse>(loginPostUrl)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmitPress = useCallback(async () => {
        await doLogin({
            username,
            password
        })
        refetchAuthCookie()
    }, [username, password, doLogin, refetchAuthCookie])
    return (
        <div className="w-screen min-h-screen flex items-center justify-center">
            <Card className="max-w-[400px] w-[80%] mx-auto p-4">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Log in to continue</h1>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex flex-col gap-2 pt-2">
                        <Input
                            label="Username"
                            labelPlacement="inside"
                            name="username"
                            value={username}
                            onValueChange={setUsername}
                        />
                        <Input
                            label="Password"
                            labelPlacement="inside"
                            name="password"
                            value={password}
                            onValueChange={setPassword}
                            type="password"
                        />
                        <Button className="mt-2" onPress={handleSubmitPress}>{loginLoading ? "Loading..." : "Submit"}</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
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
