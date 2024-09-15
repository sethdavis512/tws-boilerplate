import { type ReactNode } from 'react';
import { Button, IconButton } from '@radix-ui/themes';
import {
    PanelBottomCloseIcon,
    PanelLeftCloseIcon,
    PanelRightCloseIcon
} from 'lucide-react';
import { cva, cx } from 'cva.config';

interface DrawerProps {
    children: ReactNode;
    id: string;
    backdrop?: boolean;
    className?: string;
    heading?: string;
    isOpen?: boolean;
    handleClose?: () => void;
    position?: 'left' | 'right' | 'bottom';
    size?: 'sm' | 'md' | 'lg' | 'full';
}

const drawerVariants = cva({
    variants: {
        position: {
            left: `top-0 left-0 h-screen -translate-x-full rounded-tr-lg rounded-br-lg`,
            right: `top-0 right-0 h-screen translate-x-full rounded-tl-lg rounded-bl-lg`,
            bottom: `w-full bottom-0 translate-y-full rounded-tl-lg rounded-tr-lg`
        },
        isOpen: {
            true: 'transform-none'
        },
        size: {
            sm: 'w-96',
            md: 'w-1/2',
            lg: 'w-3/4',
            full: 'w-[calc(100vw_-_75px)]'
        }
    },
    compoundVariants: [
        {
            position: 'bottom',
            size: 'sm',
            className: 'w-full h-96'
        },
        {
            position: 'bottom',
            size: 'md',
            className: 'w-full h-1/2'
        },
        {
            position: 'bottom',
            size: 'lg',
            className: 'w-full h-3/4'
        },
        {
            position: 'bottom',
            size: 'full',
            className: 'w-full h-[calc(100vh_-_25px)] mt-4'
        }
    ],
    defaultVariants: {
        position: 'left'
    }
});

export function Drawer({
    children,
    className,
    id,
    isOpen = false,
    position = 'left',
    handleClose = () => {},
    backdrop = true,
    size = 'sm'
}: DrawerProps) {
    const drawerClassName = cx(
        `fixed z-50 overflow-y-auto transition-transform delay-250 bg-zinc-900 border-r dark:border-r-zinc-700`,
        drawerVariants({ position, className, size, isOpen })
    );

    const orientedIcon =
        position === 'bottom' ? (
            <PanelBottomCloseIcon />
        ) : position === 'left' ? (
            <PanelLeftCloseIcon />
        ) : position === 'right' ? (
            <PanelRightCloseIcon />
        ) : null;

    return (
        <>
            <div
                id={id}
                className={drawerClassName}
                tabIndex={-1}
                aria-labelledby={`${id}-label`}
            >
                <div className="flex flex-col">
                    <div className="border-b border-zinc-700 p-4">
                        <IconButton onClick={handleClose}>
                            {orientedIcon}
                        </IconButton>
                    </div>
                    <div className="p-4">{children}</div>
                </div>
            </div>
            {backdrop && (
                // eslint-disable-next-line
                <div
                    onClick={handleClose}
                    className={`fixed inset-0 z-40 bg-white transition-opacity duration-1000 dark:bg-zinc-800 ${
                        // TODO: Remove hidden class so that backdrop fades out properly
                        isOpen ? 'opacity-70' : 'hidden opacity-0'
                    }`}
                />
            )}
        </>
    );
}
