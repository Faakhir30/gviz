import React from 'react'
import { MouseEvent } from 'react'
interface ButtonProps {
    className?: string
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    children?: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}

const Button = ({ disabled, children, className, onClick }: ButtonProps) => {
    return (
        <button
            className={`inline-flex items-center justify-center rounded-lg bg-primary-medium-dark px-5 py-3 text-center text-base font-medium text-white ${
                disabled ? 'dark:bg-dark-gray' : 'dark:bg-primary-light'
            } dark:text-black ${className}`}
            disabled={disabled || false}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
