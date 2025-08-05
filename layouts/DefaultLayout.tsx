import { Head } from "./head";
import { Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useCallback, useState } from "react";
import { useLogoutPressable } from "@/hooks/useLogoutPressable";
import useAddSwimlanePressable from "@/hooks/useAddSwimlanePressable";
import useFilterTicketsPressable from "@/hooks/useFilterTicketsPressable";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { onPress: onLogoutPress } = useLogoutPressable();
    const { onPress: onAddSwimlanePress, modal: AddSwimlaneModal } = useAddSwimlanePressable();
    const { onPress: onFilterTicketsPress, modal: FilterTicketsModal } = useFilterTicketsPressable();
    const handleListboxAction = useCallback((action: string) => {
        switch (action) {
            case "logout":
                onLogoutPress();
                break;
            case "add-swimlane":
                onAddSwimlanePress();
                break;
            case "filter-tickets":
                onFilterTicketsPress();
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
        setPopoverOpen(false);
    }, []);
    return (
        <div className="flex flex-col gap-2 h-screen"
            style={{
                background: 'radial-gradient(circle at top left, #2a2d38, #1a1c24)'
            }}>
            <Head />
            <div>
                <Popover placement="bottom-start" isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger>
                        <h1 className="text-2xl text-white font-bold m-4 mb-1 cursor-pointer">
                            ▼ Your Kando Dashboard
                        </h1>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div>
                            <Listbox aria-label="Main Menu Actions" onAction={(action) => handleListboxAction(action as string)}>
                                <ListboxItem key="add-swimlane">Add Swimlane</ListboxItem>
                                <ListboxItem key="filter-tickets">Filter Tickets</ListboxItem>
                                <ListboxItem key="logout">Logout</ListboxItem>
                            </Listbox>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <main className="h-full p-4 w-full overflow-x-auto">{children}</main>
            {AddSwimlaneModal}
            {FilterTicketsModal}
        </div>
    );
}
