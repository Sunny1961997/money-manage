"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type EntityDetails = Record<string, any>

export default function EntityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [entityData, setEntityData] = React.useState<EntityDetails | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchEntityDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/sanction-entities/${id}`, {
          method: "GET",
          credentials: "include"
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "Failed to load entity details")
        }

        // Handle nested data structure
        const data = result?.data || result?.data?.data || result
        setEntityData(data)
      } catch (err) {
        console.error("Failed to fetch entity details:", err)
        setError(err instanceof Error ? err.message : "Failed to load entity details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEntityDetails()
    }
  }, [id])

  const renderDetailValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>
    }

    if (typeof value === 'boolean') {
      return value ? "Yes" : "No"
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-muted-foreground">Empty</span>
      }
      return (
        <ul className="list-disc pl-4 space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-sm">{renderDetailValue(item)}</li>
          ))}
        </ul>
      )
    }

    if (typeof value === 'object') {
      return (
        <div className="pl-3 border-l-2 border-muted space-y-1 mt-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[140px_1fr] gap-2 text-sm">
              <span className="font-medium text-muted-foreground capitalize">
                {k.replace(/_/g, ' ')}:
              </span>
              <span>{renderDetailValue(v)}</span>
            </div>
          ))}
        </div>
      )
    }

    return String(value)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="text-sm text-destructive">{error}</div>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!entityData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="text-sm text-muted-foreground">No entity details found</div>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        
        <div>
          <h1 className="text-3xl font-bold">
            {entityData.name || "Entity Details"}
          </h1>
          <p className="text-muted-foreground">
            Detailed information about this entity
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity Information</CardTitle>
        </CardHeader>

        <CardContent className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-300px)] w-full">
            {/* Viewport content */}
            <div className="space-y-4 min-w-[900px] pr-4">
              {Object.entries(entityData)
                .filter(([key, v]) =>
                  !['source', 'source_record_id', 'source_reference', 'record_hash'].includes(key) &&
                  v !== null &&
                  v !== "" &&
                  !(Array.isArray(v) && v.length === 0)
                )
                .map(([key, value]) => (
                  <div key={key} className="border-b pb-3 last:border-0">
                    <h4 className="text-sm font-bold capitalize text-primary mb-2">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <div className="text-sm text-foreground whitespace-nowrap">
                      {key === 'is_pep' ? (value ? "Yes" : "No") : renderDetailValue(value)}
                      {/* {renderDetailValue(value)} */}
                    </div>
                  </div>
                ))}

              {Object.keys(entityData).filter(k => {
                const v = entityData[k]
                return (
                  !['source', 'source_record_id', 'source_reference', 'record_hash'].includes(k) &&
                  v !== null &&
                  v !== "" &&
                  !(Array.isArray(v) && v.length === 0)
                )
              }).length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No additional details available for this record.
                  </div>
                )}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
