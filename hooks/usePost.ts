import { useCallback, useState } from "react";

export function usePost<TBody, TData>(url: string) {
    const [data, setData] = useState<TData | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const doPost = useCallback(async (body: TBody) => {
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
            return
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
    return {
        doPost,
        data,
        error,
        loading
    }
}
