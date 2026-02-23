"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RequiredLabel } from "@/components/ui/required-label"
import { Switch } from "@/components/ui/switch"
import { FilePenLine, ArrowLeft, Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PAGE_CLASS = "space-y-8 max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const FIELD_LABEL_CLASS = "block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_GROUP_CLASS = "space-y-2"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const TEXTAREA_CLASS =
  "min-h-[120px] w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const SELECT_TRIGGER_CLASS =
  "!h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"

export default function EditProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const productId = params?.id

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    risk_level: "1",
    is_active: true,
  })

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
      } catch {
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
        method: "PUT",
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
    } catch {
      toast({ title: "Error", description: "Connection error" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
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
          <div className="flex items-start gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-border/70 bg-background/90"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Product</h1>
              <p className="mt-1 text-sm text-muted-foreground">Update configuration and risk profile for product #{productId}.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-2 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FilePenLine className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Product Information</h2>
              </div>
            </div>

            <div className={FIELD_GROUP_CLASS}>
              <RequiredLabel htmlFor="name" text="Product Name" className={FIELD_LABEL_CLASS} />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={FIELD_CLASS}
                required
              />
            </div>

            <div className={FIELD_GROUP_CLASS}>
              <RequiredLabel htmlFor="risk_level" text="Risk Level" className={FIELD_LABEL_CLASS} />
              <Select value={formData.risk_level} onValueChange={(val) => setFormData({ ...formData, risk_level: val })}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue />
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

            <div className={FIELD_GROUP_CLASS}>
              <RequiredLabel htmlFor="description" text="Description" className={FIELD_LABEL_CLASS} />
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={TEXTAREA_CLASS}
                required
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 p-4">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Is Active</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive products will be hidden from the risk assessment workflow.
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
              <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="h-10 rounded-xl px-4" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
