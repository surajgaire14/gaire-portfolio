"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const articles = [
  {
    slug: "optimizing-nextjs-performance",
    title: "Optimizing Next.js for Performance",
    description:
      "Deep dive into advanced Next.js optimization techniques including image optimization, code splitting, and server-side rendering strategies.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Performance",
    url: "#",
  },
  {
    slug: "svelte-future-frontend",
    title: "Why Svelte is the Future of Frontend",
    description:
      "Exploring Svelte's compile-time optimizations and how it's changing the way we think about reactive frameworks.",
    date: "2024-01-08",
    readTime: "6 min read",
    category: "Frontend",
    url: "#",
  },
  {
    slug: "scalable-apis-laravel",
    title: "Building Scalable APIs with Laravel",
    description:
      "Best practices for designing and implementing robust, scalable APIs using Laravel's powerful features and ecosystem.",
    date: "2024-01-02",
    readTime: "10 min read",
    category: "Backend",
    url: "#",
  },
  {
    slug: "modern-css-techniques-2024",
    title: "Modern CSS Techniques for 2024",
    description:
      "Latest CSS features and techniques including container queries, cascade layers, and advanced grid layouts.",
    date: "2023-12-28",
    readTime: "7 min read",
    category: "CSS",
    url: "#",
  },
]

export function ArticlesSection() {
  return (
    <section id="articles" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-heading)] mb-6">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sharing knowledge and insights about modern web development, best practices, and emerging technologies.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link href={`/blog/${article.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-border hover:border-accent/50 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold font-[var(--font-heading)] group-hover:text-accent transition-colors leading-tight">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {article.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{article.readTime}</span>
                      <Button variant="ghost" size="sm" className="group-hover:text-accent p-0 h-auto">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
