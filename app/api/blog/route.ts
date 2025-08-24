import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { createSlug, savePostToMarkdown } from "@/lib/blog"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// export async function POST(request: Request) {
//   const { title, slug, excerpt, content, image, type, published, featured, blogLink, categories } = await request.json()

//   const session = await getSession()

//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const user = await db.user.findUnique({
//     where: { email: session.user.email },
//   })

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 })  
//   }

//   const existingPost = await db.post.findUnique({
//     where: { slug },
//   })

//   if (existingPost) {   
//     return NextResponse.json({ error: "Slug already exists. Choose a different one." }, { status: 400 })
//   }

//   const post = await db.post.create({
//     data: {
//       title,
//       slug,
//       excerpt,
//       content,
//       image,
//       type,
//       published,
//       featured,
//       blogLink,
//       categories: {
//         create: categories.map((categoryId: string) => ({
//           category: {
//             connect: { id: categoryId },
//           },
//         })),
//       },
//       userId: user.id,
//     },
//   })

//   return NextResponse.json(post)
// }
export async function POST(request: NextRequest) {
  try {
      const { title, description, content, externalUrl, isExternal, tags, focusKeyword, seoData } = await request.json()
      const slug = createSlug(title)
  
      // Save to database
      const dbPost = await prisma.post.create({
        data: {
          slug,
          title,
          description,
          content,
          externalUrl: isExternal ? externalUrl : null,
          isExternal,
          tags,
          focusKeyword,
          seoData: seoData as any,
          published: true,
        },
      })
  
      // Also save to markdown file for serving
      await savePostToMarkdown({
        id: dbPost.id,
        slug: dbPost.slug,
        title: dbPost.title,
        description: dbPost.description || "",
        date: dbPost.createdAt.toISOString(),
        updatedAt: dbPost.updatedAt.toISOString(),
        tags: dbPost.tags,
        content: dbPost.content || "",
        externalUrl: dbPost.externalUrl || "",
        isExternal: dbPost.isExternal,
        published: dbPost.published,
        focusKeyword: dbPost.focusKeyword || "",
        seoData: (dbPost.seoData as any) || {},
      })
  
   
      return NextResponse.json({ success: true, slug }, { status: 200 })
    } catch (error) {
      console.error("Error publishing post:", error)
      return NextResponse.json({ success: false, error: error }, { status: 500 })
    }
}

