import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react"

interface CategoryStatsProps {
  stats: {
    totalCategories: number
    activeCategories: number
    totalPosts: number
    recentlyCreated: number
    mostPopular: {
      name: string
      _count: { posts: number }
    } | null
  }
}

export function CategoryStats({ stats }: CategoryStatsProps) {
  const activePercentage = stats.totalCategories > 0 ? (stats.activeCategories / stats.totalCategories) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={activePercentage} className="flex-1" />
            <span className="text-xs text-muted-foreground">{stats.activeCategories} active</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground">Across all categories</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">{stats.mostPopular?.name || "N/A"}</div>
          <Badge variant="secondary" className="mt-1">
            {stats.mostPopular?._count?.posts || 0} posts
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentlyCreated}</div>
          <p className="text-xs text-muted-foreground">New categories created</p>
        </CardContent>
      </Card>
    </div>
  )
}
