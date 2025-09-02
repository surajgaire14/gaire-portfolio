import { useEffect, useState } from "react"

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
    createdAt: Date
    _count: {
      posts: number
    }
  }

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)
                const data = await fetch("/api/categories")
                const _data = await data.json()
                if (_data) {
                    setCategories(_data.categories)
                }
            } catch (error) {
                console.error(error)
                setError("Failed to fetch categories")
            } finally {
                setIsLoading(false)
            }

        }
        fetchCategories()
    }, [])

    return { categories, isLoading, error , setCategories }
}