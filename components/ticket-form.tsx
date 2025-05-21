import {
    Input,
    DatePicker,
    Textarea,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";

export default function TicketForm({
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    handleStartDateChange,
    dueDate,
    setDueDate
}: {
    title: string,
    setTitle: (title: string) => void,
    description: string,
    setDescription: (description: string) => void,
    startDate: CalendarDate,
    handleStartDateChange: (date: CalendarDate) => void,
    dueDate: CalendarDate,
    setDueDate: (date: CalendarDate) => void
}) {
    return (
        <>
            <Input
                label="Title"
                labelPlacement="inside"
                name="title"
                value={title}
                onValueChange={setTitle}
            />
            <Textarea
                label="Description"
                labelPlacement="inside"
                name="description"
                value={description}
                onValueChange={setDescription}
            />
            <div className="flex gap-2 w-full wrap">
                <DatePicker
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={startDate as any}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={handleStartDateChange as any}
                    label="Start Date"
                    labelPlacement="inside"
                />
                <DatePicker
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={dueDate as any}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={setDueDate as any}
                    label="Due Date"
                    labelPlacement="inside"
                    minValue={startDate}
                />
            </div>
        </>
    )
}
