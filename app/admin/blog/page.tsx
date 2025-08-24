import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  BarChart3,
  Target,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { PostsTableActions } from "@/components/dashboard/posts-table-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// SEO Score calculation function
function calculateSEOScore(post: any) {
  let score = 0
  const checks: { type: string; status: string; message: string }[] = []

  // Title optimization (0-25 points)
  if (post.title.length >= 30 && post.title.length <= 60) {
    score += 15
    checks.push({ type: "title", status: "good", message: "Title length optimal" })
  } else if (post.title.length > 0) {
    score += 8
    checks.push({ type: "title", status: "warning", message: "Title length needs optimization" })
  } else {
    checks.push({ type: "title", status: "error", message: "Missing title" })
  }

  // Meta description (0-25 points)
  // if (post.description && post.description.length >= 120 && post.description.length <= 160) {
  //   score += 20
  //   checks.push({ type: "description", status: "good", message: "Meta description optimal" })
  // } else if (post.description && post.description.length > 0) {
  //   score += 10
  //   checks.push({ type: "description", status: "warning", message: "Meta description needs optimization" })
  // } else {
  //   checks.push({ type: "description", status: "error", message: "Missing meta description" })
  // }

  // Content length (0-20 points)
  const wordCount = post.content ? post.content.split(/\s+/).length : 0
  if (wordCount >= 1000) {
    score += 20
    checks.push({ type: "content", status: "good", message: `${wordCount} words - excellent` })
  } else if (wordCount >= 300) {
    score += 12
    checks.push({ type: "content", status: "warning", message: `${wordCount} words - good` })
  } else {
    checks.push({ type: "content", status: "error", message: `${wordCount} words - too short` })
  }

  // Focus keyword (0-15 points)
  if (post.focusKeyword) {
    score += 15
    checks.push({ type: "keyword", status: "good", message: "Focus keyword set" })
  } else {
    checks.push({ type: "keyword", status: "error", message: "Missing focus keyword" })
  }

  // Tags (0-10 points)
  if (post.tags && post.tags.length >= 3) {
    score += 10
    checks.push({ type: "tags", status: "good", message: `${post.tags.length} tags` })
  } else if (post.tags && post.tags.length > 0) {
    score += 5
    checks.push({ type: "tags", status: "warning", message: `${post.tags.length} tags - add more` })
  } else {
    checks.push({ type: "tags", status: "error", message: "No tags" })
  }

  // SEO data completeness (0-5 points)
  if (post.seoData && Object.keys(post.seoData).length > 0) {
    score += 5
    checks.push({ type: "seo", status: "good", message: "SEO data configured" })
  } else {
    checks.push({ type: "seo", status: "warning", message: "SEO data incomplete" })
  }

  return { score: Math.min(score, 100), checks }
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  // Calculate SEO scores for all posts
  const postsWithSEO = posts.map((post) => ({
    ...post,
    seoAnalysis: calculateSEOScore(post),
  }))

  // SEO Statistics
  const totalPosts = posts.length
  const publishedPosts = posts.filter((p) => p.published).length
  const draftPosts = totalPosts - publishedPosts
  const avgSEOScore = postsWithSEO.reduce((acc, post) => acc + post.seoAnalysis.score, 0) / totalPosts || 0
  const highSEOPosts = postsWithSEO.filter((p) => p.seoAnalysis.score >= 80).length
  const needsOptimization = postsWithSEO.filter((p) => p.seoAnalysis.score < 60).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Posts & SEO Management</h1>
          <p className="text-muted-foreground text-gray-900">Manage your blog posts with comprehensive SEO optimization.</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary text-white hover:bg-primary/90">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* SEO Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published, {draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg SEO Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgSEOScore)}/100</div>
            <Progress value={avgSEOScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Well Optimized</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{highSEOPosts}</div>
            <p className="text-xs text-muted-foreground">Posts with 80+ SEO score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Needs Optimization</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{needsOptimization}</div>
            <p className="text-xs text-muted-foreground">Posts below 60 SEO score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="text-black">All Posts</TabsTrigger>
            <TabsTrigger value="published" className="text-black">Published</TabsTrigger>
            <TabsTrigger value="drafts" className="text-black">Drafts</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search posts..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">All Posts</CardTitle>
              <CardDescription className="text-gray-900">Complete list of all your blog posts with SEO analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Title & SEO Score</TableHead>
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black">Performance</TableHead>
                    <TableHead className="text-black">SEO Health</TableHead>
                    <TableHead className="text-black">Date</TableHead>
                    <TableHead className="text-right text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postsWithSEO.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-black">{post.title}</div>
                            {post.isExternal && <ExternalLink className="w-4 h-4 text-blue-600" />}
                          </div>
                          {post.description && (
                            <div className="text-sm text-muted-foreground text-gray-900 line-clamp-1">{post.description}</div>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium text-black">SEO Score:</div>
                            <div
                              className={`text-xs font-bold ${
                                post.seoAnalysis.score >= 80
                                  ? "text-green-600"
                                  : post.seoAnalysis.score >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {post.seoAnalysis.score}/100
                            </div>
                            <Progress value={post.seoAnalysis.score} className="w-16 h-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={post.published ? "outline" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          {post.focusKeyword && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Target className="w-3 h-3" />
                              {post.focusKeyword}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            {Math.floor(Math.random() * 1000)} views
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            {Math.floor(Math.random() * 100)} clicks
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {post.seoAnalysis.checks.slice(0, 2).map((check: any, index: number) => (
                            <div key={index} className="flex items-center gap-1 text-xs">
                              {check.status === "good" && <CheckCircle className="w-3 h-3 text-green-600" />}
                              {check.status === "warning" && <AlertCircle className="w-3 h-3 text-yellow-600" />}
                              {check.status === "error" && <AlertCircle className="w-3 h-3 text-red-600" />}
                              <span className="text-muted-foreground">{check.message}</span>
                            </div>
                          ))}
                          {post.seoAnalysis.checks.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{post.seoAnalysis.checks.length - 2} more checks
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <PostsTableActions post={post} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Published Posts</CardTitle>
              <CardDescription>Live posts visible to your audience.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>SEO Score</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postsWithSEO
                    .filter((post) => post.published)
                    .map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            {post.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">{post.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`text-sm font-bold ${
                                post.seoAnalysis.score >= 80
                                  ? "text-green-600"
                                  : post.seoAnalysis.score >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {post.seoAnalysis.score}/100
                            </div>
                            <Progress value={post.seoAnalysis.score} className="w-20 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            {Math.floor(Math.random() * 1000)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <PostsTableActions post={post} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Posts</CardTitle>
              <CardDescription>Unpublished posts in progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>SEO Readiness</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postsWithSEO
                    .filter((post) => !post.published)
                    .map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            {post.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">{post.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`text-sm font-bold ${
                                post.seoAnalysis.score >= 80
                                  ? "text-green-600"
                                  : post.seoAnalysis.score >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {post.seoAnalysis.score}/100
                            </div>
                            <Badge variant={post.seoAnalysis.score >= 80 ? "default" : "secondary"} className="text-xs">
                              {post.seoAnalysis.score >= 80 ? "Ready" : "Needs Work"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {new Date(post.updatedAt || post.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <PostsTableActions post={post} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="needs-seo">
          <Card>
            <CardHeader>
              <CardTitle>Posts Needing SEO Optimization</CardTitle>
              <CardDescription>Posts with SEO scores below 60 that need attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>SEO Issues</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postsWithSEO
                    .filter((post) => post.seoAnalysis.score < 60)
                    .map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            {post.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">{post.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {post.seoAnalysis.checks
                              .filter((check: any) => check.status === "error")
                              .slice(0, 2)
                              .map((check: any, index: number) => (
                                <div key={index} className="flex items-center gap-1 text-xs text-red-600">
                                  <AlertCircle className="w-3 h-3" />
                                  {check.message}
                                </div>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-red-600">{post.seoAnalysis.score}/100</div>
                            <Progress value={post.seoAnalysis.score} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <PostsTableActions post={post} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
