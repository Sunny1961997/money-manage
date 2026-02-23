"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ShieldCheck, Loader2 } from "lucide-react"
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

const PAGE_CLASS = "space-y-8 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const LABEL_CLASS = "text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const ACTION_ICON_BUTTON_CLASS =
  "h-8 w-8 rounded-lg border border-border/60 bg-background/85 p-0 text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-sm active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
const ACTION_ICON_DELETE_BUTTON_CLASS =
  "h-8 w-8 rounded-lg border border-destructive/30 bg-background/85 p-0 text-destructive transition-all duration-200 hover:-translate-y-px hover:border-destructive/60 hover:bg-destructive/15 hover:text-destructive hover:shadow-sm active:translate-y-0 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-0"

export default function ProductsPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const offset = (currentPage - 1) * pageSize
      const url = `/api/admin/product?limit=${pageSize}&offset=${offset}&search=${searchTerm}`
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()

      if (data.status === "success" || data.status) {
        setProducts(data?.data?.products || [])
        setTotalCount(data?.data?.total || 0)
      } else {
        toast({ title: "Error", description: data.message || "Failed to fetch products" })
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to fetch products" })
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`/api/admin/product/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.status === true || data.status === "success") {
        toast({ title: "Deleted", description: "Product removed successfully" })
        fetchProducts()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Could not delete product",
        })
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Connection error" })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const totalPages = Math.ceil(totalCount / pageSize)
  const activeProducts = useMemo(() => products.filter((product) => product.is_active).length, [products])
  const averageRisk = useMemo(
    () =>
      products.length > 0
        ? (products.reduce((sum, product) => sum + product.risk_level, 0) / products.length).toFixed(1)
        : "0.0",
    [products]
  )
  const initialLoading = loading && products.length === 0 && searchTerm.trim().length === 0

  if (initialLoading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Products</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Configure risk-rated products used by onboarding and screening workflows.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Button className="h-10 rounded-xl px-4" onClick={() => router.push("/dashboard/admin/product/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={LABEL_CLASS}>Total Products</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{totalCount}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={LABEL_CLASS}>Active Products</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{activeProducts}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={LABEL_CLASS}>Average Risk</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{averageRisk}</p>
          </CardContent>
        </Card>
      </div>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="border-b border-border/60 p-5 sm:p-6">
            <div className="space-y-2">
              <p className={LABEL_CLASS}>Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className={`${FIELD_CLASS} pl-10`}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="border-b border-border/70 bg-muted/30">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Product Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Risk Level</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Loading products...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-border/60 transition hover:bg-muted/20">
                      <td className="px-4 py-3.5 font-medium text-foreground">{product.name}</td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">{product.description || "-"}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                            product.is_active
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                              : "border-rose-200 bg-rose-100 text-rose-700"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-foreground">{product.risk_level}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={ACTION_ICON_BUTTON_CLASS}
                            aria-label={`Edit ${product.name}`}
                            onClick={() => router.push(`/dashboard/admin/product/${product.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={ACTION_ICON_DELETE_BUTTON_CLASS}
                            aria-label={`Delete ${product.name}`}
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <div className="min-w-[110px] text-center text-sm font-medium text-foreground">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading || totalPages === 0}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
