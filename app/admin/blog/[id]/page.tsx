import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { PostForm } from "../post-form"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post = await db.post.findUnique({
    where: {
      id: id,
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <PostForm post={post} />
    </div>
  )
}

