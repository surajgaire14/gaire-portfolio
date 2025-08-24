"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, ArrowLeft, Calendar, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"

const projects = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React frontend and Laravel backend, featuring real-time inventory management and payment processing.",
    longDescription:
      "This comprehensive e-commerce platform represents a complete solution for modern online retail. Built with a React frontend and Laravel backend, it features advanced inventory management, secure payment processing through Stripe, and real-time order tracking. The platform includes an admin dashboard for managing products, orders, and customer data, along with advanced analytics and reporting features.",
    image: "/modern-ecommerce-dashboard.png",
    tech: ["React", "Laravel", "MySQL", "Stripe", "Redis", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time inventory management",
      "Secure payment processing with Stripe",
      "Advanced product filtering and search",
      "Order tracking and management",
      "Admin dashboard with analytics",
      "Responsive design for all devices",
    ],
    challenges:
      "The main challenge was implementing real-time inventory updates across multiple concurrent users while maintaining data consistency. This was solved using Redis for caching and Laravel's broadcasting features for real-time updates.",
    duration: "3 months",
    role: "Full-Stack Developer",
  },
  {
    slug: "task-management-app",
    title: "Task Management App",
    description: "Collaborative project management tool built with Next.js and real-time updates using WebSockets.",
    longDescription:
      "A modern collaborative project management application that enables teams to organize, track, and complete projects efficiently. Built with Next.js and TypeScript, it features real-time collaboration through WebSockets, drag-and-drop task management, and comprehensive project analytics.",
    image: "/task-management-kanban-dashboard.png",
    tech: ["Next.js", "TypeScript", "Prisma", "WebSocket", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time collaborative editing",
      "Drag-and-drop Kanban boards",
      "Team member management",
      "Project timeline visualization",
      "File attachments and comments",
      "Advanced filtering and search",
    ],
    challenges:
      "Implementing real-time collaboration without conflicts required careful state management and conflict resolution strategies. Used operational transformation techniques to handle concurrent edits.",
    duration: "2 months",
    role: "Lead Developer",
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with interactive charts and data visualization built using Svelte.",
    longDescription:
      "A powerful analytics dashboard that provides real-time insights into business metrics and KPIs. Built with Svelte for optimal performance, it features interactive charts, customizable widgets, and advanced data filtering capabilities.",
    image: "/analytics-dashboard.png",
    tech: ["Svelte", "D3.js", "Node.js", "MongoDB", "WebSocket", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time data visualization",
      "Interactive charts and graphs",
      "Customizable dashboard widgets",
      "Advanced filtering and segmentation",
      "Export functionality",
      "Mobile-responsive design",
    ],
    challenges:
      "Handling large datasets while maintaining smooth interactions required optimization of data processing and chart rendering. Implemented virtual scrolling and data pagination for better performance.",
    duration: "6 weeks",
    role: "Frontend Developer",
  },
  {
    slug: "social-media-platform",
    title: "Social Media Platform",
    description:
      "Modern social networking platform with real-time messaging, content sharing, and user engagement features.",
    longDescription:
      "A comprehensive social media platform that connects users through posts, real-time messaging, and interactive content sharing. Features include user profiles, news feeds, story sharing, and advanced privacy controls.",
    image: "/social-media-interface.png",
    tech: ["React", "Next.js", "PostgreSQL", "Redis", "Socket.io", "AWS S3"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time messaging system",
      "News feed with algorithmic sorting",
      "Story sharing and viewing",
      "User profiles and connections",
      "Content moderation tools",
      "Privacy and security controls",
    ],
    challenges:
      "Scaling the real-time messaging system to handle thousands of concurrent users required implementing message queues and optimizing database queries for chat history.",
    duration: "4 months",
    role: "Full-Stack Developer",
  },
  {
    slug: "learning-management-system",
    title: "Learning Management System",
    description: "Comprehensive LMS with course creation, student progress tracking, and interactive learning modules.",
    longDescription:
      "An advanced learning management system designed for educational institutions and corporate training. Features course creation tools, student progress tracking, interactive assessments, and comprehensive reporting.",
    image: "/lms-dashboard.png",
    tech: ["Laravel", "Vue.js", "MySQL", "AWS", "FFmpeg", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Course creation and management",
      "Video streaming and processing",
      "Interactive quizzes and assessments",
      "Student progress tracking",
      "Gradebook and reporting",
      "Discussion forums and messaging",
    ],
    challenges:
      "Implementing video streaming with adaptive bitrate required setting up a robust media processing pipeline using FFmpeg and AWS services for optimal delivery across different devices.",
    duration: "5 months",
    role: "Backend Developer",
  },
  {
    slug: "portfolio-website-builder",
    title: "Portfolio Website Builder",
    description: "Drag-and-drop website builder allowing users to create professional portfolios without coding.",
    longDescription:
      "An intuitive website builder that empowers users to create stunning portfolio websites without any coding knowledge. Features a drag-and-drop interface, customizable templates, and integrated hosting solutions.",
    image: "/website-builder-interface.png",
    tech: ["Svelte", "TypeScript", "Supabase", "Tailwind", "Cloudflare", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Drag-and-drop page builder",
      "Customizable templates",
      "Integrated hosting and domains",
      "SEO optimization tools",
      "Analytics integration",
      "Custom CSS support",
    ],
    challenges:
      "Creating a flexible drag-and-drop system that generates clean, performant code required careful architecture planning and extensive testing across different use cases.",
    duration: "3.5 months",
    role: "Full-Stack Developer",
  },
]

export default function ProjectClientPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/projects">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[var(--font-heading)]">{project.title}</h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <User className="w-4 h-4 mr-2" />
              <span>{project.role}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Project
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-accent bg-transparent">
              <Github className="w-4 h-4 mr-2" />
              View Source Code
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative overflow-hidden rounded-lg"
            >
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </motion.div>

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 font-[var(--font-heading)]">Project Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{project.longDescription}</p>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 font-[var(--font-heading)]">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center p-4 bg-card/30 rounded-lg border border-border"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Challenges & Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 font-[var(--font-heading)]">Challenges & Solutions</h2>
              <Card className="bg-card/30 border-border">
                <CardContent className="p-6">
                  <p className="text-gray-300 leading-relaxed">{project.challenges}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-card/30 border-border">
                <CardHeader>
                  <CardTitle className="text-white font-[var(--font-heading)]">Tech Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card/30 border-border">
                <CardHeader>
                  <CardTitle className="text-white font-[var(--font-heading)]">Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button variant="outline" className="w-full border-border hover:bg-accent bg-transparent">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
