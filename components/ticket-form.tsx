import { useFetch } from "@/hooks/useFetch";
import {
    Input,
    DatePicker,
    Textarea,
    Select,
    SelectItem,
    Chip,
    SharedSelection,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { type ResponseType as GetAllUserTagsResponse, url as getAllUserTagsUrl } from "../pages/api/getAllUserTags";
import { useCallback, useMemo, useState } from "react";
import { usePost } from "@/hooks/usePost";
import {
    type BodyType as AddNewTagBody,
    type ResponseType as AddNewTagResponse,
    url as addNewTagUrl
} from "../pages/api/addTag";

export default function TicketForm({
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    handleStartDateChange,
    dueDate,
    setDueDate,
    selectedTagIds,
    setSelectedTagIds
}: {
    title: string,
    setTitle: (title: string) => void,
    description: string,
    setDescription: (description: string) => void,
    startDate: CalendarDate,
    handleStartDateChange: (date: CalendarDate) => void,
    dueDate: CalendarDate,
    setDueDate: (date: CalendarDate) => void,
    selectedTagIds: Set<string>,
    setSelectedTagIds: (tagIds: Set<string>) => void
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
            <TagSelect
                selectedTagIds={selectedTagIds}
                setSelectedTagIds={setSelectedTagIds}
            />
        </>
    )
}

function TagSelect({ selectedTagIds, setSelectedTagIds }: { selectedTagIds: Set<string>, setSelectedTagIds: (tagIds: Set<string>) => void }) {
    const { doPost: addNewTag, loading: addNewTagLoading } = usePost<AddNewTagBody, AddNewTagResponse>(addNewTagUrl);
    const [newTagTitle, setNewTagTitle] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const { data: allUserTags, loading, error, refetch: refetchAllTags } = useFetch<GetAllUserTagsResponse>(getAllUserTagsUrl);
    const selectedTagList = useMemo(() => {
        return allUserTags?.filter(tag => selectedTagIds.has(`${tag.id}`)) || [];
    }, [allUserTags, selectedTagIds]);

    const handleSelectionChange = useCallback((selectedKeys: SharedSelection) => {
        if (selectedKeys === "all") {
            return;
        }
        if (selectedKeys.has("add-new")) {
            selectedKeys.delete("add-new");
            setIsSelectOpen(false);
            onOpen();
        }
        setSelectedTagIds(new Set(Array.from(selectedKeys as Set<string>).map((key) => key)));
    }, [onOpen, setSelectedTagIds]);

    const handleAddNewTag = useCallback(async () => {
        await addNewTag({
            title: newTagTitle
        })
        setNewTagTitle("");
        onClose();
        await refetchAllTags();
        setIsSelectOpen(true);
    }, [addNewTag, newTagTitle, onClose, refetchAllTags, setIsSelectOpen]);

    if (loading || error) {
        return (
            <Select
                isMultiline
                items={[]}
                isDisabled
                label="Tags"
                labelPlacement="inside"
                renderValue={() => <span>Loading tags...</span>}
                selectionMode="multiple"
                selectedKeys={[]}
            >
                <SelectItem key="loading">Loading...</SelectItem>
            </Select>
        );
    }

    return (
        <>
            <Select
                isMultiline
                items={allUserTags || []}
                label="Tags"
                labelPlacement="inside"
                renderValue={() => (
                    <div className="flex flex-wrap gap-2">
                        {selectedTagList.map((tag) => (
                            <Chip
                                key={tag.id}
                                style={{ backgroundColor: tag.color }}
                                onClose={() => {
                                    const newSelectedIds = new Set(selectedTagIds);
                                    newSelectedIds.delete(`${tag.id}`);
                                    setSelectedTagIds(newSelectedIds);
                                }}
                            >
                                {tag.title}
                            </Chip>
                        ))}
                    </div>
                )}
                selectionMode="multiple"
                selectedKeys={selectedTagIds as unknown as SharedSelection}
                onSelectionChange={handleSelectionChange}
                isOpen={isSelectOpen}
                onOpenChange={(open) => open !== isSelectOpen && setIsSelectOpen(open)}
            >
                <>
                    {(allUserTags || []).map((tag) => (
                        <SelectItem key={tag.id} textValue={tag.title}>
                            {tag.title}
                        </SelectItem>
                    ))}
                    <SelectItem key="add-new" textValue="Add new tag">
                        Add new tag
                    </SelectItem>
                </>
            </Select>
            <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>Add Tag</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Title"
                            labelPlacement="inside"
                            name="title"
                            value={newTagTitle}
                            onValueChange={setNewTagTitle}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddNewTag}>
                            Add Tag
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

