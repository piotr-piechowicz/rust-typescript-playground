import moment from "moment";

export const timeout = async(milisec: number): Promise<void> => {
    return new Promise((resolve: (data: void) => void) => {
        setTimeout(resolve, milisec);
    });
};

export const getParam = (text: string, findKey: string, pairs_separator?: string, key_val_separator?: string): string | null => {
    const pairs_sep = pairs_separator ?? ";";
    const key_val_sep = key_val_separator ?? "=";

    const pairs = text.split(pairs_sep);
    for (const pair of pairs) {
        const key = pair.split(key_val_sep)[0] ?? null;
        const val = pair.split(key_val_sep)[1] ?? null;

        if (key === findKey) {
            return val;
        }
    }
    return null;
};

export const convertMicrosecondsToDate = (timestampMicroseconds: string) => {
    const timestampSeconds = parseInt(timestampMicroseconds) / 1000000;
    return moment.unix(timestampSeconds).format('YYYY-MM-DD');
};

// TODO: add unit test library

