import { useMemo } from 'react';
import { useMatches } from '@remix-run/react';

export default function useMatchesData(
    id: string
): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );

    return route?.data as Record<string, unknown>;
}
