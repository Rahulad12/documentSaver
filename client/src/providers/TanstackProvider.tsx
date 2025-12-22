import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import React from 'react'

interface TanstackProviderProps {
    children: React.ReactNode
}
const TanstackProvider = ({ children }: TanstackProviderProps) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default TanstackProvider
