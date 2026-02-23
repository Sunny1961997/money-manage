"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Download,
  ExternalLink,
  FileText,
  RefreshCcw,
  Search,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateScreeningPDF } from "@/lib/screening-pdf-generator"
import { generateScreeningSessionPDF } from "@/lib/screening-session-pdf"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Candidate = {
  id: number
  source: string
  subject_type: string
  name: string
  confidence: number
  nationality?: string | null
  address?: string | null
  dob?: string | null
  gender?: string | null
}

type BestBySourceItem = {
  source: string
  best_confidence: boolean
  data: Array<Candidate | null>
}

type ScreeningResponse = {
  status: string
  message: string
  user_id?: number | string
  data?: {
    user_id?: number | string
    user_company?: string
    searched_for?: string
    subject_type?: string
    screening_log_id?: string
    total_candidates?: number
    best_by_source?: BestBySourceItem[]
    total_search?: number
    total_found?: number
    user_name?: string
  }
}

type SourceDecision = "relevant" | "irrelevant" | "Relevant" | "Irrelevant" | "no_sp" | string | null

function confidenceNum(v: unknown) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function resultLabel(conf: number) {
  if (conf > 90) return "Match Found"
  if (conf > 30) return "Partial Match Found"
  return "False Positive"
}

const PAGE_CLASS =
  "space-y-8 mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] backdrop-blur-sm transition-all"
const FIELD_LABEL_CLASS = "block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_GROUP_CLASS = "space-y-2"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const SELECT_TRIGGER_CLASS =
  "!h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"

const ANNOTATION_OPTIONS = [
  { value: "No Annotation", label: "Select annotation" },
  { value: "True Match", label: "True Match" },
  { value: "Potential Match", label: "Potential Match" },
  { value: "No Match", label: "No Match" },
  { value: "Insufficient Data", label: "Insufficient Data" },
] as const

type EntityDetailsResponse = {
  data?: Record<string, any>
}

