import React from 'react'
import { ModeToggle } from '../theme/toggler'

const Base = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div
            className='relative w-full h-full bg-gradient-to-br bg-muted-foreground dark:bg-neutral-600'
        >
            {children}
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
        </div>
    )
}

export default Base
