import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Upload, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "New Post",
      description: "Create a new blog post",
      icon: PlusCircle,
      href: "/dashboard/posts/create",
      variant: "default" as const,
    },
    {
      title: "Upload Media",
      description: "Add images and files",
      icon: Upload,
      href: "/dashboard/media",
      variant: "outline" as const,
    },
    {
      title: "View Analytics",
      description: "Check your stats",
      icon: BarChart3,
      href: "/dashboard/analytics",
      variant: "outline" as const,
    },
    {
      title: "Settings",
      description: "Configure your blog",
      icon: Settings,
      href: "/dashboard/settings",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-black">Quick Actions</CardTitle>
        <CardDescription className="text-gray-900">Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.map((action) => (
          <Link key={action.title} href={action.href} className="w-full h-full">
            <Button variant={action.variant} className="w-full justify-start bg-primary text-white hover:bg-primary/90 py-6" size="sm">
              <action.icon className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium text-white/90">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
