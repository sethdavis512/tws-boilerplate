export enum ThemeTypes {
    DARK = 'dark',
    LIGHT = 'light'
}

const themes: Array<ThemeTypes> = Object.values(ThemeTypes);

const prefersDarkMQ = '(prefers-color-scheme: dark)';

export const getPreferredTheme = () =>
    window.matchMedia(prefersDarkMQ).matches
        ? ThemeTypes.DARK
        : ThemeTypes.LIGHT;

export function isTheme(value: unknown): value is ThemeTypes {
    return typeof value === 'string' && themes.includes(value as ThemeTypes);
}
