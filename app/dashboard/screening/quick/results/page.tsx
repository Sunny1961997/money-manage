"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateScreeningPDF } from "@/lib/screening-pdf-generator"

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
    data?: {
        searched_for?: string
        total_candidates?: number
        best_by_source?: BestBySourceItem[]
    }
}

type SourceDecision = "relevant" | "irrelevant" | "no_sp" | null

function band(conf: number) {
    if (conf >= 90) return { label: "High", cls: "bg-green-100 text-green-800 border-green-200" }
    if (conf > 30) return { label: "Fair", cls: "bg-blue-200 text-blue-800 border-blue-200" }
    return { label: "Low", cls: "bg-red-100 text-red-800 border-red-200" }
}

function confidenceNum(v: unknown) {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
}

function resultLabel(conf: number) {
    if (conf > 90) return "Match Found"
    if (conf > 30) return "Partial Match Found"
    return "False Positive"
}

function hasRelevantForSource(candidates: Candidate[]) {
    return candidates.some((c) => confidenceNum(c?.confidence) >= 90)
}

function hasIrrelevantForSource(candidates: Candidate[]) {
    return candidates.some((c) => {
        const v = confidenceNum(c?.confidence)
        return v > 30 && v < 90
    })
}

function hasNoSpForSource(candidates: Candidate[]) {
    return candidates.some((c) => confidenceNum(c?.confidence) < 30)
}

const ANNOTATION_OPTIONS = [
    { value: "false_positive", label: "False positive" },
    { value: "name_match_only", label: "Name match only" },
    { value: "insufficient_data", label: "Insufficient data" },
    { value: "needs_review", label: "Needs review" },
    { value: "other", label: "Other (type below)" },
] as const

type EntityDetailsResponse = {
    data?: Record<string, any>
}

