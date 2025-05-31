import { useEffect, useRef, useState } from "react";

export function useLocalStorage(key: string) {
    const [state, setState] = useState("");
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const storedValue = localStorage.getItem(key);
            setState(storedValue || "");
        } else {
            localStorage.setItem(key, state);
        }
    }, [key, state]);
    return [state, setState];
}
