import TurndownService from "turndown"

// Initialize Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
})

// Configure turndown rules
turndownService.addRule("strikethrough", {
  filter: ["del", "s", "strike"],
  replacement: (content) => `~~${content}~~`,
})

turndownService.addRule("highlight", {
  filter: (node) => {
    return node.nodeName === "MARK" || (node.nodeName === "SPAN" && node.classList?.contains("highlight"))
  },
  replacement: (content) => `==${content}==`,
})

export function htmlToMarkdown(html: string): string {
  try {
    return turndownService.turndown(html)
  } catch (error) {
    console.error("Error converting HTML to Markdown:", error)
    return html
  }
}

export function markdownToHtml(markdown: string): string {
  try {
    // Enhanced markdown to HTML conversion
    return (
      markdown
        // Headers
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        // Strikethrough
        .replace(/~~(.*?)~~/gim, "<del>$1</del>")
        // Highlight
        .replace(/==(.*?)==/gim, "<mark>$1</mark>")
        // Links
        .replace(/\[([^\]]*)\]$$([^)]*)$$/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]$$([^)]*)$$/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg" />')
        // Code blocks
        .replace(/```([^`]*?)```/gims, "<pre><code>$1</code></pre>")
        // Inline code
        .replace(/`([^`]*?)`/gim, "<code>$1</code>")
        // Blockquotes
        .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
        // Unordered lists
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
        // Ordered lists
        .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
        // Line breaks
        .replace(/\n/gim, "<br>")
    )
  } catch (error) {
    console.error("Error converting Markdown to HTML:", error)
    return markdown
  }
}
