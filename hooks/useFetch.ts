import { useCallback, useEffect, useRef, useState } from "react";

export function useFetch<TData>(url: string) {
    const hasFetchedOnLoad = useRef(false)
    const [data, setData] = useState<TData | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const doFetch = useCallback(async () => {
        setLoading(true)
        const response = await fetch(url)
        if (!response.ok) {
            setError(response.statusText)
            setLoading(false)
            return
        }
        const json = await response.json()
        setData(json)
        setLoading(false)
    }, [url])
    useEffect(() => {
        if (hasFetchedOnLoad.current) {
            return
        }
        doFetch();
        hasFetchedOnLoad.current = true;
    })
    return {
        data,
        error,
        refetch: doFetch,
        loading
    }
}

export function useFetchWithQueryParams<TParams, TData>(url: string, initialParams: TParams) {
    const hasFetchedOnLoad = useRef(false)
    const [data, setData] = useState<TData | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const doFetch = useCallback(async (params: TParams) => {
        setLoading(true)
        const urlWithParams = `${url}?${new URLSearchParams(params as Record<string, string>).toString()}`
        const response = await fetch(urlWithParams)
        if (!response.ok) {
            setError(response.statusText)
            setLoading(false)
            return
        }
        const json = await response.json()
        setData(json)
        setLoading(false)
    }, [url])
    useEffect(() => {
        if (hasFetchedOnLoad.current) {
            return
        }
        doFetch(initialParams);
        hasFetchedOnLoad.current = true;
    })
    return {
        data,
        error,
        refetch: doFetch,
        loading
    }
}
