import DefaultLayout from "@/layouts/DefaultLayout";
import { default as Swimlane } from "../components/swimlane"
import { useFetch } from "@/hooks/useFetch";
import { type ResponseType as GetSwimlanesResponse, url } from "./api/getSwimlanes"
import { createContext } from "react";

export const AvailableSwimlanesContext = createContext<{ swimlanes: { id: number, title: string }[] }>({ swimlanes: [] })

export default function IndexPage() {
    const { data: swimlanes, loading } = useFetch<GetSwimlanesResponse>(url)

    if (loading || !swimlanes) {
        return (
            <AvailableSwimlanesContext.Provider value={{ swimlanes: [] }}>
                <Layout></Layout>
            </AvailableSwimlanesContext.Provider>
        )
    }

    return (
        <AvailableSwimlanesContext.Provider value={{ swimlanes: swimlanes }}>
            <Layout>
                {swimlanes.map((swimlane) => (
                    <Swimlane key={swimlane.id} details={swimlane} />
                ))}
            </Layout>
        </AvailableSwimlanesContext.Provider>
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
