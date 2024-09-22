import React from 'react'
import { ModeToggle } from '../theme/toggler'

const Base = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div
            className='relative w-full h-full min-h-screen flex items-center '
        >
            {children}
            <div className="fixed top-4 right-4">
                <ModeToggle />
            </div>
        </div>
    )
}

export default Base
