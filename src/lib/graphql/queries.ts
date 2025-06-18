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

export const Amertis_Swap = gql`
  query Amertis_Swap {
    Swap(order_by: { db_write_timestamp: desc }) {
      _amountIn
      _amountOut
      _tokenIn
      _tokenOut
      db_write_timestamp
      from
      timeStamp
      id
    }
  }
`

export const Monorail_SwapEvent = gql`
  query Monorail_SwapEvent {
    SwapEvent(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      amountIn
      amountOut
      blockNumber
      exchangeName
      exchangeAddress
      fee
      gasUsed
      gasPrice
      timestamp
      tokenInAddress
      tokenOutAddress
      transactionHash
      userAddress
    }
  }
`

// Staking queries for AprMONVault and MagmaStaking
export const AprMONVault_Deposit = gql`
  query AprMONVault_Deposit {
    AprMONVault_Deposit(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      sender
      shares
      owner
    }
  }
`

export const MagmaStaking_Deposit = gql`
  query MagmaStaking_Deposit {
    MagmaStaking_Deposit(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      depositor
      amount
      gMonMinted
      referralId
    }
  }
`

// Withdrawal queries for AprMONVault and MagmaStaking
export const AprMONVault_Redeem = gql`
  query AprMONVault_Redeem {
    AprMONVault_Redeem(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      assets
      controller
      fee
      receiver
      requestId
      shares
    }
  }
`

export const MagmaStaking_Withdraw = gql`
  query MagmaStaking_Withdraw {
    MagmaStaking_Withdraw(order_by: { db_write_timestamp: desc }) {
      id
      db_write_timestamp
      gMonBurned
      amount
      withdrawer
    }
  }
`
