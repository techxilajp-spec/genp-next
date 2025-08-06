"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-slate-900">Something went wrong!</CardTitle>
          <CardDescription className="text-slate-600">
            An error occurred while loading this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={reset}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
