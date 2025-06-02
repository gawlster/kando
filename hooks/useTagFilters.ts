import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useTagFilters() {
    const [tagFilters, setTagFilters] = useLocalStorage("tagFilters", "");
    return {
        tagFilters,
        setTagFilters
    }
}
