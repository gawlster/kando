import { useCallback, useState } from "react";
import toast from "react-hot-toast";

type UsePostOptions = {
    successMessage?: string;
    errorMessage?: string;
}

export function usePost<TBody, TData>(url: string, opts?: UsePostOptions) {
    const [data, setData] = useState<TData | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const doPostCall = useCallback(async (body: TBody) => {
        setLoading(true)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            setError(response.statusText)
            setLoading(false)
            throw new Error()
        }
        let json: TData | null
        try {
            json = await response.json()
        } catch (e) {
            json = null
        }
        setData(json)
        setLoading(false)
    }, [])
    const doPost = useCallback(async (body: TBody) => {
        try {
            await toast.promise(doPostCall(body), {
                loading: "Loading...",
                success: opts?.successMessage ?? "Success!",
                error: opts?.errorMessage ?? "Error!"
            })
        } catch (e) {
            // do nothing
        }
    }, [doPostCall, error])
    return {
        doPost,
        data,
        error,
        loading
    }
}
