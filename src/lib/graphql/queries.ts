import { gql } from '@apollo/client'

// Query for getting Kuru OrderBook trades
export const KuruOrderBook_Trade = gql`
  query KuruOrderBook_Trade {
    KuruOrderBook_Trade(order_by: { db_write_timestamp: desc }) {
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
    KuruDeployer_PumpingTime(order_by: { db_write_timestamp: desc }, limit: 5) {
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
    WormholeRelayer_Delivery(order_by: { db_write_timestamp: desc }) {
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
    WormholeRelayer_SendEvent(order_by: { db_write_timestamp: desc }) {
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
    WormholeRelayer_Delivery(order_by: { db_write_timestamp: desc }) {
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
    WormholeRelayer_SendEvent(order_by: { db_write_timestamp: desc }) {
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

// nad.fun GraphQL queries for degen tab
export const NadFun_IBondingCurveFactory_Create = gql`
  query NadFun_IBondingCurveFactory_Create {
    IBondingCurveFactory_Create(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      name
      owner
      symbol
      curve
      token
      tokenURI
      virtualToken
      virtualNative
    }
  }
`

export const NadFun_BondingCurve_Listing = gql`
  query NadFun_BondingCurve_Listing {
    BondingCurve_Listing(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      listingTokenAmount
      listingWNativeAmount
      pair
      token
      curve
    }
  }
`

export const NadFun_BondingCurve_Sync = gql`
  query NadFun_BondingCurve_Sync {
    BondingCurve_Sync(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      token
      reserveToken
      reserveWNative
      virtualWNative
    }
  }
`

export const NadFun_UniswapV2Factory_PairCreated = gql`
  query NadFun_UniswapV2Factory_PairCreated {
    UniswapV2Factory_PairCreated(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      pair
      token0
      token1
      _3
    }
  }
`

export const NadFun_UniswapV2Pair_Sync = gql`
  query NadFun_UniswapV2Pair_Sync {
    UniswapV2Pair_Sync(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      pair
      reserve0
      reserve1
    }
  }
`

// Combined query for all nad.fun degen data
export const NadFun_Combined = gql`
  query NadFun_Combined {
    IBondingCurveFactory_Create(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      name
      owner
      symbol
      curve
      token
      tokenURI
      virtualToken
      virtualNative
    }
    BondingCurve_Listing(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      listingTokenAmount
      listingWNativeAmount
      pair
      token
      curve
    }
    BondingCurve_Sync(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      token
      reserveToken
      reserveWNative
      virtualWNative
    }
    UniswapV2Factory_PairCreated(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      pair
      token0
      token1
      _3
    }
    UniswapV2Pair_Sync(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      pair
      reserve0
      reserve1
    }
  }
`

// Monorail pools GraphQL query
export const Monorail_Pools = gql`
  query Monorail_Pools {
    Pool(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      factory
      fee
      pool
      tickSpacing
      token0
      token1
    }
  }
`

// New DEX queries for combined indexer
export const Ambient_CrocSwap = gql`
  query Ambient_CrocSwap {
    Ambient_CrocSwap {
      id
      base
      baseFlow
      inBaseQty
      isBuy
      limitPrice
      minOut
      poolIdx
      qty
      quote
      quoteFlow
      reserveFlags
      tip
    }
  }
`

export const Clober_Swap = gql`
  query Clober_Swap {
    Clober_Swap {
      id
      amountIn
      amountOut
      inToken
      method
      outToken
      router
      user
    }
  }
`

// New Staking queries for combined indexer
export const AprMon_Deposit = gql`
  query AprMon_Deposit {
    AprMon_Deposit {
      id
      assets
      owner
      sender
      shares
    }
  }
`

export const AprMon_Redeem = gql`
  query AprMon_Redeem {
    AprMon_Redeem {
      id
      assets
      shares
      controller
      fee
      receiver
      requestId
    }
  }
`

export const Magma_Deposit = gql`
  query Magma_Deposit {
    Magma_Deposit {
      id
      amount
      depositor
      gMonMinted
      referralId
    }
  }
`

export const Magma_Withdraw = gql`
  query Magma_Withdraw {
    Magma_Withdraw {
      id
      amount
      withdrawer
      gMonBurned
    }
  }
`
