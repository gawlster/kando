import DefaultLayout from "@/layouts/DefaultLayout";
import { default as Swimlane } from "../components/swimlane"
import { useFetch } from "@/hooks/useFetch";
import { type ResponseType as GetSwimlanesResponse, url } from "./api/getSwimlanes"
import React, { createContext, useState } from "react";

export const AvailableSwimlanesContext = createContext<{ swimlanes: { id: number, title: string }[] }>({ swimlanes: [] })
export const RefetchDataFunctionsContext = createContext<
    [
        Record<number, () => Promise<void>>,
        React.Dispatch<React.SetStateAction<Record<number, () => Promise<void>>>>
    ]
>([{}, () => { }])

export default function IndexPage() {
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
