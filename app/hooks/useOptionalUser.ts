import { User } from '@prisma/client';
import useMatchesData from './useMatchesData';

function isUser(user: unknown): user is User {
    return (
        user != null &&
        typeof user === 'object' &&
        'email' in user &&
        typeof user.email === 'string'
    );
}

export function useOptionalUser(): User | undefined {
    const data = useMatchesData('root');
    if (!data || !isUser(data.user)) {
        return undefined;
    }

    return data.user;
}
