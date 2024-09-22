import { ThemeProvider } from '@/providers/theme-provider'
import React from 'react'

const BaseProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}

export default BaseProvider
