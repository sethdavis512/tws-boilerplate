import { type ActionFunctionArgs, json } from '@remix-run/node';
import invariant from 'tiny-invariant';

import { type ThemeTypes } from '~/utils/theme';
import { getThemeSession } from '~/utils/theme.server';

export async function action({ request }: ActionFunctionArgs) {
    const themeSession = await getThemeSession(request);
    const form = await request.formData();
    const themeSelection = form.get('themeSelection');

    invariant(themeSelection, 'themeSelection not available');

    themeSession.setTheme(themeSelection as ThemeTypes);

    return json(
        { success: true },
        { headers: { 'Set-Cookie': await themeSession.commit() } }
    );
}
