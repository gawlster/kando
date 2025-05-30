import { useCallback, useEffect, useMemo, useState } from "react";

export function useEnter(callback: () => void, enableDependency: boolean = true) {
    const [isEnabled, setIsEnabled] = useState(true)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEnabled && event.key === "Enter") {
                event.preventDefault();
                callback();
            }
        };

        if (typeof document !== "undefined") {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [callback, isEnabled]);
    useEffect(() => {
        setIsEnabled(enableDependency);
    }, [enableDependency]);
    const enable = useCallback(() => setIsEnabled(true), []);
    const disable = useCallback(() => setIsEnabled(false), []);
    return useMemo(() => ({
        enable,
        disable,
    }), [enable, disable]);
}
