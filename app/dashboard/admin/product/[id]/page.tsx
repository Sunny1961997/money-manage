"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Building2, ArrowLeft, Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function EditProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    risk_level: "1",
    is_active: true,
  })

  // Fetch Existing Data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`/api/admin/product/${productId}`)
        const data = await res.json()

        if (data.status === true || data.status === "success") {
          const product = data.data.product
          setFormData({
            name: product.name,
            description: product.description || "",
            risk_level: product.risk_level.toString(),
            is_active: Boolean(product.is_active),
          })
        } else {
          toast({ title: "Error", description: "Product not found" })
          router.push("/dashboard/admin/product")
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to load product data" })
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchProductData()
  }, [productId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch(`/api/admin/product/${productId}`, {
        method: "PUT", // Or POST if your Laravel route handles Method Spoofing
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          risk_level: parseInt(formData.risk_level, 10),
          is_active: !!formData.is_active,
        }),
      })

      const data = await res.json()

      if (res.ok && (data.status === true || data.status === "success")) {
        toast({ title: "Success", description: "Product updated successfully" })
        router.push("/dashboard/admin/product")
        router.refresh()
      } else {
        toast({ title: "Update Failed", description: data.message || "Error saving changes" })
      }
    } catch (err) {
      toast({ title: "Error", description: "Connection error" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground">Loading product information...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Edit Product</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Details for ID: {productId}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level</Label>
              <Select value={formData.risk_level} onValueChange={(val) => setFormData({ ...formData, risk_level: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <Label className="text-base">Is Active</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}