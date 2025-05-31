import { useFetch } from "@/hooks/useFetch";
import { Button } from "@heroui/button";
import { Checkbox, CheckboxGroup, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useContext, useState } from "react";
import {
    type ResponseType as AllUserTagsResponse,
    url as alUserTagsUrl
} from "../pages/api/getAllUserTags";
import { TagFiltersContext } from "@/pages";

export default function FilterTicketsPopover() {
    const [tagFilters, setTagFilters] = useContext(TagFiltersContext);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { data: allUserTags } = useFetch<AllUserTagsResponse>(alUserTagsUrl)
    return (
        <Popover placement="bottom-start" isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
                <Button>
                    Filter Tickets
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <CheckboxGroup value={tagFilters.split(",")} onValueChange={(values) => setTagFilters(values.join(","))}>
                    {allUserTags?.map((tag) => (
                        <Checkbox
                            key={tag.id}
                            value={tag.id.toString()}
                        >
                            {tag.title}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </PopoverContent>
        </Popover>
    );
}
