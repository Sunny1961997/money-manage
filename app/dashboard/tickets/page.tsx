"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function TicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")
  
  const [formData, setFormData] = React.useState<TicketFormData>({
    subject: "",
    description: "",
    priority: "medium",
    category: "",
  })

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (priorityFilter !== "all") params.append("priority", priorityFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/tickets?${params.toString()}`)
      const result = await response.json()
      
      if (result.status) {
        setTickets(result.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTickets()
  }, [statusFilter, priorityFilter, searchQuery])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        fetchTickets()
      } else {
        alert(result.message || "Failed to create ticket")
      }
    } catch (error) {
      console.error("Failed to create ticket:", error)
      alert("Failed to create ticket")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }
    return variants[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return variants[priority] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and track your support requests</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Support Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  placeholder="Detailed description of your issue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Technical, Billing, General"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Ticket</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
            <div>
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tickets found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {ticket.ticket_number}
                      </span>
                      <Badge className={getStatusBadge(ticket.status)}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                      <Badge className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      {ticket.category && (
                        <Badge variant="outline">{ticket.category}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      {ticket.user && (
                        <span>Created by: {ticket.user.name}</span>
                      )}
                      <span>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
