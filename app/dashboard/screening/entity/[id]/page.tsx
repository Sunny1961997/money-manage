"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FileSearch, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatDateTime } from "@/lib/date-format"
import { decodeEntityId } from "@/lib/entity-id"

type EntityDetails = Record<string, any>

const PAGE_CLASS =
  "space-y-8 mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] backdrop-blur-sm transition-all"
const DATE_KEY_PATTERN = /(date|time|timestamp|dob|created|updated|changed|last_change|expiry|expiration)/i
const DATE_TIME_KEY_PATTERN = /(time|timestamp|created|updated|changed|last_change)/i
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /T|\d{2}:\d{2}|Z|[+-]\d{2}:?\d{2}/i
const UNIX_TIMESTAMP_PATTERN = /^\d{10,13}$/
const DATA_LABEL_CLASS = "text-[11px] font-semibold uppercase tracking-[0.08em] text-primary/80"
const SECTION_LABEL_CLASS = "text-xs font-semibold uppercase tracking-[0.1em] text-primary/80"
const META_LABEL_CLASS = "text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/70"

function normalizeLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDateTimeValue(value: string | number, key?: string): string | null {
  const keyLooksTemporal = Boolean(key && DATE_KEY_PATTERN.test(key))
  const keyLooksDateTime = Boolean(key && DATE_TIME_KEY_PATTERN.test(key))

  if (typeof value === "number") {
    if (!Number.isFinite(value) || !keyLooksTemporal) return null
    const normalizedValue = value > 1_000_000_000_000 ? value : value * 1000
    const formatted = keyLooksDateTime ? formatDateTime(normalizedValue, "") : formatDate(normalizedValue, "")
    return formatted || null
  }

  const raw = value.trim()
  if (!raw) return null

  if (UNIX_TIMESTAMP_PATTERN.test(raw) && keyLooksTemporal) {
    const numericValue = Number(raw)
    if (!Number.isFinite(numericValue)) return null
    const normalizedValue = raw.length === 13 ? numericValue : numericValue * 1000
    const formatted = keyLooksDateTime ? formatDateTime(normalizedValue, "") : formatDate(normalizedValue, "")
    return formatted || null
  }

  if (DATE_ONLY_PATTERN.test(raw)) {
    const formatted = formatDate(raw, "")
    return formatted || null
  }

  if (!keyLooksTemporal && !TIME_PATTERN.test(raw)) return null

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return null

  const formatted = keyLooksDateTime || TIME_PATTERN.test(raw) ? formatDateTime(parsed, "") : formatDate(parsed, "")
  return formatted || null
}