export default function QuickScreeningResultsPage() {
  const [payload, setPayload] = React.useState<ScreeningResponse | null>(null)
  const [detailsById, setDetailsById] = React.useState<Record<string, any>>({})
  const [savedByCandidate, setSavedByCandidate] = React.useState<
    Record<string, { decision: SourceDecision; annotationChoice: string; annotationText: string }>
  >({})

  // Bulk selection and bulk decision state
  const bestBySource = payload?.data?.best_by_source || []
  const [selectedCandidates, setSelectedCandidates] = React.useState<string[]>([])
  const allCandidateKeys = React.useMemo(() => {
    return bestBySource.flatMap(src => (src.data || []).filter(Boolean).map(c => `${src.source}:${c!.id}`))
  }, [bestBySource])
  const allSelected = selectedCandidates.length === allCandidateKeys.length && allCandidateKeys.length > 0
  const toggleSelectAll = () => {
    setSelectedCandidates(allSelected ? [] : [...allCandidateKeys])
  }
  const toggleSelectCandidate = (key: string) => {
    setSelectedCandidates(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }
  const [bulkDecision, setBulkDecision] = React.useState<SourceDecision | null>(null)
  const [bulkResultType, setBulkResultType] = React.useState<string>("")
  const [bulkAnnotation, setBulkAnnotation] = React.useState<string>("")

  React.useEffect(() => {
    const raw = sessionStorage.getItem("screening_results")
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      setPayload(parsed)
    } catch {
      setPayload(null)
    }
  }, [])

  const userId = String(payload?.data?.user_id || payload?.user_id || "N/A")
  const userName = String(payload?.data?.user_name || "N/A")
  const userCompany = String(payload?.data?.user_company || "N/A")
  const searchedFor = payload?.data?.searched_for || "-"
  const screeningLogId = payload?.data?.screening_log_id || "N/A"
  const customerType = payload?.data?.subject_type || "individual"
  const totalSearch = payload?.data?.total_search || 0
  const totalFound = payload?.data?.total_found || 0
  const hitRate = totalSearch > 0 ? ((totalFound / totalSearch) * 100).toFixed(1) : "0.0"

  const [sourceDecision, setSourceDecision] = React.useState<Record<string, SourceDecision>>({})
  const [sourceAnnotationChoice, setSourceAnnotationChoice] = React.useState<Record<string, string>>({})
  const [sourceAnnotationText, setSourceAnnotationText] = React.useState<Record<string, string>>({})
  const [downloadingKey, setDownloadingKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    const nextDecision: Record<string, SourceDecision> = {}
    const nextAnnoChoice: Record<string, string> = {}
    const nextAnnoText: Record<string, string> = {}

    for (const src of bestBySource) {
      nextDecision[src.source] = null
      nextAnnoChoice[src.source] = "No Annotation"
      nextAnnoText[src.source] = ""
    }

    setSourceDecision(nextDecision)
    setSourceAnnotationChoice(nextAnnoChoice)
    setSourceAnnotationText(nextAnnoText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload])

  React.useEffect(() => {
    ;(async () => {
      const allDetails: Record<string, any> = {}
      for (const src of bestBySource) {
        for (const c of (src.data || []).filter(Boolean) as Candidate[]) {
          try {
            const res = await fetch(`/api/sanction-entities/${c.id}`, { method: "GET", credentials: "include" })
            const detailsPayload: EntityDetailsResponse = await res.json().catch(async () => ({}))
            allDetails[`${c.id}`] =
              (detailsPayload as any)?.data ||
              (detailsPayload as any)?.data?.data ||
              (detailsPayload as any)?.data ||
              {}
          } catch {
            allDetails[`${c.id}`] = {}
          }
        }
      }
      setDetailsById(allDetails)
    })()
  }, [payload, bestBySource])

  const downloadPdfForCandidate = async (c: Candidate) => {
    const key = `${c.source}:${c.id}`
    setDownloadingKey(key)
    try {
      const res = await fetch(`/api/sanction-entities/${c.id}`, { method: "GET", credentials: "include" })
      const detailsPayload: EntityDetailsResponse = await res.json().catch(async () => ({}))
      if (!res.ok) throw new Error(detailsPayload?.data?.message || "Failed to load entity details")

      const detailData =
        (detailsPayload as any)?.data ||
        (detailsPayload as any)?.data?.data ||
        (detailsPayload as any)?.data ||
        {}

      const decision = (sourceDecision[c.source] || null) as SourceDecision
      const annotationChoice = sourceAnnotationChoice[c.source] || "No Annotation"
      const annotationText = sourceAnnotationText[c.source] || ""

      await generateScreeningPDF(c, searchedFor, detailData, decision, annotationChoice, annotationText)
    } catch (err) {
      console.error("PDF generation error:", err)
      alert("Failed to generate PDF: " + (err as Error).message)
    } finally {
      setDownloadingKey(null)
    }
  }

  const saveForCandidate = (source: string, candidateId: number) => {
    const key = `${source}:${candidateId}`
    setSavedByCandidate((prev) => ({
      ...prev,
      [key]: {
        decision: sourceDecision[source] ?? null,
        annotationChoice: sourceAnnotationChoice[source] || "",
        annotationText: sourceAnnotationText[source] || "",
      },
    }))
  }

  const editForCandidate = (source: string, candidateId: number) => {
    const key = `${source}:${candidateId}`
    setSavedByCandidate((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleDownloadSessionPDF = async () => {
    const pdfDecision: Record<string, string | null> = {}
    const pdfChoice: Record<string, string> = {}
    const pdfText: Record<string, string> = {}

    Object.entries(savedByCandidate).forEach(([key, v]) => {
      const source = key.split(":")[0]
      if (v.decision) {
        pdfDecision[source] = v.decision
        pdfDecision[key] = v.decision
      }
      if (v.annotationChoice) {
        pdfChoice[source] = v.annotationChoice
        pdfChoice[key] = v.annotationChoice
      }
      if (v.annotationText) pdfText[source] = v.annotationText
      pdfText[key] = v.annotationText
    })

    const savedKeys = Object.keys(savedByCandidate)

    let relCount = 0
    let irrelCount = 0
    Object.values(savedByCandidate).forEach((v) => {
      if (v.decision === "Relevant" || v.decision === "relevant") relCount++
      else if (v.decision === "Irrelevant" || v.decision === "irrelevant") irrelCount++
    })

    await generateScreeningSessionPDF({
      searchedFor,
      customerType,
      bestBySource,
      sourceDecision: pdfDecision as any,
      sourceAnnotationChoice: pdfChoice,
      sourceAnnotationText: pdfText,
      detailsById,
      total_search: totalSearch,
      total_found: totalFound,
      user_id: userId,
      user_name: userName,
      user_company: userCompany,
      savedCandidateKeys: savedKeys,
      relevantCount: relCount,
      irrelevantCount: irrelCount,
      screening_log_id: screeningLogId,
    })
  }

  const getConfidenceColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (percentage >= 50) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getSubjectTypeLabel = (value: string) => {
    const normalized = value.toLowerCase()
    if (normalized === "entity" || normalized === "corporate") return "Corporate"
    if (normalized === "vessel") return "Vessel"
    return "Individual"
  }

  if (!payload) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="space-y-4 p-5 sm:p-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Quick Screening Results</h1>
            <p className="text-sm text-muted-foreground">No results found in session. Run a search first.</p>
            <Button
              variant="outline"
              className="h-10 rounded-xl px-4"
              onClick={() => (window.location.href = "/dashboard/screening/quick")}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Back to Name Screening
            </Button>
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Quick Screening Results</h1>
                  <p className="text-sm text-muted-foreground">
                    Review and annotate candidate matches before exporting your report.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className={FIELD_LABEL_CLASS}>Subject</p>
                <p className="truncate text-3xl font-semibold tracking-tight text-foreground" title={searchedFor}>
                  {searchedFor}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full border border-border/60 bg-background/90 px-3 py-1.5 text-foreground">
                    {getSubjectTypeLabel(customerType)}
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/90 px-3 py-1.5 text-muted-foreground">
                    Log ID: {screeningLogId}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" className="h-10 rounded-xl px-4" onClick={handleDownloadSessionPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl px-4"
                  onClick={() => (window.location.href = "/dashboard/screening/quick")}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  New Search
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/85 p-4 shadow-sm">
              <p className={FIELD_LABEL_CLASS}>Screening Snapshot</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/30 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Sources Checked</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{bestBySource.length}</p>
                </div>
                <div className="rounded-xl bg-muted/30 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Candidates Reviewed</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{totalSearch}</p>
                </div>
                <div className="rounded-xl bg-muted/30 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Matches Found</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{totalFound}</p>
                </div>
                <div className="rounded-xl bg-muted/30 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Hit Rate</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{hitRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="p-5 sm:p-6">
          {/* Bulk select and bulk decision UI */}
          {totalSearch > 0 && (
            <div className="mb-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-primary"
                  id="select-all-candidates"
                />
                <label htmlFor="select-all-candidates" className="font-medium text-sm text-muted-foreground">
                  Select All Results
                </label>
              </div>
              {selectedCandidates.length > 0 && (
                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 flex flex-wrap gap-6 items-end">
                  <div className="flex flex-col gap-2 mb-4">
                    <Label>Bulk Decision:</Label>
                    <RadioGroup
                      className="flex items-center gap-4"
                      value={bulkDecision || ''}
                      onValueChange={val => setBulkDecision(val as SourceDecision)}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Relevant" id="bulk-decision-relevant" />
                        <Label htmlFor="bulk-decision-relevant">Relevant</Label>
                        <RadioGroupItem value="Irrelevant" id="bulk-decision-irrelevant" />
                        <Label htmlFor="bulk-decision-irrelevant">Irrelevant</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bulk Result Type:</Label>
                    <Select
                      value={bulkResultType || ''}
                      onValueChange={val => setBulkResultType(val)}
                    >
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="No Annotation" />
                      </SelectTrigger>
                      <SelectContent>
                        {ANNOTATION_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[280px]">
                    <Label>Bulk Annotation:</Label>
                    <Input
                      value={bulkAnnotation || ''}
                      onChange={e => setBulkAnnotation(e.target.value)}
                      placeholder="Type annotation for all selected..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={() => {
                      selectedCandidates.forEach(key => {
                        const [source, candidateId] = key.split(":")
                        // Save for candidate
                        setSavedByCandidate(prev => ({
                          ...prev,
                          [key]: {
                            decision: bulkDecision ?? null,
                            annotationChoice: bulkResultType || "",
                            annotationText: bulkAnnotation || "",
                          },
                        }))
                        // Set fields for candidate
                        setSourceDecision(prev => ({ ...prev, [source]: bulkDecision }))
                        setSourceAnnotationChoice(prev => ({ ...prev, [source]: bulkResultType }))
                        setSourceAnnotationText(prev => ({ ...prev, [source]: bulkAnnotation }))
                      })
                    }}
                    disabled={!bulkDecision || !bulkResultType}
                  >
                    Apply to Selected
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="mb-6 border-b border-border/50 pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Candidate Review</h2>
              <p className="text-sm text-muted-foreground">
                Save a decision and annotation for each candidate before exporting.
              </p>
            </div>
          </div>

          {totalSearch === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-10 text-center">
              <p className="text-base font-medium text-foreground">No matches found for this search.</p>
              <p className="mt-1 text-sm text-muted-foreground">Run a new screening with additional details.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {bestBySource.map((src) =>
                (src.data || []).map((candidate) => {
                  if (!candidate) return null

                  const c = candidate
                  const candidateKey = `${src.source}:${c.id}`
                  const isSaved = !!savedByCandidate[candidateKey]
                  const canSave = !!(
                    sourceDecision[src.source] &&
                    sourceAnnotationChoice[src.source] &&
                    sourceAnnotationChoice[src.source] !== "No Annotation"
                  )
                  const isDownloading = downloadingKey === candidateKey
                  const confidence = confidenceNum(c.confidence)

                  return (
                    <li
                      key={candidateKey}
                      className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition hover:border-primary/30 sm:p-5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidateKey)}
                          onChange={() => toggleSelectCandidate(candidateKey)}
                          className="w-5 h-5 accent-primary"
                          id={`select-candidate-${candidateKey}`}
                        />
                        <label htmlFor={`select-candidate-${candidateKey}`} className="text-sm text-muted-foreground">
                          Select
                        </label>
                      </div>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                          </div>

                          <a
                            href={`/dashboard/screening/entity/${c.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-full items-center gap-2 truncate text-xl font-semibold tracking-tight text-primary hover:underline"
                          >
                            <span className="truncate">{c.name || "-"}</span>
                            <ExternalLink className="h-4 w-4 shrink-0" />
                          </a>

                          <p className="text-sm text-muted-foreground">Candidate ID: #{c.id}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${getConfidenceColor(confidence)}`}
                          >
                            Confidence: {confidence !== 0 ? (confidence / 100).toFixed(2) : confidence}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className={FIELD_LABEL_CLASS}>Country</p>
                          <p className="mt-1 text-foreground">{c.nationality || "-"}</p>
                        </div>
                        <div>
                          <p className={FIELD_LABEL_CLASS}>Date of Birth</p>
                          <p className="mt-1 text-foreground">{c.dob || "-"}</p>
                        </div>
                        <div>
                          <p className={FIELD_LABEL_CLASS}>Gender</p>
                          <p className="mt-1 text-foreground">{c.gender || "-"}</p>
                        </div>
                        <div>
                          <p className={FIELD_LABEL_CLASS}>Address</p>
                          <p className="mt-1 truncate text-foreground" title={c.address || "-"}>
                            {c.address || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-border/60 bg-card/80 p-4">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1.8fr_auto] xl:items-end">
                          <div className={FIELD_GROUP_CLASS}>
                            <Label className={FIELD_LABEL_CLASS}>Decision</Label>
                            <RadioGroup
                              className="flex h-10 items-center gap-5 rounded-xl border border-border/60 bg-background/90 px-3"
                              value={sourceDecision[src.source] || ""}
                              disabled={isSaved}
                              onValueChange={(val) =>
                                setSourceDecision((prev) => ({
                                  ...prev,
                                  [src.source]: val as SourceDecision,
                                }))
                              }
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="Relevant" id={`decision-relevant-${src.source}-${c.id}`} />
                                <Label
                                  htmlFor={`decision-relevant-${src.source}-${c.id}`}
                                  className="text-sm font-medium text-foreground"
                                >
                                  Relevant
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="Irrelevant" id={`decision-irrelevant-${src.source}-${c.id}`} />
                                <Label
                                  htmlFor={`decision-irrelevant-${src.source}-${c.id}`}
                                  className="text-sm font-medium text-foreground"
                                >
                                  Irrelevant
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className={FIELD_GROUP_CLASS}>
                            <Label className={FIELD_LABEL_CLASS}>Result Type</Label>
                            <Select
                              value={sourceAnnotationChoice[src.source] || "No Annotation"}
                              disabled={isSaved}
                              onValueChange={(val) =>
                                setSourceAnnotationChoice((prev) => ({
                                  ...prev,
                                  [src.source]: val,
                                }))
                              }
                            >
                              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                                <SelectValue placeholder="Select annotation" />
                              </SelectTrigger>
                              <SelectContent>
                                {ANNOTATION_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className={FIELD_GROUP_CLASS}>
                            <Label className={FIELD_LABEL_CLASS} htmlFor={`annotation-input-${src.source}-${c.id}`}>
                              Annotation
                            </Label>
                            <Input
                              id={`annotation-input-${src.source}-${c.id}`}
                              className={FIELD_CLASS}
                              value={sourceAnnotationText[src.source] || ""}
                              disabled={isSaved}
                              onChange={(e) =>
                                setSourceAnnotationText((prev) => ({
                                  ...prev,
                                  [src.source]: e.target.value,
                                }))
                              }
                              placeholder="Type annotation details..."
                            />
                          </div>

                          {isSaved ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                              onClick={() => editForCandidate(src.source, c.id)}
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                              disabled={!canSave}
                              onClick={() => saveForCandidate(src.source, c.id)}
                            >
                              Save
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
