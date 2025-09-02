import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, CheckCircle, AlertCircle, Target, FileText, Globe, BarChart3, Users } from "lucide-react"

interface SEOOverviewProps {
  totalPosts: number
  publishedPosts: number
  avgSEOScore: number
  highSEOPosts: number
  needsOptimization: number
  totalViews: number
  totalClicks: number
}

export function PostsSEOOverview({
  totalPosts,
  publishedPosts,
  avgSEOScore,
  highSEOPosts,
  needsOptimization,
  totalViews,
  totalClicks,
}: SEOOverviewProps) {
  const draftPosts = totalPosts - publishedPosts
  const optimizationRate = totalPosts > 0 ? (highSEOPosts / totalPosts) * 100 : 0
  const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content Library</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPosts}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="text-xs">
              {publishedPosts} live
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {draftPosts} drafts
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {publishedPosts > 0
              ? `${Math.round((publishedPosts / totalPosts) * 100)}% published`
              : "No published posts"}
          </p>
        </CardContent>
      </Card>

      {/* SEO Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SEO Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              avgSEOScore >= 80 ? "text-green-600" : avgSEOScore >= 60 ? "text-yellow-600" : "text-red-600"
            }`}
          >
            {Math.round(avgSEOScore)}/100
          </div>
          <Progress value={avgSEOScore} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">Average across all posts</p>
        </CardContent>
      </Card>

      {/* Well Optimized */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Well Optimized</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{highSEOPosts}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={optimizationRate} className="flex-1 h-2" />
            <span className="text-xs font-medium">{Math.round(optimizationRate)}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Posts with 80+ SEO score</p>
        </CardContent>
      </Card>

      {/* Needs Optimization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{needsOptimization}</div>
          <div className="flex items-center gap-1 mt-2">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {totalPosts > 0 ? Math.round((needsOptimization / totalPosts) * 100) : 0}% of total
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Posts below 60 SEO score</p>
        </CardContent>
      </Card>

      {/* Traffic Overview */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Traffic Overview</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Clicks</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">CTR: {avgCTR.toFixed(1)}%</span>
            <Progress value={avgCTR} className="flex-1 h-2" />
          </div>
        </CardContent>
      </Card>

      {/* SEO Health Summary */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SEO Health Summary</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Content Quality</span>
              <div className="flex items-center gap-2">
                <Progress value={75} className="w-20 h-2" />
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Technical SEO</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-20 h-2" />
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Keyword Optimization</span>
              <div className="flex items-center gap-2">
                <Progress value={60} className="w-20 h-2" />
                <span className="text-sm font-medium">60%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
