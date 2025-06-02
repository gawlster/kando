import { Button } from "@heroui/button";
import { useCallback } from "react";

export default function LogoutButton() {
    const handlePress = useCallback(() => {
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }, []);
    return (
        <Button onPress={handlePress}>Logout</Button>
    )
}
