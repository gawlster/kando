import DefaultLayout from "@/layouts/DefaultLayout";
import { default as Swimlane } from "../components/swimlane"
import { useFetch } from "@/hooks/useFetch";
import { type ResponseType as GetSwimlanesResponse, url } from "./api/getSwimlanes"

export default function IndexPage() {
    const { data: swimlanes, loading } = useFetch<GetSwimlanesResponse>(url)

    if (loading || !swimlanes) {
        return (
            <Layout></Layout>
        )
    }

    return (
        <Layout>
            {swimlanes.map((swimlane) => (
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
