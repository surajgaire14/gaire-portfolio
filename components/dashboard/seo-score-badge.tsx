import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface SEOScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showProgress?: boolean
}

export function SEOScoreBadge({ score, size = "md", showProgress = false }: SEOScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", icon: CheckCircle }
    if (score >= 60) return { variant: "secondary" as const, text: "Good", icon: AlertCircle }
    return { variant: "destructive" as const, text: "Poor", icon: XCircle }
  }

  const scoreBadge = getScoreBadge(score)
  const Icon = scoreBadge.icon

  return (
    <div className="flex items-center gap-2">
      <div
        className={`font-bold ${getScoreColor(score)} ${
          size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
        }`}
      >
        {score}/100
      </div>
      <Badge variant={scoreBadge.variant} className={size === "sm" ? "text-xs" : "text-sm"}>
        <Icon className="w-3 h-3 mr-1" />
        {scoreBadge.text}
      </Badge>
      {showProgress && (
        <Progress value={score} className={`${size === "sm" ? "w-12 h-1" : size === "lg" ? "w-24 h-3" : "w-16 h-2"}`} />
      )}
    </div>
  )
}
