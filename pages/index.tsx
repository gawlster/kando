import { v4 as uuidv4 } from "uuid"
import DefaultLayout from "@/layouts/DefaultLayout";
import { CalendarDate } from "@internationalized/date";
import {
    useCallback,
    useState,
} from "react";
import { createContext } from "react";
import { type Ticket } from "../components/ticket"
import { default as Swimlane, type Swimlane as TSwimlane } from "../components/swimlane"

export type AddTicketRequest = {
    swimlaneId: string;
} & Omit<Ticket, "id">;

export type AddTicketResponse = void

export type MoveTicketRequest = {
    destinationSwimlaneId: string;
    ticket: Ticket
}

export type MoveTicketResponse = void;

export const DataContext = createContext<{
    data: { swimlanes: TSwimlane[] },
    addTicket: (data: AddTicketRequest) => AddTicketResponse
    moveTicket: (data: MoveTicketRequest) => MoveTicketResponse
}>({
    data: { swimlanes: [] },
    addTicket: () => null,
    moveTicket: () => null
});

export default function IndexPage() {
    const [data, setData] = useState<{ swimlanes: TSwimlane[] }>({
        swimlanes: [
            {
                id: "backlog",
                title: "Backlog",
                gradientColors: ["#e8f1fb", "#dbeeff"],
                tickets: [
                    {
                        id: "1",
                        title: "Ticket 1",
                        description: "Some description",
                        startDate: new CalendarDate(2025, 1, 1),
                        dueDate: new CalendarDate(2025, 1, 1),
                        tags: []
                    },
                    {
                        id: "2",
                        title: "Ticket 2",
                        description: "Some description",
                        startDate: new CalendarDate(2025, 1, 1),
                        dueDate: new CalendarDate(2025, 1, 1),
                        tags: []
                    },
                    {
                        id: "3",
                        title: "Ticket 3",
                        description: "Some description",
                        startDate: new CalendarDate(2025, 1, 1),
                        dueDate: new CalendarDate(2025, 1, 1),
                        tags: []
                    },
                ],
            },
            {
                id: "in-progress",
                title: "In Progress",
                gradientColors: ["#f1fff8", "#d9f5e5"],
                tickets: [
                    {
                        id: "4",
                        title: "Ticket 4",
                        description: "Some description",
                        startDate: new CalendarDate(2025, 1, 1),
                        dueDate: new CalendarDate(2025, 1, 1),
                        tags: []
                    },
                    {
                        id: "5",
                        title: "Ticket 5",
                        description: "Some description",
                        startDate: new CalendarDate(2025, 1, 1),
                        dueDate: new CalendarDate(2025, 1, 1),
                        tags: []
                    },
                ],
            },
            {
                id: "done",
                title: "Done",
                gradientColors: ["#f8f4ff", "#e9ddf9"],
                tickets: [{
                    id: "6",
                    title: "Ticket 6",
                    description: "Some description",
                    startDate: new CalendarDate(2025, 1, 1),
                    dueDate: new CalendarDate(2025, 1, 1),
                    tags: []
                }],
            },
        ],
    });

    const addTicket = useCallback((data: AddTicketRequest) => {
        const newTicket = {
            id: uuidv4(),
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            dueDate: data.dueDate,
            tags: data.tags
        }
        setData((prevData) => ({
            ...prevData,
            swimlanes: prevData.swimlanes.map((swimlane) => {
                if (swimlane.id === data.swimlaneId) {
                    return {
                        ...swimlane,
                        tickets: [...swimlane.tickets, newTicket],
                    };
                }
                return swimlane
            })
        }));
    }, [])

    const moveTicket = useCallback((data: MoveTicketRequest) => {
        setData((prevData) => ({
            ...prevData,
            swimlanes: prevData.swimlanes.map((swimlane) => {
                if (swimlane.id === data.destinationSwimlaneId) {
                    return {
                        ...swimlane,
                        tickets: [...swimlane.tickets, data.ticket],
                    };
                }
                return {
                    ...swimlane,
                    tickets: swimlane.tickets.filter((ticket) => ticket.id !== data.ticket.id),
                };
            })
        }));
    }, [])

    return (
        <DataContext.Provider value={{ data, addTicket, moveTicket }}>
            <DefaultLayout>
                <div className="flex gap-4 h-full w-fit">
                    {data.swimlanes.map((swimlane) => (
                        <Swimlane key={swimlane.id} details={swimlane} />
                    ))}
                </div>
            </DefaultLayout>
        </DataContext.Provider>
    )
}


