import ProjectClientPage from "./ProjectClientPage"

const projects = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React frontend and Laravel backend, featuring real-time inventory management and payment processing.",
    longDescription:
      "This comprehensive e-commerce platform represents a complete solution for modern online retail. Built with a React frontend and Laravel backend, it features advanced inventory management, secure payment processing through Stripe, and real-time order tracking. The platform includes an admin dashboard for managing products, orders, and customer data, along with advanced analytics and reporting features.",
    image: "/modern-ecommerce-dashboard.png",
    tech: ["React", "Laravel", "MySQL", "Stripe", "Redis", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time inventory management",
      "Secure payment processing with Stripe",
      "Advanced product filtering and search",
      "Order tracking and management",
      "Admin dashboard with analytics",
      "Responsive design for all devices",
    ],
    challenges:
      "The main challenge was implementing real-time inventory updates across multiple concurrent users while maintaining data consistency. This was solved using Redis for caching and Laravel's broadcasting features for real-time updates.",
    duration: "3 months",
    role: "Full-Stack Developer",
  },
  {
    slug: "task-management-app",
    title: "Task Management App",
    description: "Collaborative project management tool built with Next.js and real-time updates using WebSockets.",
    longDescription:
      "A modern collaborative project management application that enables teams to organize, track, and complete projects efficiently. Built with Next.js and TypeScript, it features real-time collaboration through WebSockets, drag-and-drop task management, and comprehensive project analytics.",
    image: "/task-management-kanban-dashboard.png",
    tech: ["Next.js", "TypeScript", "Prisma", "WebSocket", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time collaborative editing",
      "Drag-and-drop Kanban boards",
      "Team member management",
      "Project timeline visualization",
      "File attachments and comments",
      "Advanced filtering and search",
    ],
    challenges:
      "Implementing real-time collaboration without conflicts required careful state management and conflict resolution strategies. Used operational transformation techniques to handle concurrent edits.",
    duration: "2 months",
    role: "Lead Developer",
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with interactive charts and data visualization built using Svelte.",
    longDescription:
      "A powerful analytics dashboard that provides real-time insights into business metrics and KPIs. Built with Svelte for optimal performance, it features interactive charts, customizable widgets, and advanced data filtering capabilities.",
    image: "/analytics-dashboard.png",
    tech: ["Svelte", "D3.js", "Node.js", "MongoDB", "WebSocket", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time data visualization",
      "Interactive charts and graphs",
      "Customizable dashboard widgets",
      "Advanced filtering and segmentation",
      "Export functionality",
      "Mobile-responsive design",
    ],
    challenges:
      "Handling large datasets while maintaining smooth interactions required optimization of data processing and chart rendering. Implemented virtual scrolling and data pagination for better performance.",
    duration: "6 weeks",
    role: "Frontend Developer",
  },
  {
    slug: "social-media-platform",
    title: "Social Media Platform",
    description:
      "Modern social networking platform with real-time messaging, content sharing, and user engagement features.",
    longDescription:
      "A comprehensive social media platform that connects users through posts, real-time messaging, and interactive content sharing. Features include user profiles, news feeds, story sharing, and advanced privacy controls.",
    image: "/social-media-interface.png",
    tech: ["React", "Next.js", "PostgreSQL", "Redis", "Socket.io", "AWS S3"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Real-time messaging system",
      "News feed with algorithmic sorting",
      "Story sharing and viewing",
      "User profiles and connections",
      "Content moderation tools",
      "Privacy and security controls",
    ],
    challenges:
      "Scaling the real-time messaging system to handle thousands of concurrent users required implementing message queues and optimizing database queries for chat history.",
    duration: "4 months",
    role: "Full-Stack Developer",
  },
  {
    slug: "learning-management-system",
    title: "Learning Management System",
    description: "Comprehensive LMS with course creation, student progress tracking, and interactive learning modules.",
    longDescription:
      "An advanced learning management system designed for educational institutions and corporate training. Features course creation tools, student progress tracking, interactive assessments, and comprehensive reporting.",
    image: "/lms-dashboard.png",
    tech: ["Laravel", "Vue.js", "MySQL", "AWS", "FFmpeg", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Course creation and management",
      "Video streaming and processing",
      "Interactive quizzes and assessments",
      "Student progress tracking",
      "Gradebook and reporting",
      "Discussion forums and messaging",
    ],
    challenges:
      "Implementing video streaming with adaptive bitrate required setting up a robust media processing pipeline using FFmpeg and AWS services for optimal delivery across different devices.",
    duration: "5 months",
    role: "Backend Developer",
  },
  {
    slug: "portfolio-website-builder",
    title: "Portfolio Website Builder",
    description: "Drag-and-drop website builder allowing users to create professional portfolios without coding.",
    longDescription:
      "An intuitive website builder that empowers users to create stunning portfolio websites without any coding knowledge. Features a drag-and-drop interface, customizable templates, and integrated hosting solutions.",
    image: "/website-builder-interface.png",
    tech: ["Svelte", "TypeScript", "Supabase", "Tailwind", "Cloudflare", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Drag-and-drop page builder",
      "Customizable templates",
      "Integrated hosting and domains",
      "SEO optimization tools",
      "Analytics integration",
      "Custom CSS support",
    ],
    challenges:
      "Creating a flexible drag-and-drop system that generates clean, performant code required careful architecture planning and extensive testing across different use cases.",
    duration: "3.5 months",
    role: "Full-Stack Developer",
  },
]

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectClientPage params={params} />
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}
