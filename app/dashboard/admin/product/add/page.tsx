"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Building2, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function AddProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Initial State matches your Laravel $valData keys
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    risk_level: "1", // Stored as string for the Select component
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Data transformation to satisfy Laravel's validation rules:
      // 'risk_level' => 'required|integer'
      // 'is_active' => 'required|boolean'
      const payload = {
        name: formData.name,
        description: formData.description,
        risk_level: parseInt(formData.risk_level, 10),
        is_active: !!formData.is_active, 
      }

      const res = await fetch("/api/admin/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // Important for Laravel to return JSON errors
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && (data.status === true || data.status === "success")) {
        toast({ 
          title: "Success", 
          description: data.message || "Product created successfully" 
        })
        router.push("/dashboard/admin/product") // Navigate back to list
        router.refresh()
      } else {
        // Handle Laravel validation errors or 500 errors
        toast({ 
          variant: "destructive", 
          title: "Submission Failed", 
          description: data.message || data.error || "Please check your input." 
        })
      }
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Network Error", 
        description: "Failed to connect to the server." 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Add New Product</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Information</CardTitle>
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
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level</Label>
              <Select 
                value={formData.risk_level} 
                onValueChange={(val) => setFormData({ ...formData, risk_level: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
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
                placeholder="Provide a detailed description of the product"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <div className="space-y-0.5">
                <Label className="text-base">Is Active</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive products will be hidden from the risk assessment tool.
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}