"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, MapPin, Calendar, Award, Code, Coffee } from "lucide-react"
import Link from "next/link"

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Svelte", "Vue.js"] },
  { category: "Backend", items: ["Laravel", "Node.js", "PHP", "Python", "PostgreSQL", "MySQL"] },
  { category: "Tools & Others", items: ["Git", "Docker", "AWS", "Vercel", "Figma", "Linux"] },
]

const experience = [
  {
    title: "Senior Full-Stack Developer",
    company: "Tech Innovations Inc.",
    period: "2022 - Present",
    description:
      "Leading development of scalable web applications using React, Next.js, and Laravel. Mentoring junior developers and architecting cloud-native solutions.",
  },
  {
    title: "Full-Stack Developer",
    company: "Digital Solutions Co.",
    period: "2020 - 2022",
    description:
      "Developed and maintained multiple client projects using modern web technologies. Specialized in e-commerce platforms and API integrations.",
  },
  {
    title: "Frontend Developer",
    company: "Creative Agency",
    period: "2018 - 2020",
    description:
      "Created responsive, interactive websites and web applications. Collaborated closely with designers to implement pixel-perfect UI/UX designs.",
  },
]

const achievements = [
  "Built 50+ successful web applications",
  "Led team of 5 developers on major projects",
  "Reduced application load times by 60% on average",
  "Contributed to 10+ open source projects",
]

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[var(--font-heading)]">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate full-stack developer with 6+ years of experience creating innovative web solutions. I love
            turning complex problems into simple, beautiful, and intuitive designs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 font-[var(--font-heading)]">My Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  My journey into web development started during my computer science studies, where I discovered my
                  passion for creating digital experiences that make a difference. What began as curiosity about how
                  websites work has evolved into a career dedicated to building innovative solutions.
                </p>
                <p>
                  Over the years, I've had the privilege of working with startups, agencies, and established companies,
                  helping them bring their digital visions to life. I specialize in full-stack development with a focus
                  on modern JavaScript frameworks and robust backend architectures.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to open source projects,
                  or sharing knowledge through technical writing and mentoring. I believe in continuous learning and
                  staying at the forefront of web development trends.
                </p>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 font-[var(--font-heading)]">Experience</h2>
              <div className="space-y-6">
                {experience.map((job, index) => (
                  <motion.div
                    key={job.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="bg-card/30 border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white font-[var(--font-heading)]">{job.title}</CardTitle>
                            <p className="text-accent font-medium">{job.company}</p>
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {job.period}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 leading-relaxed">{job.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 font-[var(--font-heading)]">Key Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center p-4 bg-card/30 rounded-lg border border-border"
                  >
                    <Award className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-card/30 border-border">
                <CardHeader>
                  <CardTitle className="text-white font-[var(--font-heading)]">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-3 text-accent" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Code className="w-4 h-4 mr-3 text-accent" />
                    <span>6+ Years Experience</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Coffee className="w-4 h-4 mr-3 text-accent" />
                    <span>Coffee Enthusiast</span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-card/30 border-border">
                <CardHeader>
                  <CardTitle className="text-white font-[var(--font-heading)]">Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skills.map((skillGroup, index) => (
                    <div key={skillGroup.category}>
                      <h4 className="text-accent font-medium mb-3">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill, skillIndex) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 + skillIndex * 0.05 }}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card/30 border-border">
                <CardContent className="p-6 text-center">
                  <h3 className="text-white font-bold mb-3 font-[var(--font-heading)]">Let's Work Together</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Ready to bring your ideas to life? Let's discuss your next project.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-primary hover:bg-primary/90">Get In Touch</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
