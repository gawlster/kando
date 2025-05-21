import { AuthContext } from "@/pages";
import { Button } from "@heroui/button";
import { useCallback, useContext } from "react";

export default function LogoutButton() {
    const { clearAuthCookie } = useContext(AuthContext)
    const handlePress = useCallback(() => {
        clearAuthCookie()
    }, [clearAuthCookie])
    return (
        <Button onPress={handlePress}>Logout</Button>
    )
}