export default function EntityDetailsPage() {
  const params = useParams()
  const encodedId = params?.id as string
  const id = React.useMemo(() => {
    try {
      return decodeEntityId(encodedId)
    } catch {
      return encodedId
    }
  }, [encodedId])
  const quickResultsHref = "/dashboard/screening/quick/results"
  const quickScreeningHref = "/dashboard/screening/quick"

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
          credentials: "include",
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "Failed to load entity details")
        }

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

  const isPlainObject = (value: unknown): value is Record<string, any> =>
    typeof value === "object" && value !== null && !Array.isArray(value)
  const isPrimitiveValue = (value: unknown): value is string | number | boolean =>
    typeof value === "string" || typeof value === "number" || typeof value === "boolean"
  const isComplexArray = (value: unknown): value is any[] =>
    Array.isArray(value) && value.some((item) => isPlainObject(item) || Array.isArray(item))
  const compactCollection = (items: any[]) => items.filter((item) => item !== null && item !== undefined && item !== "")
  const isRawNestedCollapsibleSection = (fieldKey: string, fieldPath: string, fieldValue: unknown) => {
    const normalizedKey = fieldKey.toLowerCase()
    const isNamedSection =
      normalizedKey === "properties" ||
      normalizedKey === "sanctions" ||
      normalizedKey.endsWith("_properties") ||
      normalizedKey.includes("properties")
    const isStructured = isPlainObject(fieldValue) || Array.isArray(fieldValue)
    const isUnderRaw = fieldPath.toLowerCase().includes("raw.")
    return isNamedSection && isStructured && isUnderRaw
  }
  const formatBadgeValue = (value: unknown) => {
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (value === null || value === undefined || value === "") return "N/A"
    return String(value)
  }
  const getSectionKind = (value: any) => (Array.isArray(value) ? "Collection" : isPlainObject(value) ? "Object" : "Value")

  const renderPrimitiveValue = (value: string | number | boolean, key?: string): React.ReactNode => {
    if (typeof value === "boolean") {
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
            value
              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
              : "border-rose-200 bg-rose-100 text-rose-700"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      )
    }

    if (typeof value === "string" || typeof value === "number") {
      const formattedDateTime = formatDateTimeValue(value, key)
      if (formattedDateTime) {
        return <span className="whitespace-pre-wrap break-words text-sm text-foreground">{formattedDateTime}</span>
      }
    }

    return <span className="whitespace-pre-wrap break-words text-sm text-foreground">{String(value)}</span>
  }

  const renderObjectRows = (objectValue: Record<string, any>, depth = 0, path = ""): React.ReactNode => {
    const objectEntries = Object.entries(objectValue).filter(([, nestedValue]) => {
      if (nestedValue === null || nestedValue === "") return false
      if (Array.isArray(nestedValue) && nestedValue.length === 0) return false
      return true
    })

    if (objectEntries.length === 0) {
      return <span className="text-sm text-muted-foreground">Empty</span>
    }

    return (
      <div className="overflow-hidden rounded-lg bg-muted/20 divide-y divide-border/40">
        {objectEntries.map(([nestedKey, nestedValue], index) => {
          const entryPath = path ? `${path}.${nestedKey}` : nestedKey
          const shouldCollapse = isRawNestedCollapsibleSection(nestedKey, entryPath, nestedValue)
          const isNestedSanctionsSection = nestedKey.toLowerCase() === "sanctions" && Array.isArray(nestedValue)

          return (
            <div key={nestedKey} className={`px-2.5 py-2.5 ${index % 2 === 0 ? "bg-background/80" : "bg-background/65"}`}>
              <p className={DATA_LABEL_CLASS}>
                {normalizeLabel(nestedKey)}
              </p>
              {shouldCollapse ? (
                <div className="mt-1.5 min-w-0 rounded-md bg-background/90 p-1.5 text-sm text-foreground">
                  <Accordion type="single" collapsible className="overflow-hidden rounded-md bg-muted/20">
                    <AccordionItem value={`nested-${entryPath}`} className="border-0">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex flex-wrap items-center gap-2 text-left">
                          <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                            {getSectionSummary(nestedValue)}
                          </Badge>
                          <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                            {getSectionKind(nestedValue)}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2">
                        <div className="rounded-md bg-background/85 p-2">
                          {isNestedSanctionsSection
                            ? renderSanctionsCards(nestedValue as any[], entryPath)
                            : renderStructuredValue(nestedValue, nestedKey, depth + 1, entryPath)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <div className="mt-1.5 min-w-0 rounded-md bg-background/90 px-2.5 py-2 text-sm text-foreground">
                  {renderStructuredValue(nestedValue, nestedKey, depth + 1, entryPath)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderStructuredValue = (value: any, key?: string, depth = 0, path = key || ""): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-sm text-muted-foreground">-</span>
    }

    if (isPrimitiveValue(value)) {
      return renderPrimitiveValue(value, key)
    }

    if (Array.isArray(value)) {
      const compactValues = compactCollection(value)
      if (compactValues.length === 0) {
        return <span className="text-sm text-muted-foreground">Empty</span>
      }

      if (compactValues.length === 1 && isPrimitiveValue(compactValues[0])) {
        return renderPrimitiveValue(compactValues[0], key)
      }

      if (compactValues.every((item) => isPrimitiveValue(item))) {
        return (
          <div className="flex flex-wrap gap-2">
            {compactValues.map((item, index) => (
              <span
                key={`${String(item)}-${index}`}
                className="inline-flex items-center rounded-lg bg-background/95 px-2.5 py-1 text-xs text-foreground"
              >
                {String(item)}
              </span>
            ))}
          </div>
        )
      }

      return (
        <div className="space-y-2">
          {compactValues.map((item, index) => (
            <div key={index} className="rounded-lg bg-muted/20 px-3 py-2">
              {compactValues.length > 1 ? (
                <p className={`mb-2 ${DATA_LABEL_CLASS}`}>
                  Item {index + 1}
                </p>
              ) : null}
              {isPlainObject(item)
                ? renderObjectRows(item, depth + 1, `${path}[${index}]`)
                : renderStructuredValue(item, key, depth + 1, `${path}[${index}]`)}
            </div>
          ))}
        </div>
      )
    }

    if (isPlainObject(value)) {
      return renderObjectRows(value, depth, path)
    }

    return <span className="whitespace-pre-wrap break-words text-sm text-foreground">{String(value)}</span>
  }

  const getSectionSummary = (value: any): string => {
    if (Array.isArray(value)) {
      const total = compactCollection(value).length
      return `${total} item${total === 1 ? "" : "s"}`
    }
    if (isPlainObject(value)) {
      const total = Object.keys(value).length
      return `${total} field${total === 1 ? "" : "s"}`
    }
    return "Details"
  }

  const renderSanctionsCards = (sanctionsValue: any[], pathPrefix = "sanctions"): React.ReactNode => {
    const sanctions = compactCollection(sanctionsValue)
    if (sanctions.length === 0) {
      return <span className="text-sm text-muted-foreground">No sanctions records.</span>
    }

    return (
      <div className="space-y-3">
        {sanctions.map((sanction, index) => {
          if (!isPlainObject(sanction)) {
            return (
              <div key={index} className="rounded-lg bg-background/80 px-3 py-2">
                {renderStructuredValue(sanction, "sanctions", 1, `${pathPrefix}[${index}]`)}
              </div>
            )
          }

          const caption = typeof sanction.caption === "string" ? sanction.caption : null
          const schema = sanction.schema
          const target = sanction.target
          const dataset = sanction.datasets
          const datasetLabel = isPrimitiveValue(dataset)
            ? formatBadgeValue(dataset)
            : Array.isArray(dataset)
              ? `${compactCollection(dataset).length} entries`
              : null
          return (
            <div
              key={index}
              className="rounded-xl bg-gradient-to-br from-background/95 to-muted/20 p-3"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                    Sanction {index + 1}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                    Schema: {formatBadgeValue(schema)}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                    Target: {formatBadgeValue(target)}
                  </Badge>
                  {datasetLabel ? (
                    <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                      Dataset: {datasetLabel}
                    </Badge>
                  ) : null}
                </div>
                {caption ? <p className="max-w-full truncate text-xs text-muted-foreground sm:max-w-[320px]">{caption}</p> : null}
              </div>
              {renderObjectRows(sanction, 1, `${pathPrefix}[${index}]`)}
            </div>
          )
        })}
      </div>
    )
  }

  const visibleEntries = React.useMemo(() => {
    if (!entityData) return []

    return Object.entries(entityData).filter(([key, value]) => {
      if (["source", "source_record_id", "source_reference", "record_hash"].includes(key)) {
        return false
      }
      if (value === null || value === "") return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
  }, [entityData])

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

  if (error) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-destructive">{error}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="h-10 rounded-xl px-4">
                <Link href={quickResultsHref}>Quick Results</Link>
              </Button>
              <Button asChild className="h-10 rounded-xl px-4">
                <Link href={quickScreeningHref}>New Quick Screening</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!entityData) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">No entity details found.</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="h-10 rounded-xl px-4">
                <Link href={quickResultsHref}>Quick Results</Link>
              </Button>
              <Button asChild className="h-10 rounded-xl px-4">
                <Link href={quickScreeningHref}>New Quick Screening</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card
        className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className={SECTION_LABEL_CLASS}>Screening Record</p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {entityData.name || "Entity Details"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Full sanction entity details and source attributes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end lg:pt-1">
                <Button asChild variant="outline" className="h-9 rounded-xl px-3">
                  <Link href={quickResultsHref}>Quick Results</Link>
                </Button>
                <Button asChild className="h-9 rounded-xl px-3">
                  <Link href={quickScreeningHref}>New Quick Screening</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="flex min-h-[64px] flex-col justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
                <p className={META_LABEL_CLASS}>Entity ID</p>
                <p className="mt-1 text-sm font-medium text-foreground">{id}</p>
              </div>
              <div className="flex min-h-[64px] flex-col justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
                <p className={META_LABEL_CLASS}>Source</p>
                <p className="mt-1 truncate text-sm font-medium text-foreground" title={entityData.source || "N/A"}>
                  {entityData.source || "N/A"}
                </p>
              </div>
              <div className="flex min-h-[64px] flex-col justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
                <p className={META_LABEL_CLASS}>Visible Fields</p>
                <p className="mt-1 text-sm font-medium text-foreground">{visibleEntries.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileSearch className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Entity Information</h2>
              <p className="text-sm text-muted-foreground">Structured details from the source record.</p>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-19rem)] w-full">
            <div className="space-y-3 p-5 sm:p-6">
              {visibleEntries.length > 0 ? (
                visibleEntries.map(([key, value]) => {
                  const normalizedValue = key === "is_pep" ? Boolean(value) : value
                  const lowerKey = key.toLowerCase()
                  const isSanctionsSection = lowerKey === "sanctions" && Array.isArray(normalizedValue)
                  const isExpandableSection =
                    isPlainObject(normalizedValue) || isComplexArray(normalizedValue) || isSanctionsSection
                  const isDefaultExpanded = lowerKey === "properties" || lowerKey === "raw"

                  if (isExpandableSection) {
                    return (
                      <Accordion
                        key={key}
                        type="single"
                        collapsible
                        defaultValue={isDefaultExpanded ? key : undefined}
                        className="overflow-hidden rounded-xl bg-background/85"
                      >
                        <AccordionItem value={key} className="border-0">
                          <AccordionTrigger className="px-3 py-2.5 hover:no-underline">
                            <div className="flex flex-wrap items-center gap-2 text-left">
                              <p className={SECTION_LABEL_CLASS}>
                                {normalizeLabel(key)}
                              </p>
                              <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                                {getSectionSummary(normalizedValue)}
                              </Badge>
                              <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px]">
                                {getSectionKind(normalizedValue)}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                            <div className="rounded-lg bg-muted/20 p-2.5">
                              {isSanctionsSection
                                ? renderSanctionsCards(normalizedValue as any[], key)
                                : renderStructuredValue(normalizedValue, key, 0, key)}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                  }

                  return (
                    <div
                      key={key}
                      className="rounded-xl bg-background/85 px-3 py-2.5"
                    >
                      <div className="space-y-1.5">
                        <p className={SECTION_LABEL_CLASS}>
                          {normalizeLabel(key)}
                        </p>
                        <div className="min-w-0 break-words rounded-md bg-muted/20 px-2.5 py-2">
                          {renderStructuredValue(normalizedValue, key, 0, key)}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-xl bg-background/80 p-5 text-center text-sm text-muted-foreground">
                  No additional details available for this record.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
