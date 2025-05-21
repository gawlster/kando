import { useCallback, useState } from "react";
import toast from "react-hot-toast";

type UsePostOptions<TData> = {
    successMessage?: string | ((data: TData | null) => string);
    errorMessage?: string | ((error: PostError) => string);
}

class PostError extends Error {
    message: string;
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

export function usePost<TBody, TData>(url: string, opts?: UsePostOptions<TData>) {
    const [data, setData] = useState<TData | null>(null)
    const [error, setError] = useState<PostError | null>(null)
    const [loading, setLoading] = useState(false)
    const doPostCall = useCallback(async (body: TBody) => {
        setError(null)
        setData(null)
        setLoading(true)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        let json: TData | { error: string } | null
        try {
            json = await response.json()
        } catch (e) {
            json = null
        }
        if (!response.ok) {
            const errorMessage = (json && typeof json === "object" && "error" in json) ? json.error : response.statusText
            const error = new PostError(errorMessage, response.status)
            setError(error)
            setLoading(false)
            throw error
        }
        setData(json as TData | null)
        setLoading(false)
        return json as TData | null
    }, [])
    const doPost = useCallback(async (body: TBody) => {
        try {
            const response = doPostCall(body)
            await toast.promise(response, {
                loading: "Loading...",
                success: (data: TData | null) => {
                    if (opts?.successMessage) {
                        if (typeof opts.successMessage === "string") {
                            return opts.successMessage
                        }
                        return opts.successMessage(data)
                    }
                    return "Success!"
                },
                error: (err) => {
                    if (!(err instanceof PostError)) {
                        return "Error!"
                    }
                    if (opts?.errorMessage) {
                        if (typeof opts.errorMessage === "string") {
                            return opts.errorMessage
                        }
                        return opts.errorMessage(err)
                    }
                    return `${err.status}: ${err.message}`
                }
            })
        } catch (e) {
            // do nothing
        }
    }, [doPostCall, opts])
    return {
        doPost,
        data,
        error,
        loading
    }
}
