import { gql } from '@apollo/client'

// Query for getting Kuru OrderBook trades
export const KuruOrderBook_Trade = gql`
  query KuruOrderBook_Trade {
    KuruOrderBook_Trade {
      id
      isBuy
      blockHeight
      db_write_timestamp
      filledSize
      makerAddress
      orderBookAddress
      orderId
      price
      takerAddress
      transactionHash
      txOrigin
      updatedSize
    }
  }
`

export const KuruDeployer_PumpingTime = gql`
  query KuruDeployer_PumpingTime {
    KuruDeployer_PumpingTime {
      id
      db_write_timestamp
      dev
      market
      supplyToDev
      token
      tokenURI
    }
  }
`

// Query for getting Wormhole Relayer Delivery data
export const WormholeRelayer_Delivery = gql`
  query WormholeRelayer_Delivery {
    WormholeRelayer_Delivery {
      id
      db_write_timestamp
      additionalStatusInfo
      deliveryVaaHash
      gasUsed
      overridesInfo
      refundStatus
      recipientContract
      sourceChain
      status
      sequence
    }
  }
`

// Query for getting Wormhole Relayer Send Event data
export const WormholeRelayer_SendEvent = gql`
  query WormholeRelayer_SendEvent {
    WormholeRelayer_SendEvent {
      id
      db_write_timestamp
      sequence
      deliveryQuote
      paymentForExtraReceiverValue
    }
  }
`

// Combined query for both Wormhole Relayer data types
export const WormholeRelayer_Combined = gql`
  query WormholeRelayer_Combined {
    WormholeRelayer_Delivery {
      id
      db_write_timestamp
      additionalStatusInfo
      deliveryVaaHash
      gasUsed
      overridesInfo
      refundStatus
      recipientContract
      sourceChain
      status
      sequence
    }
    WormholeRelayer_SendEvent {
      id
      db_write_timestamp
      sequence
      deliveryQuote
      paymentForExtraReceiverValue
    }
  }
`

// Query for getting APR MON TVL 1D data (staking data)
export const AprMonTVL1D = gql`
  query AprMonTVL1D {
    AprMonTVL1D {
      id
      db_write_timestamp
      lastUpdatedTimestamp
      openTimestamp
      c
      h
      l
      o
    }
  }
`

// Query for getting token data (original query for reference)
export const GET_TOKENS = gql`
  query GetTokens($first: Int!, $orderBy: String!, $orderDirection: String!) {
    tokens(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { volumeUSD_gt: "1000" }
    ) {
      id
      symbol
      name
      decimals
      totalSupply
      tradeVolume
      tradeVolumeUSD
      untrackedVolumeUSD
      txCount
      totalLiquidity
      derivedETH
    }
  }
`

// Query for getting pool data
export const GET_POOLS = gql`
  query GetPools($first: Int!) {
    pools(
      first: $first
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { totalValueLockedUSD_gt: "100000" }
    ) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      feeTier
      liquidity
      sqrtPrice
      tick
      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedUSD
      txCount
      volumeUSD
    }
  }
`

// Query for getting swap data
export const GET_SWAPS = gql`
  query GetSwaps($first: Int!) {
    swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      amount0
      amount1
      amountUSD
      sqrtPriceX96
      tick
      pool {
        id
        token0 {
          symbol
          name
        }
        token1 {
          symbol
          name
        }
      }
      transaction {
        id
        blockNumber
        gasUsed
        gasPrice
      }
    }
  }
`

// Query for getting liquidity positions
export const GET_POSITIONS = gql`
  query GetPositions($first: Int!) {
    positions(
      first: $first
      orderBy: liquidity
      orderDirection: desc
      where: { liquidity_gt: "0" }
    ) {
      id
      owner
      pool {
        id
        token0 {
          symbol
          name
        }
        token1 {
          symbol
          name
        }
        feeTier
      }
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
    }
  }
`

// Mock data for demonstration (when GraphQL is not available)
export const MOCK_CRYPTO_DATA = {
  tokens: [
    {
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3456.78,
      change24h: 5.67,
      volume24h: 12345678901,
      marketCap: 415684291234,
    },
    {
      id: '2',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67890.12,
      change24h: -2.34,
      volume24h: 23456789012,
      marketCap: 1342567890123,
    },
    {
      id: '3',
      symbol: 'USDC',
      name: 'USD Coin',
      price: 1.0001,
      change24h: 0.01,
      volume24h: 8765432109,
      marketCap: 35421789456,
    },
    {
      id: '4',
      symbol: 'UNI',
      name: 'Uniswap',
      price: 12.45,
      change24h: 8.92,
      volume24h: 1234567890,
      marketCap: 7456123789,
    },
    {
      id: '5',
      symbol: 'LINK',
      name: 'Chainlink',
      price: 23.78,
      change24h: -1.25,
      volume24h: 987654321,
      marketCap: 14567891234,
    },
  ],
  pools: [
    {
      id: '1',
      token0: { symbol: 'ETH', name: 'Ethereum' },
      token1: { symbol: 'USDC', name: 'USD Coin' },
      tvl: 125000000,
      volume24h: 45000000,
      fees24h: 135000,
    },
    {
      id: '2',
      token0: { symbol: 'BTC', name: 'Bitcoin' },
      token1: { symbol: 'ETH', name: 'Ethereum' },
      tvl: 89000000,
      volume24h: 32000000,
      fees24h: 96000,
    },
  ],
}
