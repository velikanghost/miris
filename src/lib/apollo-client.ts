import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'

// Create HTTP link for Kuru OrderBook (original endpoint)
const orderBookLink = createHttpLink({
  uri: 'https://indexer.hyperindex.xyz/d17384e/v1/graphql',
})

// Create HTTP link for Kuru Deployer PumpingTime (second endpoint)
const pumpingTimeLink = createHttpLink({
  uri: 'https://indexer.dev.hyperindex.xyz/ac65d00/v1/graphql',
})

// Create HTTP link for Wormhole Relayer (third endpoint)
const wormholeRelayerLink = createHttpLink({
  uri: 'https://indexer.dev.hyperindex.xyz/846ab7e/v1/graphql',
})

// Create HTTP link for APR MON Staking (fourth endpoint)
const aprMonStakingLink = createHttpLink({
  uri: 'https://indexer.hyperindex.xyz/c4cb6ba/v1/graphql',
})

// Create auth link for authentication (if needed)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Add authentication token if available
      // authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Split link based on operation name to route to different endpoints
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    const operationName =
      definition.kind === 'OperationDefinition' ? definition.name?.value : ''

    // Route APR MON Staking queries to the fourth endpoint
    return operationName === 'AprMonTVL1D'
  },
  aprMonStakingLink, // Use APR MON staking endpoint for AprMonTVL1D queries
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      const operationName =
        definition.kind === 'OperationDefinition' ? definition.name?.value : ''

      // Route Wormhole Relayer queries to the third endpoint
      return Boolean(operationName?.includes('WormholeRelayer'))
    },
    wormholeRelayerLink, // Use wormhole relayer endpoint for WormholeRelayer queries
    split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.name?.value === 'KuruDeployer_PumpingTime'
        )
      },
      pumpingTimeLink, // Use pumping time endpoint for KuruDeployer_PumpingTime queries
      orderBookLink, // Use order book endpoint for all other queries
    ),
  ),
)

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([authLink, splitLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

export default client
