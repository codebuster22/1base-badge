import React, { useState } from 'react'
import { ContributionBadge } from './components/contribution-badge'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { getAddress, getName } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

function App() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<{
    transactions: number;
    volume: number;
    basename?: string;
  } | null>(null)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('Form submitted')
    
    try {
      let walletAddress = input
      console.log('Initial wallet address:', walletAddress)
      
      // If input is a .base.eth name, resolve the address first
      if (input.endsWith('.base.eth')) {
        walletAddress = (await getAddress({ name: input, chain: base })) as `0x${string}`
        console.log('Resolved .base.eth address:', walletAddress)
      }

      // Get wallet stats from Moralis
      console.log('Fetching wallet stats...')
      const statsResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/stats?chain=base`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY || ''
          }
        }
      )
      const statsData = await statsResponse.json()
      console.log('Stats data:', statsData)

      // Get profitability data from Moralis 
      console.log('Fetching profitability data...')
      const profitResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/profitability/summary?chain=base`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY || ''
          }
        }
      )
      const profitData = await profitResponse.json()
      console.log('Profit data:', profitData)

      // Get basename
      console.log('Fetching basename...')
      const basename = await getName({ address: walletAddress as `0x${string}`, chain: base })
      console.log('Basename:', basename)
      
      setStats({
        transactions: parseInt(statsData.transactions.total),
        volume: parseFloat(profitData.total_trade_volume),
        basename: basename as string
      })
      console.log('Stats updated successfully')
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
      console.log('Loading state reset')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold text-[rgb(0,82,255)]">Contribution to 1B(ase)</h1>
        {!stats ? (
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter address or Basename"
                  className="w-full p-2 border rounded-md"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading || !input}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <ContributionBadge
            name={stats.basename || formatAddress(input)}
            totalTransactions={stats.transactions}
            totalVolume={stats.volume}
          />
        )}
      </div>
    </div>
  )
}

export default App