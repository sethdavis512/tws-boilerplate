export function getUniqueId(
    prefix = 'my-prefix',
    length = 8,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
) {
    const getRandomChar = (chars: string) =>
        chars.charAt(Math.floor(Math.random() * chars.length));

    const hash = [...Array(length)]
        .map(() => getRandomChar(characters))
        .join('');

    return `${prefix ? `${prefix}-` : ''}${hash}`;
}

export function getEnvVariable(key: string | undefined): string {
    if (key === undefined) {
        throw Error(`"Key is undefined`);
    }

    const value = process.env[key];

    if (!value) {
        throw Error(
            `Environment variable "${key}" does not exist on process.env`
        );
    }

    return value;
}
