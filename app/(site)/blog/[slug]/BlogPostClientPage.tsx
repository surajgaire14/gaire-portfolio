"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  readTime: string
  category: string
  author: string
  tags: string[]
}

interface Props {
  params: { slug: string }
  blogPosts: BlogPost[]
}

export default function BlogPostClientPage({ params, blogPosts }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {post.category}
              </Badge>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[var(--font-heading)] leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">{post.description}</p>

            <div className="flex items-center gap-4 pb-8 border-b border-border">
              <div className="flex items-center text-muted-foreground">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-border hover:bg-accent/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
            style={{
              "--tw-prose-body": "rgb(209 213 219)",
              "--tw-prose-headings": "rgb(255 255 255)",
              "--tw-prose-lead": "rgb(156 163 175)",
              "--tw-prose-links": "rgb(34 197 94)",
              "--tw-prose-bold": "rgb(255 255 255)",
              "--tw-prose-counters": "rgb(156 163 175)",
              "--tw-prose-bullets": "rgb(75 85 99)",
              "--tw-prose-hr": "rgb(55 65 81)",
              "--tw-prose-quotes": "rgb(255 255 255)",
              "--tw-prose-quote-borders": "rgb(55 65 81)",
              "--tw-prose-captions": "rgb(156 163 175)",
              "--tw-prose-code": "rgb(255 255 255)",
              "--tw-prose-pre-code": "rgb(209 213 219)",
              "--tw-prose-pre-bg": "rgb(17 24 39)",
              "--tw-prose-th-borders": "rgb(55 65 81)",
              "--tw-prose-td-borders": "rgb(55 65 81)",
            }}
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/\n/g, "<br>")
                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
                .replace(/`([^`]+)`/g, "<code>$1</code>")
                .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                .replace(/^### (.*$)/gm, "<h3>$1</h3>"),
            }}
          />
        </motion.article>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border pt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-8 font-[var(--font-heading)]">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter((p) => p.slug !== post.slug && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-border hover:border-accent/50 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          {relatedPost.category}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(relatedPost.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold font-[var(--font-heading)] group-hover:text-accent transition-colors leading-tight">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {relatedPost.description.substring(0, 120)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