export default function QuickScreeningResultsPage() {
    const [payload, setPayload] = React.useState<ScreeningResponse | null>(null)

    React.useEffect(() => {
        const raw = sessionStorage.getItem("screening_results")
        if (!raw) return
        try {
            setPayload(JSON.parse(raw))
        } catch {
            setPayload(null)
        }
    }, [])

    const searchedFor = payload?.data?.searched_for || "-"
    const bestBySource = payload?.data?.best_by_source || []

    const [sourceDecision, setSourceDecision] = React.useState<Record<string, SourceDecision>>({})
    const [sourceAnnotationChoice, setSourceAnnotationChoice] = React.useState<Record<string, string>>({})
    const [sourceAnnotationText, setSourceAnnotationText] = React.useState<Record<string, string>>({})
    const [downloadingKey, setDownloadingKey] = React.useState<string | null>(null)

    React.useEffect(() => {
        const nextDecision: Record<string, SourceDecision> = {}
        const nextAnnoChoice: Record<string, string> = {}
        const nextAnnoText: Record<string, string> = {}

        for (const src of bestBySource) {
            nextDecision[src.source] = null // Don't pre-select
            nextAnnoChoice[src.source] = "needs_review"
            nextAnnoText[src.source] = ""
        }

        setSourceDecision(nextDecision)
        setSourceAnnotationChoice(nextAnnoChoice)
        setSourceAnnotationText(nextAnnoText)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload])

    const downloadPdfForCandidate = async (c: Candidate) => {
        const key = `${c.source}:${c.id}`
        setDownloadingKey(key)
        try {
            // fetch details via proxy endpoint
            const res = await fetch(`/api/sanction-entities/${c.id}`, { method: "GET", credentials: "include" })
            const detailsPayload: EntityDetailsResponse = await res.json().catch(async () => ({}))
            console.log("Details payload:", detailsPayload)
            if (!res.ok) throw new Error(detailsPayload?.data?.message || "Failed to load entity details")

            const detailData = (detailsPayload as any)?.data || (detailsPayload as any)?.data?.data || (detailsPayload as any)?.data || {}

            // Get decision and annotation for this source
            const decision = sourceDecision[c.source] || null
            const annotationChoice = sourceAnnotationChoice[c.source] || "needs_review"
            const annotationText = sourceAnnotationText[c.source] || ""

            // Generate PDF with decision and annotation
            await generateScreeningPDF(c, searchedFor, detailData, decision, annotationChoice, annotationText)
        } catch (err) {
            console.error("PDF generation error:", err)
            alert("Failed to generate PDF: " + (err as Error).message)
        } finally {
            setDownloadingKey(null)
        }
    }

    if (!payload) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6 space-y-3">
                        <div className="text-sm text-muted-foreground">No results found in session. Run a search first.</div>
                        <Button onClick={() => (window.location.href = "/dashboard/screening/quick")}>Back to Quick Screening</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="text-sm text-muted-foreground">Searched for</div>
                    <div className="text-2xl font-semibold">{searchedFor}</div>
                </div>
                <Button variant="outline" onClick={() => (window.location.href = "/dashboard/screening/quick")}>
                    New Search
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                {bestBySource.map((src) => {
                    const candidates = (src.data || []).filter(Boolean) as Candidate[]
                    const hasData = candidates.length > 0

                    const showRelevant = hasRelevantForSource(candidates)
                    const showIrrelevant = hasIrrelevantForSource(candidates)
                    const showNoSp = hasNoSpForSource(candidates)

                    const dec = sourceDecision[src.source] ?? null

                    const anno = sourceAnnotationChoice[src.source] ?? "needs_review"
                    const showAnnoText = anno === "other"

                    // if (!hasData) return null

                    return (
                        <Card key={src.source} className="h-full">
                            <CardHeader className="space-y-3">
                                <div className="font-bold">Source: {src.source}</div>
                                <div className="space-y-2">
                                    {candidates.map((c) => {
                                        const conf = confidenceNum(c.confidence)
                                        const b = band(conf)
                                        const key = `${c.source}:${c.id}`
                                        const isDownloading = downloadingKey === key

                                        return (
                                            <div
                                                key={`${src.source}:${c.id}`}
                                                className="w-full rounded-md border px-3 py-2 flex items-start justify-between gap-3"
                                            >
                                                {/* LEFT: name + subject */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold break-words leading-snug">{c.name || "-"}</div>
                                                        </div>

                                                        {/* Download icon button (right side of name) */}
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => downloadPdfForCandidate(c)}
                                                            disabled={isDownloading}
                                                            className="h-8 w-8 shrink-0 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                            title={isDownloading ? "Preparing..." : "Download PDF"}
                                                            aria-label={isDownloading ? "Preparing PDF" : "Download PDF"}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="text-xs text-muted-foreground break-words">{c.subject_type || "-"}</div>
                                                </div>

                                                {/* RIGHT: confidence badge + percent */}
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <div className={`px-2 py-0.5 rounded-md border text-xs font-medium ${b.cls}`}>{b.label}</div>
                                                    <div className="text-xs text-muted-foreground tabular-nums">{conf.toFixed(2)}%</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Annotation (for this source) -> ONLY if there is data */}
                                {hasData ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Annotation (for this source)</Label>
                                            <Select
                                                value={anno}
                                                onValueChange={(v) => setSourceAnnotationChoice((p) => ({ ...p, [src.source]: v }))}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select annotation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ANNOTATION_OPTIONS.map((o) => (
                                                        <SelectItem key={o.value} value={o.value}>
                                                            {o.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {showAnnoText ? (
                                                <Input
                                                    value={sourceAnnotationText[src.source] ?? ""}
                                                    onChange={(e) => setSourceAnnotationText((p) => ({ ...p, [src.source]: e.target.value }))}
                                                    placeholder="Type your annotation..."
                                                    className="w-full"
                                                />
                                            ) : null}
                                        </div>

                                        
                                        <div className="flex flex-col gap-2">
                                            <div className="text-xs text-muted-foreground">Decision (for this source)</div>

                                            <div className="flex flex-wrap items-center gap-4">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`src-decision-${src.source}`}
                                                        checked={dec === "relevant"}
                                                        onChange={() => setSourceDecision((p) => ({ ...p, [src.source]: "relevant" }))}
                                                    />
                                                    Relevant
                                                </label>

                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`src-decision-${src.source}`}
                                                        checked={dec === "irrelevant"}
                                                        onChange={() => setSourceDecision((p) => ({ ...p, [src.source]: "irrelevant" }))}
                                                    />
                                                    Irrelevant
                                                </label>

                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`src-decision-${src.source}`}
                                                        checked={dec === "no_sp"}
                                                        onChange={() => setSourceDecision((p) => ({ ...p, [src.source]: "no_sp" }))}
                                                    />
                                                    Not any S.P.
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                    ) : (
                                        <div className="text-xs text-muted-foreground">No screening result found</div>
                                    )
                                }
                            </CardHeader>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}