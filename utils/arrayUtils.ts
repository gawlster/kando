export function isDeepEqual<T>(a: T, b: T): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!isDeepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!keysB.includes(key) || !isDeepEqual((a as any)[key], (b as any)[key])) return false;
        }
        return true;
    }
    return a === b;
}
