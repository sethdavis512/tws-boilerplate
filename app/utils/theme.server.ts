import { createCookieSessionStorage } from '@remix-run/node';

import { isTheme, ThemeTypes } from './theme';
import { getEnvVariable } from './string';

const sessionSecret = getEnvVariable('SESSION_SECRET');

const themeStorage = createCookieSessionStorage({
    cookie: {
        name: 'app_theme',
        secure: true,
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        httpOnly: true
    }
});

async function getThemeSession(request: Request) {
    const session = await themeStorage.getSession(
        request.headers.get('Cookie')
    );

    return {
        getTheme: () => {
            const themeValue = session.get('theme');
            return isTheme(themeValue) ? themeValue : ThemeTypes.LIGHT;
        },
        setTheme: (theme: ThemeTypes) => session.set('theme', theme),
        commit: () => themeStorage.commitSession(session)
    };
}

export { getThemeSession };
