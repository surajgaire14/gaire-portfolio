const blogPosts = [
  {
    slug: "optimizing-nextjs-performance",
    title: "Optimizing Next.js for Performance",
    description:
      "Deep dive into advanced Next.js optimization techniques including image optimization, code splitting, and server-side rendering strategies.",
    content: `
# Optimizing Next.js for Performance

Next.js has become one of the most popular React frameworks, and for good reason. It provides excellent developer experience while delivering great performance out of the box. However, there are many advanced techniques you can use to squeeze even more performance from your Next.js applications.

## Image Optimization

One of the biggest performance wins in Next.js comes from proper image optimization. The built-in Image component provides automatic optimization, but there are several best practices to follow:

### Using the Image Component

\`\`\`jsx
import Image from 'next/image'

function MyComponent() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // Use for above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
\`\`\`

### Key Benefits

- **Automatic format selection**: WebP, AVIF when supported
- **Responsive images**: Automatically serves different sizes
- **Lazy loading**: Images load as they enter the viewport
- **Blur placeholder**: Smooth loading experience

## Code Splitting Strategies

Next.js automatically splits your code, but you can optimize further:

### Dynamic Imports

\`\`\`jsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable server-side rendering if needed
})
\`\`\`

### Route-based Splitting

Organize your pages to take advantage of automatic route-based code splitting:

\`\`\`
pages/
  index.js          // Home page bundle
  about.js          // About page bundle
  products/
    index.js        // Products listing bundle
    [id].js         // Individual product bundle
\`\`\`

## Server-Side Rendering Optimization

Choose the right rendering strategy for each page:

### Static Generation (SSG)

Best for content that doesn't change often:

\`\`\`jsx
export async function getStaticProps() {
  const data = await fetchData()
  
  return {
    props: { data },
    revalidate: 3600 // Revalidate every hour
  }
}
\`\`\`

### Server-Side Rendering (SSR)

For dynamic content that needs to be fresh:

\`\`\`jsx
export async function getServerSideProps(context) {
  const { req, res } = context
  const data = await fetchUserSpecificData(req)
  
  return {
    props: { data }
  }
}
\`\`\`

### Incremental Static Regeneration (ISR)

Best of both worlds - static with updates:

\`\`\`jsx
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 60 // Regenerate at most once per minute
  }
}
\`\`\`

## Bundle Analysis and Optimization

Use the bundle analyzer to identify optimization opportunities:

\`\`\`bash
npm install @next/bundle-analyzer
\`\`\`

\`\`\`javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your Next.js config
})
\`\`\`

## Performance Monitoring

Implement Core Web Vitals monitoring:

\`\`\`jsx
// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics service
}
\`\`\`

## Conclusion

Performance optimization in Next.js is an ongoing process. Start with the built-in optimizations, then gradually implement more advanced techniques based on your specific needs. Remember to measure the impact of each optimization to ensure you're making meaningful improvements.

The key is to understand your application's bottlenecks and apply the right optimization techniques systematically. With these strategies, you can build Next.js applications that are both feature-rich and performant.
    `,
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Performance",
    author: "John Doe",
    tags: ["Next.js", "Performance", "React", "Web Development"],
  },
  {
    slug: "svelte-future-frontend",
    title: "Why Svelte is the Future of Frontend",
    description:
      "Exploring Svelte's compile-time optimizations and how it's changing the way we think about reactive frameworks.",
    content: `
# Why Svelte is the Future of Frontend

Svelte has been gaining significant traction in the frontend development community, and for good reason. Unlike traditional frameworks that do most of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.

## The Compilation Advantage

### Traditional Runtime Frameworks

Most frameworks like React, Vue, and Angular include a significant runtime that:
- Manages component state
- Handles reactivity
- Performs virtual DOM diffing
- Manages component lifecycle

This runtime code needs to be shipped to the browser, increasing bundle size.

### Svelte's Compile-Time Approach

Svelte takes a different approach:

\`\`\`svelte
<script>
  let count = 0;
  
  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>
  Count: {count}
</button>
\`\`\`

This compiles to highly optimized vanilla JavaScript that directly manipulates the DOM.

## Performance Benefits

### Smaller Bundle Sizes

Svelte applications are typically much smaller:
- **React**: ~45KB (React + ReactDOM)
- **Vue**: ~35KB (Vue 3)
- **Svelte**: ~10KB (for equivalent functionality)

### Faster Runtime Performance

Without a virtual DOM, Svelte can:
- Update the DOM directly
- Avoid reconciliation overhead
- Eliminate framework runtime costs

## Developer Experience

### Intuitive Syntax

Svelte's syntax feels natural and requires less boilerplate:

\`\`\`svelte
<script>
  export let name;
  let greeting = 'Hello';
</script>

<h1>{greeting} {name}!</h1>

<style>
  h1 {
    color: purple;
  }
</style>
\`\`\`

### Built-in State Management

No need for external state management libraries:

\`\`\`svelte
<script>
  import { writable } from 'svelte/store';
  
  const count = writable(0);
  
  function increment() {
    count.update(n => n + 1);
  }
</script>

<button on:click={increment}>
  Count: {$count}
</button>
\`\`\`

## Reactivity Model

Svelte's reactivity is based on assignments:

\`\`\`svelte
<script>
  let items = [];
  let total = 0;
  
  // Reactive statement
  $: total = items.reduce((sum, item) => sum + item.price, 0);
  
  function addItem(item) {
    items = [...items, item]; // Triggers reactivity
  }
</script>
\`\`\`

## SvelteKit: The Full-Stack Solution

SvelteKit provides:
- File-based routing
- Server-side rendering
- Static site generation
- API routes
- Progressive enhancement

\`\`\`javascript
// src/routes/+page.server.js
export async function load() {
  const posts = await fetchPosts();
  return {
    posts
  };
}
\`\`\`

## Ecosystem and Adoption

### Growing Community

- Active development and community
- Excellent documentation
- Growing ecosystem of libraries

### Industry Adoption

Companies using Svelte:
- The New York Times
- Apple (documentation sites)
- Spotify (internal tools)
- Many startups and agencies

## Migration Considerations

### When to Choose Svelte

- New projects with performance requirements
- Applications with complex interactions
- Teams wanting simpler state management
- Projects prioritizing bundle size

### Potential Challenges

- Smaller ecosystem compared to React/Vue
- Fewer job opportunities (currently)
- Learning curve for reactive statements

## The Future

Svelte continues to evolve with:
- Improved TypeScript support
- Better tooling and IDE integration
- Growing ecosystem
- SvelteKit maturation

## Conclusion

Svelte represents a paradigm shift in frontend development. By moving work from runtime to compile-time, it delivers better performance and developer experience. While it may not replace React or Vue overnight, it's definitely worth considering for your next project.

The future of frontend development is likely to include multiple approaches, and Svelte's compile-time philosophy offers a compelling alternative to traditional runtime frameworks.
    `,
    date: "2024-01-08",
    readTime: "6 min read",
    category: "Frontend",
    author: "John Doe",
    tags: ["Svelte", "Frontend", "Performance", "JavaScript"],
  },
  {
    slug: "scalable-apis-laravel",
    title: "Building Scalable APIs with Laravel",
    description:
      "Best practices for designing and implementing robust, scalable APIs using Laravel's powerful features and ecosystem.",
    content: `
# Building Scalable APIs with Laravel

Laravel has evolved into one of the most powerful frameworks for building APIs. With its elegant syntax, robust feature set, and excellent ecosystem, Laravel provides everything you need to build scalable, maintainable APIs.

## API Design Principles

### RESTful Design

Follow REST conventions for predictable APIs:

\`\`\`php
// routes/api.php
Route::apiResource('posts', PostController::class);
Route::apiResource('posts.comments', CommentController::class);
\`\`\`

This creates standard endpoints:
- GET /api/posts
- POST /api/posts
- GET /api/posts/{post}
- PUT/PATCH /api/posts/{post}
- DELETE /api/posts/{post}

### API Resources

Use API Resources for consistent data transformation:

\`\`\`php
// app/Http/Resources/PostResource.php
class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'author' => new UserResource($this->whenLoaded('author')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
\`\`\`

## Authentication and Authorization

### API Token Authentication

\`\`\`php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
\`\`\`

\`\`\`php
// User model
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    
    // Create token
    public function createApiToken($name = 'api-token')
    {
        return $this->createToken($name)->plainTextToken;
    }
}
\`\`\`

### Policy-Based Authorization

\`\`\`php
// app/Policies/PostPolicy.php
class PostPolicy
{
    public function update(User $user, Post $post)
    {
        return $user->id === $post->user_id;
    }
    
    public function delete(User $user, Post $post)
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }
}
\`\`\`

## Database Optimization

### Eloquent Best Practices

Avoid N+1 queries with eager loading:

\`\`\`php
// Bad
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // N+1 query problem
}

// Good
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name; // Single query
}
\`\`\`

### Database Indexing

\`\`\`php
// database/migrations/create_posts_table.php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->foreignId('user_id')->constrained();
    $table->string('status')->default('draft');
    $table->timestamps();
    
    // Indexes for performance
    $table->index(['user_id', 'status']);
    $table->index('created_at');
});
\`\`\`

## Caching Strategies

### Query Result Caching

\`\`\`php
// Cache expensive queries
$posts = Cache::remember('posts.featured', 3600, function () {
    return Post::with('author')
        ->where('featured', true)
        ->orderBy('created_at', 'desc')
        ->get();
});
\`\`\`

### API Response Caching

\`\`\`php
// app/Http/Controllers/PostController.php
public function index(Request $request)
{
    $cacheKey = 'posts.' . md5($request->getQueryString());
    
    return Cache::remember($cacheKey, 1800, function () use ($request) {
        $posts = Post::with('author')
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->paginate(15);
            
        return PostResource::collection($posts);
    });
}
\`\`\`

## Rate Limiting

### Built-in Rate Limiting

\`\`\`php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:api',
        \\Illuminate\\Routing\\Middleware\\SubstituteBindings::class,
    ],
];
\`\`\`

### Custom Rate Limiting

\`\`\`php
// app/Providers/RouteServiceProvider.php
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(100)->by($request->user()->id)
        : Limit::perMinute(20)->by($request->ip());
});
\`\`\`

## Error Handling

### Global Exception Handling

\`\`\`php
// app/Exceptions/Handler.php
public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'error' => 'Resource not found'
            ], 404);
        }
        
        if ($exception instanceof ValidationException) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $exception->errors()
            ], 422);
        }
    }
    
    return parent::render($request, $exception);
}
\`\`\`

## Testing

### Feature Tests

\`\`\`php
// tests/Feature/PostApiTest.php
class PostApiTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_create_post()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/posts', [
                'title' => 'Test Post',
                'content' => 'Test content'
            ]);
            
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'content', 'created_at']
            ]);
    }
}
\`\`\`

## Monitoring and Logging

### API Logging

\`\`\`php
// app/Http/Middleware/LogApiRequests.php
public function handle($request, Closure $next)
{
    $response = $next($request);
    
    Log::info('API Request', [
        'method' => $request->method(),
        'url' => $request->fullUrl(),
        'status' => $response->status(),
        'user_id' => $request->user()?->id,
        'response_time' => microtime(true) - LARAVEL_START
    ]);
    
    return $response;
}
\`\`\`

## Deployment Considerations

### Environment Configuration

\`\`\`bash
# .env.production
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
\`\`\`

### Performance Optimization

\`\`\`bash
# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
\`\`\`

## Conclusion

Building scalable APIs with Laravel requires attention to design, performance, security, and maintainability. By following these best practices and leveraging Laravel's powerful features, you can build APIs that scale with your application's growth.

Remember to always profile your application, monitor performance metrics, and continuously optimize based on real-world usage patterns.
    `,
    date: "2024-01-02",
    readTime: "10 min read",
    category: "Backend",
    author: "John Doe",
    tags: ["Laravel", "PHP", "API", "Backend", "Scalability"],
  },
  {
    slug: "modern-css-techniques-2024",
    title: "Modern CSS Techniques for 2024",
    description:
      "Latest CSS features and techniques including container queries, cascade layers, and advanced grid layouts.",
    content: `
# Modern CSS Techniques for 2024

CSS continues to evolve rapidly, with new features that make styling more powerful and intuitive. Let's explore the latest CSS techniques that are changing how we approach web design in 2024.

## Container Queries

Container queries allow you to style elements based on their container's size, not just the viewport.

### Basic Container Query

\`\`\`css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
  
  .card-image {
    width: 200px;
  }
}
\`\`\`

### Multiple Container Contexts

\`\`\`css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.main-content {
  container-type: inline-size;
  container-name: main;
}

@container sidebar (max-width: 300px) {
  .widget {
    font-size: 0.875rem;
  }
}

@container main (min-width: 800px) {
  .article {
    columns: 2;
    column-gap: 2rem;
  }
}
\`\`\`

## Cascade Layers

Cascade layers provide explicit control over CSS specificity and cascade order.

### Defining Layers

\`\`\`css
@layer reset, base, components, utilities;

@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }
}

@layer components {
  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    background: blue;
    color: white;
  }
}

@layer utilities {
  .text-center { text-align: center; }
  .hidden { display: none; }
}
\`\`\`

### Layer Imports

\`\`\`css
@import url('reset.css') layer(reset);
@import url('components.css') layer(components);
\`\`\`

## Advanced Grid Layouts

### Subgrid

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.grid-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
\`\`\`

### Grid Template Areas with Line Names

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: [sidebar-start] 200px [main-start] 1fr [aside-start] 200px [aside-end];
  grid-template-rows: [header-start] auto [content-start] 1fr [footer-start] auto [footer-end];
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Color Functions and Spaces

### New Color Functions

\`\`\`css
.color-examples {
  /* Relative color syntax */
  --primary: oklch(0.7 0.15 200);
  --primary-light: oklch(from var(--primary) calc(l + 0.2) c h);
  --primary-dark: oklch(from var(--primary) calc(l - 0.2) c h);
  
  /* Color mixing */
  background: color-mix(in oklch, var(--primary) 80%, white);
  
  /* Wide gamut colors */
  color: color(display-p3 1 0.5 0);
}
\`\`\`

### Color Contrast Functions

\`\`\`css
.adaptive-text {
  background: var(--bg-color);
  color: light-dark(black, white);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-color: #ffffff;
  }
}
\`\`\`

## Advanced Selectors

### :has() Pseudo-class

\`\`\`css
/* Style cards that contain images */
.card:has(img) {
  border: 2px solid blue;
}

/* Style form groups with errors */
.form-group:has(.error) {
  background: #fee;
}

/* Style articles without headings */
article:not(:has(h1, h2, h3)) {
  padding-top: 2rem;
}
\`\`\`

### :is() and :where()

\`\`\`css
/* :is() maintains specificity */
:is(h1, h2, h3):is(.title, .heading) {
  color: blue;
}

/* :where() has zero specificity */
:where(h1, h2, h3):where(.title, .heading) {
  color: blue;
}
\`\`\`

## Modern Layout Techniques

### Intrinsic Web Design

\`\`\`css
.flexible-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1rem;
}

.responsive-text {
  font-size: clamp(1rem, 4vw, 2rem);
  line-height: 1.4;
}
\`\`\`

### Logical Properties

\`\`\`css
.content {
  /* Instead of margin-left and margin-right */
  margin-inline: 1rem;
  
  /* Instead of margin-top and margin-bottom */
  margin-block: 2rem;
  
  /* Instead of padding-left */
  padding-inline-start: 1rem;
  
  /* Instead of border-top */
  border-block-start: 1px solid #ccc;
}
\`\`\`

## Animation and Transitions

### View Transitions API

\`\`\`css
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: slide-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-out {
  to { transform: translateX(-100%); }
}

@keyframes slide-in {
  from { transform: translateX(100%); }
}
\`\`\`

### Scroll-Driven Animations

\`\`\`css
@keyframes reveal {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-on-scroll {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
\`\`\`

## Performance Optimizations

### Content Visibility

\`\`\`css
.long-content {
  content-visibility: auto;
  contain-intrinsic-size: 1000px;
}
\`\`\`

### CSS Containment

\`\`\`css
.component {
  contain: layout style paint;
}

.isolated-component {
  contain: strict;
  contain-intrinsic-size: 300px 200px;
}
\`\`\`

## Responsive Design Evolution

### Container Query Units

\`\`\`css
.card {
  padding: 2cqw; /* 2% of container width */
  font-size: clamp(1rem, 3cqi, 1.5rem); /* Container inline size */
}
\`\`\`

### Dynamic Viewport Units

\`\`\`css
.hero {
  /* Large viewport height (excludes mobile UI) */
  height: 100lvh;
  
  /* Small viewport height (includes mobile UI) */
  min-height: 100svh;
  
  /* Dynamic viewport height (adjusts to mobile UI) */
  height: 100dvh;
}
\`\`\`

## Conclusion

These modern CSS techniques provide powerful tools for creating more maintainable, performant, and responsive web designs. Container queries revolutionize responsive design, cascade layers bring order to CSS architecture, and new color functions enable more sophisticated theming.

As browser support continues to improve, these features will become essential tools in every developer's toolkit. Start experimenting with them today to stay ahead of the curve in modern web development.
    `,
    date: "2023-12-28",
    readTime: "7 min read",
    category: "CSS",
    author: "John Doe",
    tags: ["CSS", "Web Design", "Frontend", "Responsive Design"],
  },
]

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

import BlogPostClientPage from "./BlogPostClientPage"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClientPage params={params} blogPosts={blogPosts} />
}
