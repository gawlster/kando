import { useTickets } from "@/data/tickets";
import Swimlane from "./swimlane";
import { cloneElement, useCallback, useState } from "react";
import { type ResponseType as GetTicketsResponse } from "../pages/api/getTickets/[swimlaneId]";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Ticket from "./ticket";

export default function SortableSwimlane({
    sortableTickets,
    setSortableTickets
}: {
    sortableTickets: GetTicketsResponse;
    setSortableTickets: React.Dispatch<React.SetStateAction<GetTicketsResponse>>;
}) {
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = sortableTickets.findIndex((i) => i.id === active.id);
            const newIndex = sortableTickets.findIndex((i) => i.id === over?.id);
            const newItems = arrayMove(sortableTickets, oldIndex, newIndex);
            setSortableTickets(newItems);
        }
    }, [
        sortableTickets,
        setSortableTickets
    ]);
    return (
        <div className="flex flex-col w-full gap-2 items-center justify-center">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortableTickets.map((ticket) => ticket.id)} strategy={verticalListSortingStrategy}>
                    {sortableTickets.map((ticket) => (
                        <SortableItem
                            key={ticket.id}
                            id={ticket.id}
                            component={
                                <Ticket
                                    details={ticket}
                                    interactionEnabled={false}
                                />
                            }
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}

function SortableItem({ id, component }: { id: number, component: React.ReactElement }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : "auto",
    };
    return cloneElement(component, {
        ref: setNodeRef,
        style,
        listeners,
        attributes,
    });
}
