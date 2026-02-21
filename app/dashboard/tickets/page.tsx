"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RequiredLabel } from "@/components/ui/required-label"
import { useToast } from "@/components/ui/use-toast"
import { CircleAlert, Clock3, FilterX, Loader2, Plus, RotateCw, Search, ShieldQuestion, Ticket, TicketPlus } from "lucide-react"
import { formatDate } from "@/lib/date-format"

type Ticket = {
  id: number
  ticket_number: string
  subject: string
  description: string
  status: string
  priority: string
  category: string | null
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
  company?: {
    id: number
    company_name: string
  }
}

type TicketFormData = {
  subject: string
  description: string
  priority: string
  category: string
}

const PAGE_CLASS = "space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"
const INPUT_CLASS =
  "h-11 rounded-xl border-border/70 bg-background/90 transition-colors focus-visible:outline-none focus-visible:border-primary/80 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
const SELECT_TRIGGER_CLASS =
  "!h-11 rounded-xl border-border/70 bg-background/90 transition-colors focus-visible:outline-none focus-visible:border-primary/80 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"

function toTitleCaseLabel(value: string) {
  const normalized = String(value || "")
    .trim()
    .replace(/[_-]+/g, " ")
  if (!normalized) return "-"

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default function TicketsPage() {
  const { toast } = useToast()
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [loading, setLoading] = React.useState(true)
  const [creating, setCreating] = React.useState(false)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [expandedTicketId, setExpandedTicketId] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")

  const [formData, setFormData] = React.useState<TicketFormData>({
    subject: "",
    description: "",
    priority: "medium",
    category: "",
  })

  const fetchTickets = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (priorityFilter !== "all") params.append("priority", priorityFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/tickets?${params.toString()}`, { credentials: "include" })
      const result = await response.json()

      if (result.status) {
        setTickets(result.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
      toast({
        title: "Failed to load tickets",
        description: "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter, searchQuery, toast])

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchTickets()
    }, 220)

    return () => window.clearTimeout(timer)
  }, [fetchTickets])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (creating) return
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Subject and description are required.",
      })
      return
    }

    setCreating(true)
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.status) {
        setIsCreateOpen(false)
        setFormData({
          subject: "",
          description: "",
          priority: "medium",
          category: "",
        })
        toast({
          title: "Ticket created",
          description: "Your support ticket has been submitted.",
        })
        await fetchTickets()
      } else {
        toast({
          title: "Creation failed",
          description: result.message || "Failed to create ticket.",
        })
      }
    } catch (error) {
      console.error("Failed to create ticket:", error)
      toast({
        title: "Creation failed",
        description: "Failed to create ticket.",
      })
    } finally {
      setCreating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "border-blue-200 bg-blue-100 text-blue-700",
      in_progress: "border-amber-200 bg-amber-100 text-amber-700",
      resolved: "border-emerald-200 bg-emerald-100 text-emerald-700",
      closed: "border-zinc-200 bg-zinc-100 text-zinc-700",
    }
    return variants[status] || "border-zinc-200 bg-zinc-100 text-zinc-700"
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "border-zinc-200 bg-zinc-100 text-zinc-700",
      medium: "border-primary/25 bg-primary/10 text-primary",
      high: "border-orange-200 bg-orange-100 text-orange-700",
      urgent: "border-rose-200 bg-rose-100 text-rose-700",
    }
    return variants[priority] || "border-zinc-200 bg-zinc-100 text-zinc-700"
  }

  const metrics = React.useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status === "open").length
    const inProgress = tickets.filter((ticket) => ticket.status === "in_progress").length
    const urgent = tickets.filter((ticket) => ticket.priority === "urgent").length
    return { total: tickets.length, open, inProgress, urgent }
  }, [tickets])

  const resetForm = () =>
    setFormData({
      subject: "",
      description: "",
      priority: "medium",
      category: "",
    })

  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== "all" || priorityFilter !== "all"

  const clearFilters = React.useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setPriorityFilter("all")
  }, [])

  React.useEffect(() => {
    if (!tickets.some((ticket) => ticket.id.toString() === expandedTicketId)) {
      setExpandedTicketId("")
    }
  }, [tickets, expandedTicketId])

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-10 w-10 shrink-0 rounded-xl border border-primary/20 bg-primary/10 text-primary flex items-center justify-center">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Support Tickets</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Create, triage, and monitor support requests in one place.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Total</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{metrics.total}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Open</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{metrics.open}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>In Progress</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{metrics.inProgress}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Urgent</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{metrics.urgent}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="border-b border-border/60 px-6 py-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_220px_220px_auto] xl:items-end">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${INPUT_CLASS} pl-9`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters || loading}
                  title="Clear filters"
                  aria-label="Clear filters"
                >
                  <FilterX className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl"
                  onClick={() => void fetchTickets()}
                  disabled={loading}
                  title="Refresh tickets"
                  aria-label="Refresh tickets"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                </Button>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 rounded-full px-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl overflow-hidden border-border/60 p-0">
                    <div className="relative border-b border-border/60 bg-gradient-to-r from-primary/10 via-background to-background px-6 py-5">
                      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                      <DialogHeader className="relative">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          <TicketPlus className="h-5 w-5 text-primary" />
                          Create New Ticket
                        </DialogTitle>
                        <DialogDescription>Provide details so support can triage and resolve your issue quickly.</DialogDescription>
                      </DialogHeader>
                    </div>
                    <form onSubmit={handleCreateTicket} className="space-y-5 p-6">
                      <div className="space-y-2">
                        <RequiredLabel htmlFor="subject" text="Subject" />
                        <Input
                          id="subject"
                          className={INPUT_CLASS}
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          placeholder="Brief summary of your issue"
                        />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel htmlFor="description" text="Description" />
                        <Textarea
                          id="description"
                          className="min-h-[120px] rounded-xl border-border/70 bg-background/90"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                          rows={5}
                          placeholder="Share relevant details, expected behavior, and any errors encountered"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                            <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            className={INPUT_CLASS}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Technical, Billing, General..."
                          />
                        </div>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <ShieldQuestion className="h-4 w-4 text-primary" />
                          Tips for faster resolution
                        </div>
                        <p className="mt-1">Include screenshots, error text, and clear reproduction steps in the description.</p>
                      </div>
                      <DialogFooter className="gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-full border-slate-300 !bg-slate-50 px-5 text-slate-700 hover:!bg-slate-100 hover:text-slate-900 active:!bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-600 dark:!bg-slate-900 dark:text-slate-200 dark:hover:!bg-slate-800"
                          onClick={() => {
                            setIsCreateOpen(false)
                            resetForm()
                          }}
                          disabled={creating}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-full px-5" disabled={creating}>
                          {creating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <TicketPlus className="h-4 w-4" />
                              Create Ticket
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading tickets...
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-12">
              <div className="text-center text-muted-foreground">
                <CircleAlert className="w-10 h-10 mx-auto mb-3 opacity-70" />
                <p className="font-medium text-foreground">No tickets found</p>
                <p className="text-sm mt-1">Try adjusting filters or create a new support ticket.</p>
              </div>
            </div>
          ) : (
            <Accordion type="single" collapsible value={expandedTicketId} onValueChange={setExpandedTicketId} className="w-full">
              {tickets.map((ticket) => (
                <AccordionItem
                  key={ticket.id}
                  value={ticket.id.toString()}
                  className="border-border/50 px-5 transition-colors data-[state=open]:bg-muted/20"
                >
                  <AccordionTrigger className="py-4 text-left hover:no-underline [&[data-state=open]]:pb-3">
                    <div className="min-w-0 flex w-full items-center gap-2">
                      <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                        {ticket.ticket_number}
                      </span>
                      <Badge className={`rounded-full border ${getStatusBadge(ticket.status)}`}>
                        {toTitleCaseLabel(ticket.status)}
                      </Badge>
                      <Badge className={`rounded-full border ${getPriorityBadge(ticket.priority)}`}>
                        {toTitleCaseLabel(ticket.priority)}
                      </Badge>
                      <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className={SECONDARY_LABEL_CLASS}>Subject</p>
                          <p className="mt-1 text-sm font-semibold text-foreground break-words">{ticket.subject || "-"}</p>
                        </div>
                        <div className="space-y-3">
                          {ticket.user ? (
                            <div>
                              <p className={SECONDARY_LABEL_CLASS}>Created By</p>
                              <p className="mt-1 text-sm font-medium">{ticket.user.name}</p>
                            </div>
                          ) : null}
                          {ticket.user?.email ? (
                            <div>
                              <p className={SECONDARY_LABEL_CLASS}>Email</p>
                              <p className="mt-1 text-sm font-medium break-all">{ticket.user.email}</p>
                            </div>
                          ) : null}
                          {ticket.category ? (
                            <div>
                              <p className={SECONDARY_LABEL_CLASS}>Category</p>
                              <div className="mt-1">
                                <Badge variant="outline" className="rounded-full border-border/60 bg-background/70 text-xs font-medium">
                                  {ticket.category}
                                </Badge>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="md:col-span-2">
                          <p className={SECONDARY_LABEL_CLASS}>Description</p>
                          <p className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">{ticket.description || "-"}</p>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <div>
                            <p className={SECONDARY_LABEL_CLASS}>Last Updated</p>
                            <p className="mt-1 text-sm font-medium">{formatDate(ticket.updated_at)}</p>
                          </div>
                          {ticket.company?.company_name ? (
                            <div>
                              <p className={SECONDARY_LABEL_CLASS}>Company</p>
                              <p className="mt-1 text-sm font-medium">{ticket.company.company_name}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
