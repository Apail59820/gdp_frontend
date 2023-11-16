export function sliceModelItem<T extends { id: number }>(
    array: Partial<T>[],
    id: number,
    updateObject?: { [key in keyof Partial<T>]?: any }
): Partial<T>[] {
    try {
        if (!Array.isArray(array) || typeof id !== 'number') {
            throw new Error(`Invalid arguments. Expected id: number...)`);
        }

        const itemIndex = array.findIndex(item => item.id === id);

        if (itemIndex !== -1) {
            return [
                ...array.slice(0, itemIndex),
                { ...array[itemIndex], ...updateObject },
                ...array.slice(itemIndex + 1),
            ];
        }
        return array;
    } catch (error) {
        console.error(`Error in sliceModelItem: ${error.message}`);
        return array;
    }
}
