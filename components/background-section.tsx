import { Card } from "@/components/ui/card"

const techStack = [
  { name: "HTML5", icon: "🌐" },
  { name: "CSS3", icon: "🎨" },
  { name: "JavaScript", icon: "⚡" },
  { name: "React.js", icon: "⚛️" },
  { name: "Next.js", icon: "🚀" },
  { name: "Laravel", icon: "🔧" },
  { name: "Svelte", icon: "🔥" },
  { name: "TypeScript", icon: "📘" },
]

export function BackgroundSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-heading)] mb-6">
            My <span className="gradient-text">Background</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl text-card-foreground leading-relaxed mb-8">
              With <span className="text-accent font-semibold">7+ years of experience</span>, I specialize in building
              responsive, high-performance web applications. From crafting interactive UIs in React and Svelte to
              building robust backends with Laravel, I thrive on solving real-world problems with clean, scalable code.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm passionate about creating digital experiences that not only look great but perform exceptionally. My
              approach combines modern development practices with a deep understanding of user experience principles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {techStack.map((tech, index) => (
            <Card
              key={tech.name}
              className="p-6 text-center hover:bg-accent/10 transition-colors duration-300 border-border group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{tech.icon}</div>
              <p className="text-sm font-medium text-card-foreground group-hover:text-accent transition-colors">
                {tech.name}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
