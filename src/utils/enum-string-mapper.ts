export const fromEnumToString = <T extends { [key: string]: string | number }>(
    enumObj: T,
    value: T[keyof T]
): string => {
    const enumKey = Object.keys(enumObj).find(key => enumObj[key] === value);
    if (!enumKey) {
        throw new Error(`Value ${value} not found in enum`);
    }
    return enumKey;
}

export const fromStringToEnum = <T extends { [key: string]: string | number }>(
    enumObj: T,
    key: string
): T[keyof T] => {
    const enumValue = enumObj[key as keyof T];
    if (enumValue === undefined) {
        throw new Error(`Key ${key} not found in enum`);
    }
    return enumValue;
}
