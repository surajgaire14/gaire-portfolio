import { CategoryForm } from "../category-form"

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
      <CategoryForm />
    </div>
  )
}
