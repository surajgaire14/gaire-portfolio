import { ProjectsSection } from "@/components/projects-section"

export default function ProjectsPage() {
  return (
    <main className="pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">My Projects</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my latest work in web development, featuring modern technologies and innovative solutions.
          </p>
        </div>
      </div>
      <ProjectsSection />
    </main>
  )
}
