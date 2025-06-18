import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

interface Token {
  id: string
  address: string
  name: string
  symbol: string
  decimals: string
  categories: string[]
  balance: string
  mon_per_token: string
  pconf: string
  mon_value: string
}

interface TokenMap {
  [address: string]: {
    name: string
    symbol: string
    decimals: string
  }
}

export const useTokenData = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch token data from Monorail API
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true)
        const response = await axios.get<Token[]>(
          'https://testnet-api.monorail.xyz/v1/tokens/category/verified?offset=0&limit=500',
        )
        setTokens(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch token data:', err)
        setError('Failed to fetch token data')
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  // Create a map for quick address lookup
  const tokenMap = useMemo<TokenMap>(() => {
    return tokens.reduce((map, token) => {
      // Normalize address to lowercase for consistent lookup
      const normalizedAddress = token.address.toLowerCase()
      map[normalizedAddress] = {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
      }
      return map
    }, {} as TokenMap)
  }, [tokens])

  // Function to resolve token address to token info
  const resolveToken = (address: string) => {
    const normalizedAddress = address.toLowerCase()
    return tokenMap[normalizedAddress] || null
  }

  // Function to get token display name (symbol if available, otherwise shortened address)
  const getTokenDisplayName = (address: string) => {
    const token = resolveToken(address)
    if (token && token.symbol && token.symbol.trim() !== '') {
      return token.symbol
    }
    // Fallback to shortened address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Function to get token full info with fallback
  const getTokenInfo = (address: string) => {
    const token = resolveToken(address)
    if (token && token.name && token.name.trim() !== '') {
      return {
        name: token.name,
        symbol: token.symbol,
        address: address,
        displayName: token.symbol || token.name,
      }
    }
    // Fallback for unknown tokens
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
    return {
      name: shortAddress,
      symbol: shortAddress,
      address: address,
      displayName: shortAddress,
    }
  }

  return {
    tokens,
    tokenMap,
    loading,
    error,
    resolveToken,
    getTokenDisplayName,
    getTokenInfo,
  }
}
