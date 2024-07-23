export const timeout = async(milisec: number): Promise<void> => {
    return new Promise((resolve: (data: void) => void) => {
        setTimeout(resolve, milisec);
    });
};

export const getParam = (text: string, findKey: string): string | null => {
    const pairs_separator = ";";
    const key_val_separator = "=";

    const pairs = text.split(pairs_separator);
    for (const pair of pairs) {
        const key = pair.split(key_val_separator)[0] ?? null;
        const val = pair.split(key_val_separator)[1] ?? null;

        if (key === findKey) {
            return val;
        }
    }
    return null;
};
