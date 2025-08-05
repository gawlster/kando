import { useCallback } from "react";

export function useLogoutPressable() {
    const onPress = useCallback(() => {
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        window.dispatchEvent(new CustomEvent("authChanged"));
    }, []);
    return {
        onPress
    }
}
