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
  BookOpen,
  BarChart3,
  Target,
  Globe,
  Star,
  Users,
} from "lucide-react"
import Link from "next/link"
import { TutorialsTableActions } from "@/components/dashboard/tutorials-table-actions"
import { prisma } from "@/lib/prisma"

// Get all tutorials with author information
async function getAllTutorials() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    })
    return tutorials
  } catch (error) {
    console.error('Error fetching tutorials:', error)
    return []
  }
}

// Calculate tutorial statistics
function calculateTutorialStats(tutorials: any[]) {
  const totalTutorials = tutorials.length
  const featuredTutorials = tutorials.filter(t => t.featured).length
  const beginnerTutorials = tutorials.filter(t => t.difficulty === 'beginner').length
  const intermediateTutorials = tutorials.filter(t => t.difficulty === 'intermediate').length
  const advancedTutorials = tutorials.filter(t => t.difficulty === 'advanced').length
  
  // Calculate average duration (assuming duration is in format like "2 hours", "30 minutes")
  const totalMinutes = tutorials.reduce((acc, tutorial) => {
    const duration = tutorial.duration.toLowerCase()
    if (duration.includes('hour')) {
      const hours = parseInt(duration.match(/(\d+)/)?.[1] || '0')
      return acc + (hours * 60)
    } else if (duration.includes('minute')) {
      const minutes = parseInt(duration.match(/(\d+)/)?.[1] || '0')
      return acc + minutes
    }
    return acc + 30 // default 30 minutes
  }, 0)
  
  const avgDuration = totalTutorials > 0 ? Math.round(totalMinutes / totalTutorials) : 0
  
  // Get unique categories
  const categories = [...new Set(tutorials.map(t => t.category))]
  
  return {
    totalTutorials,
    featuredTutorials,
    beginnerTutorials,
    intermediateTutorials,
    advancedTutorials,
    avgDuration,
    categories: categories.length,
  }
}

export default async function TutorialsPage() {
  const tutorials = await getAllTutorials()
  const stats = calculateTutorialStats(tutorials)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Tutorials Management</h1>
          <p className="text-muted-foreground text-gray-900">Manage your tutorials and learning content.</p>
        </div>
        <Link href="/admin/tutorials/new">
          <Button className="bg-primary text-white hover:bg-primary/90">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Tutorial
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Tutorials</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTutorials}</div>
            <p className="text-xs text-muted-foreground">
              {stats.featuredTutorials} featured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Featured Tutorials</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.featuredTutorials}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTutorials > 0 ? Math.round((stats.featuredTutorials / stats.totalTutorials) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration} min</div>
            <p className="text-xs text-muted-foreground">
              Average tutorial length
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">
              Different tutorial categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tutorials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">All Tutorials</CardTitle>
          <CardDescription className="text-gray-900">Complete list of all your tutorials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Title & Details</TableHead>
                <TableHead className="text-black">Difficulty & Duration</TableHead>
                <TableHead className="text-black">Category & Tags</TableHead>
                <TableHead className="text-black">Author</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-right text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutorials.map((tutorial) => (
                <TableRow key={tutorial.id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-black">{tutorial.title}</div>
                        {tutorial.featured && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground text-gray-900 line-clamp-2">
                        {tutorial.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge 
                        variant={
                          tutorial.difficulty === 'beginner' ? 'default' : 
                          tutorial.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                        }
                        className={
                          tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {tutorial.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {tutorial.duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {tutorial.category}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {tutorial.tags.slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {tutorial.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tutorial.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {tutorial.author.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={tutorial.featured ? "default" : "outline"}>
                        {tutorial.featured ? "Featured" : "Regular"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TutorialsTableActions tutorial={tutorial} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 