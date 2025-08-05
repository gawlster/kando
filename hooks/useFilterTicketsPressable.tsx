import { Checkbox, CheckboxGroup, Popover, PopoverContent } from "@heroui/react";
import { useCallback, useState } from "react";
import { useAllUserTags } from "@/data/tags";
import { useTagFilters } from "@/hooks/useTagFilters";

export default function useFilterTicketsPressable() {
    const { data: allUserTags } = useAllUserTags();
    const { tagFilters, setTagFilters } = useTagFilters();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const onPress = useCallback(() => {
        setPopoverOpen((prev) => !prev);
    }, []);
    return {
        onPress,
        popover: (
            <Popover placement="bottom-start" isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
                <></>
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
        )
    }
}
