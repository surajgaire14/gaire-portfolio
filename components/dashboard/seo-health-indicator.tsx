import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from "lucide-react"

interface SEOCheck {
  type: string
  status: "good" | "warning" | "error"
  message: string
}

interface SEOHealthIndicatorProps {
  score: number
  checks: SEOCheck[]
  compact?: boolean
}

export function SEOHealthIndicator({ score, checks, compact = false }: SEOHealthIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { variant: "secondary" as const, text: "Good", color: "bg-yellow-100 text-yellow-800" }
    return { variant: "destructive" as const, text: "Needs Work", color: "bg-red-100 text-red-800" }
  }

  const scoreBadge = getScoreBadge(score)

  const goodChecks = checks.filter((c) => c.status === "good").length
  const warningChecks = checks.filter((c) => c.status === "warning").length
  const errorChecks = checks.filter((c) => c.status === "error").length

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}/100</div>
          <Badge variant={scoreBadge.variant} className="text-xs">
            {scoreBadge.text}
          </Badge>
        </div>
        <Progress value={score} className="h-2" />
        <div className="flex items-center gap-3 text-xs">
          {goodChecks > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              {goodChecks}
            </div>
          )}
          {warningChecks > 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <AlertCircle className="w-3 h-3" />
              {warningChecks}
            </div>
          )}
          {errorChecks > 0 && (
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="w-3 h-3" />
              {errorChecks}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            SEO Health Score
          </CardTitle>
          <Badge variant={scoreBadge.variant} className={`${scoreBadge.color} text-xs`}>
            {scoreBadge.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="text-sm text-muted-foreground">/100</div>
          <div className="flex-1">
            <Progress value={score} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-bold">{goodChecks}</span>
            </div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-yellow-600">
              <AlertCircle className="w-4 h-4" />
              <span className="font-bold">{warningChecks}</span>
            </div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="font-bold">{errorChecks}</span>
            </div>
            <div className="text-xs text-muted-foreground">Issues</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Recent Checks:</div>
          {checks.slice(0, 3).map((check, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {check.status === "good" && <CheckCircle className="w-3 h-3 text-green-600" />}
              {check.status === "warning" && <AlertCircle className="w-3 h-3 text-yellow-600" />}
              {check.status === "error" && <XCircle className="w-3 h-3 text-red-600" />}
              <span className="text-muted-foreground">{check.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
