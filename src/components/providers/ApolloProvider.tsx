'use client'

import { ApolloProvider } from '@apollo/client'
import client from '@/lib/apollo-client'
import { ReactNode } from 'react'

interface ApolloProviderWrapperProps {
  children: ReactNode
}

export default function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
