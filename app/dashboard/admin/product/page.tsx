"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Product = {
  id: number
  name: string
  risk_level: number
  is_active: boolean
  description: string
  created_at: string | null
  updated_at: string | null
}

export default function ProductsPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  // Products Data
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // This is your "limit"

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      // Offset calculation: (page - 1) * limit
      const offset = (currentPage - 1) * pageSize
      const url = `/api/admin/product?limit=${pageSize}&offset=${offset}&search=${searchTerm}`

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      
      if (data.status === "success" || data.status) {
        // API should return products array and total count for pagination
        setProducts(data.data.products)
        setTotalCount(data.data.total || 0) 
      } else {
        toast({ title: "Error", description: data.message || "Failed to fetch Products" })
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to fetch Products" })
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, toast])

  // Fetch data when page or search changes
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Products</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dashboard/admin/companies/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to page 1 on search
              }}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Table Section */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Product Name</th>
                  <th className="text-left p-4 font-medium text-sm">Description</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Risk Level</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No products found.</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-sm text-slate-600">{product.description || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{product.risk_level}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}