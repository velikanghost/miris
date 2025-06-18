import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  split,
} from '@apollo/client'
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

// Create HTTP link for nad.fun (fifth endpoint)
const nadFunLink = createHttpLink({
  uri: 'https://naddotfun-e1d0201.dedicated.hyperindex.xyz/v1/graphql',
})

// Create HTTP link for Monorail pools (sixth endpoint)
const monorailLink = createHttpLink({
  uri: 'https://indexer.dev.hyperindex.xyz/1b99801/v1/graphql',
})

// Create HTTP link for Monorail DEX (seventh endpoint)
const monorailDexLink = createHttpLink({
  uri: 'https://indexer.hyperindex.xyz/298e7ad/v1/graphql',
})

// Create HTTP link for Amertis DEX (eighth endpoint)
const amertisDexLink = createHttpLink({
  uri: 'https://indexer.hyperindex.xyz/c886fca/v1/graphql',
})

// Create HTTP link for AprMONVault staking (ninth endpoint)
const aprMONVaultLink = createHttpLink({
  uri: 'https://indexer.dev.hyperindex.xyz/b127f56/v1/graphql',
})

// Create HTTP link for MagmaStaking (tenth endpoint)
const magmaStakingLink = createHttpLink({
  uri: 'https://indexer.dev.hyperindex.xyz/807bebd/v1/graphql',
})

// Split link based on operation name to route to different endpoints
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    const operationName =
      definition.kind === 'OperationDefinition' ? definition.name?.value : ''

    // Route MagmaStaking queries to the tenth endpoint
    return operationName === 'MagmaStaking_Deposit'
  },
  magmaStakingLink, // Use MagmaStaking endpoint
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      const operationName =
        definition.kind === 'OperationDefinition' ? definition.name?.value : ''

      // Route AprMONVault queries to the ninth endpoint
      return operationName === 'AprMONVault_Deposit'
    },
    aprMONVaultLink, // Use AprMONVault endpoint
    split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        const operationName =
          definition.kind === 'OperationDefinition'
            ? definition.name?.value
            : ''

        // Route Amertis DEX queries to the eighth endpoint
        return Boolean(
          operationName?.includes('Amertis') ||
            operationName?.includes('AmertisSwap'),
        )
      },
      amertisDexLink, // Use Amertis DEX endpoint
      split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          const operationName =
            definition.kind === 'OperationDefinition'
              ? definition.name?.value
              : ''

          // Route Monorail DEX queries to the seventh endpoint
          return Boolean(
            operationName?.includes('MonorailDex') ||
              operationName?.includes('SwapEvent'),
          )
        },
        monorailDexLink, // Use Monorail DEX endpoint
        split(
          ({ query }) => {
            const definition = getMainDefinition(query)
            const operationName =
              definition.kind === 'OperationDefinition'
                ? definition.name?.value
                : ''

            // Route Monorail queries to the sixth endpoint
            return Boolean(
              operationName?.includes('Monorail') ||
                operationName?.includes('Pool'),
            )
          },
          monorailLink, // Use monorail endpoint for pool queries
          split(
            ({ query }) => {
              const definition = getMainDefinition(query)
              const operationName =
                definition.kind === 'OperationDefinition'
                  ? definition.name?.value
                  : ''

              // Route nad.fun queries to the fifth endpoint
              return Boolean(
                operationName?.includes('NadFun') ||
                  operationName?.includes('IBondingCurveFactory') ||
                  operationName?.includes('BondingCurve') ||
                  operationName?.includes('UniswapV2'),
              )
            },
            nadFunLink, // Use nad.fun endpoint for degen queries
            split(
              ({ query }) => {
                const definition = getMainDefinition(query)
                const operationName =
                  definition.kind === 'OperationDefinition'
                    ? definition.name?.value
                    : ''

                // Route APR MON Staking queries to the fourth endpoint
                return operationName === 'AprMonTVL1D'
              },
              aprMonStakingLink, // Use APR MON staking endpoint for AprMonTVL1D queries
              split(
                ({ query }) => {
                  const definition = getMainDefinition(query)
                  const operationName =
                    definition.kind === 'OperationDefinition'
                      ? definition.name?.value
                      : ''

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
            ),
          ),
        ),
      ),
    ),
  ),
)

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([splitLink]),
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
