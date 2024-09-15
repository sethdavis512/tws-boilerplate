import { cx } from 'cva.config';

interface DividerProps {
    className?: string;
}

export default function Divider({ className }: DividerProps) {
    return (
        <hr
            className={cx(
                'my-4 h-px border-0 bg-zinc-200 dark:bg-zinc-700',
                className
            )}
        />
    );
}
