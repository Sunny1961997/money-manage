"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RequiredLabel } from "@/components/ui/required-label"
import { Switch } from "@/components/ui/switch"
import { PackagePlus, ArrowLeft, Loader2 } from "lucide-react"
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

export default function AddProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    risk_level: "1",
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && (data.status === true || data.status === "success")) {
        toast({
          title: "Success",
          description: data.message || "Product created successfully",
        })
        router.push("/dashboard/admin/product")
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: data.message || data.error || "Please check your input.",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Failed to connect to the server.",
      })
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Add New Product</h1>
              <p className="mt-1 text-sm text-muted-foreground">Create a new product and define its risk parameters.</p>
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
                  <PackagePlus className="h-4 w-4" />
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
                required
                placeholder="Enter product name"
                className={FIELD_CLASS}
              />
            </div>

            <div className={FIELD_GROUP_CLASS}>
              <RequiredLabel htmlFor="risk_level" text="Risk Level" className={FIELD_LABEL_CLASS} />
              <Select value={formData.risk_level} onValueChange={(val) => setFormData({ ...formData, risk_level: val })}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
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

            <div className={FIELD_GROUP_CLASS}>
              <RequiredLabel htmlFor="description" text="Description" className={FIELD_LABEL_CLASS} />
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Provide a detailed description of the product"
                rows={4}
                className={TEXTAREA_CLASS}
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
              <Button type="submit" className="h-10 rounded-xl px-4" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
