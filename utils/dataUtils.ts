export async function getAndThrowError(res: Response, defaultErrorMessage: string): Promise<void> {
    let errorMessage = defaultErrorMessage;
    try {
        const json = await res.json();
        if (json.error) {
            errorMessage = json.error;
        }
    } catch (_) {
    }
    throw new Error(errorMessage);
}
