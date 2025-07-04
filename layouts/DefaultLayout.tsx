import LogoutButton from "@/components/logout-button";
import { Head } from "./head";
import FilterTicketsPopover from "@/components/filter-tickets-popover";
import AddSwimlaneButton from "@/components/add-swimlane-button";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2 h-screen"
            style={{
                background: 'radial-gradient(circle at top left, #2a2d38, #1a1c24)'
            }}>
            <Head />
            <div>
                <span>
                    Header and other stuff
                </span>
                <LogoutButton />
                <AddSwimlaneButton />
                <FilterTicketsPopover />
            </div>
            <main className="h-full p-4 w-full overflow-x-auto">{children}</main>
        </div>
    );
}
