import { ProjectForm } from "../project-form"

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
      <ProjectForm />
    </div>
  )
}

