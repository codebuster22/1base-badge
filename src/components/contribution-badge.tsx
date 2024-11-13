import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { CircularProgress } from "./circular-progress"
import { Download, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'

interface ContributionBadgeProps {
  percentage: number
  name: string
  totalTransactions: number
  totalVolume: number
}

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k'
  return num.toString()
}

export function ContributionBadge({
  name,
  totalTransactions,
  totalVolume
}: ContributionBadgeProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const formattedTotalTransactions = formatNumber(totalTransactions)
  const formattedTotalVolume = formatNumber(totalVolume)

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current)
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = '1base-contribution-badge.png'
      link.click()
    }
  }

  const handleShare = () => {
    const tweetText = `Check out my 1B(ase) contribution! ${formattedTotalTransactions} transactions out of 1 Billion. Total volume: $${formattedTotalVolume}`
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(tweetUrl, '_blank')
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="w-full max-w-sm mx-auto" ref={cardRef}>
        <CardHeader>
          <CardTitle className="text-center text-[rgb(0,82,255)]">1B(ase)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CircularProgress transactions={totalTransactions} color="rgb(0,82,255)" />
          <p className="text-sm text-[rgb(0,82,255)]">
            {formattedTotalTransactions} out of 1 Billion
          </p>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[rgb(0,82,255)]">{name}</h3>
            <p className="text-sm text-[rgb(0,82,255)]">Total Transactions: {formattedTotalTransactions}</p>
            <p className="text-sm text-[rgb(0,82,255)]">Total Volume: ${formattedTotalVolume}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4">
        <Button onClick={handleDownload} className="flex items-center bg-[rgb(0,82,255)] hover:bg-[rgb(0,82,255)]/90">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button onClick={handleShare} className="flex items-center bg-[rgb(0,82,255)] hover:bg-[rgb(0,82,255)]/90">
          <Share2 className="w-4 h-4 mr-2" />
          Share on Twitter
        </Button>
      </div>
    </div>
  )
}