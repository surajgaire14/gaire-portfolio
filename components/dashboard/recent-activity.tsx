import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, MessageCircle, Heart } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      type: "post",
      title: "New post published",
      description: "React Best Practices",
      time: "2 hours ago",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      type: "view",
      title: "Post viewed",
      description: "Next.js Tutorial - 45 views",
      time: "4 hours ago",
      icon: Eye,
      color: "bg-green-500",
    },
    {
      type: "comment",
      title: "New comment",
      description: "On 'JavaScript Tips'",
      time: "6 hours ago",
      icon: MessageCircle,
      color: "bg-yellow-500",
    },
    {
      type: "like",
      title: "Post liked",
      description: "TypeScript Guide - 12 likes",
      time: "8 hours ago",
      icon: Heart,
      color: "bg-red-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-black">Recent Activity</CardTitle>
        <CardDescription className="text-gray-900">Latest updates and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center`}>
                <activity.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black">{activity.title}</p>
                <p className="text-xs text-muted-foreground text-gray-900">{activity.description}</p>
                <p className="text-xs text-muted-foreground text-gray-900 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
