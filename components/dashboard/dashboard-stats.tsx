import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, Users, TrendingUp } from "lucide-react"
import { getAllPosts } from "@/lib/blog"

export async function DashboardStats() {
  const posts = await getAllPosts()
  const publishedPosts = posts.filter((post) => post.published)
  const totalViews = Math.floor(Math.random() * 10000) + 5000
  const totalUsers = Math.floor(Math.random() * 500) + 100

  const stats = [
    {
      title: "Total Posts",
      value: publishedPosts.length,
      description: `${posts.length - publishedPosts.length} drafts`,
      icon: FileText,
      trend: "+12%",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      description: "Last 30 days",
      icon: Eye,
      trend: "+25%",
    },
    {
      title: "Subscribers",
      value: totalUsers.toLocaleString(),
      description: "Active readers",
      icon: Users,
      trend: "+8%",
    },
    {
      title: "Engagement",
      value: "4.2%",
      description: "Average engagement rate",
      icon: TrendingUp,
      trend: "+15%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
