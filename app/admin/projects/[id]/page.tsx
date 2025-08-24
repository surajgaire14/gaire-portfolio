import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProjectForm } from "../project-form"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await db.project.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}

