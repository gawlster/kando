import { default as Ticket, type Ticket as TTicket, AddCardTicket } from "./ticket"

export type Swimlane = {
    id: string;
    title: string;
    gradientColors: string[];
    tickets: TTicket[];
};

export default function Swimlane({ details }: { details: Swimlane }) {
    return (
        <div className="flex flex-col w-[272px]">
            <span>{details.title}</span>
            <div
                className="p-2 flex flex-col gap-1 rounded-md overflow-y-auto max-h-full hide-scrollbar"
                style={{
                    background: `linear-gradient(135deg, ${details.gradientColors.join(", ")})`,
                    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.50)',
                }}
            >
                {details.tickets.map((ticket) => (
                    <Ticket key={ticket.id} details={ticket} />
                ))}
                <AddCardTicket swimlaneId={details.id} swimlaneTitle={details.title} isEmptySwimlane={details.tickets.length === 0} />
            </div>
        </div>
    );
}
