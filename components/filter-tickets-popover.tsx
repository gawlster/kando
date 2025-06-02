import { Button } from "@heroui/button";
import { Checkbox, CheckboxGroup, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
import { useAllUserTags } from "@/data/tags";
import { useTagFilters } from "@/hooks/useTagFilters";

export default function FilterTicketsPopover() {
    const { data: allUserTags } = useAllUserTags();
    const { tagFilters, setTagFilters } = useTagFilters();
    const [popoverOpen, setPopoverOpen] = useState(false);
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
