import { HeroSection } from "@/components/hero-section"
import { BackgroundSection } from "@/components/background-section"
import { ProjectsSection } from "@/components/projects-section"
import { ArticlesSection } from "@/components/articles-section"
import { ContactSection } from "@/components/contact-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BackgroundSection />
      <ProjectsSection />
      <ArticlesSection />
      <ContactSection />
    </div>
  )
}
