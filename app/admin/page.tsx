import Link from "next/link"
import { Building, Award, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

export default async function AdminDashboard() {
  const projectCount = await db.project.count()
  const awardCount = await db.award.count()
  const postCount = await db.post.count()
  const categoryCount = await db.category.count()
  const memebersCount = await db.leadership.count()

  return (
    <div className="grid gap-4 max-h-screen overflow-hidden">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
      <Link href="/admin/categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Category</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoryCount}</div>
              <p className="text-xs text-muted-foreground">Manage your construction projects</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectCount}</div>
              <p className="text-xs text-muted-foreground">Manage your construction projects</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/awards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{awardCount}</div>
              <p className="text-xs text-muted-foreground">Showcase your achievements</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/leadership">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memebersCount}</div>
              <p className="text-xs text-muted-foreground">Manage your Team.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blog">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postCount}</div>
              <p className="text-xs text-muted-foreground">Share your company news</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Welcome to your CMS dashboard. From here, you can manage all your content.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/admin/projects/new">
              <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm hover:bg-muted/80">
                <Building className="h-4 w-4" />
                <span>Add New Project</span>
              </div>
            </Link>
            <Link href="/admin/awards/new">
              <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm hover:bg-muted/80">
                <Award className="h-4 w-4" />
                <span>Add New Award</span>
              </div>
            </Link>
            <Link href="/admin/blog/new">
              <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm hover:bg-muted/80">
                <FileText className="h-4 w-4" />
                <span>Write New Blog Post</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

