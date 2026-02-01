"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"
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
    data?: {
        searched_for?: string
        customer_type?: string
        total_candidates?: number
        best_by_source?: BestBySourceItem[]
        total_search?: number
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
    { value: "False Positive", label: "False Positive" },
    { value: "Name Match Only", label: "Name Match Only" },
    { value: "Insufficient Data", label: "Insufficient Data" },
    { value: "Needs Review", label: "Needs Review" },
    { value: "No Comment", label: "No Comment" },
    { value: "Other", label: "Other (type below)" },
] as const

type EntityDetailsResponse = {
    data?: Record<string, any>
}

export default function QuickScreeningResultsPage() {
    const [payload, setPayload] = React.useState<ScreeningResponse | null>(null)
    const [detailsById, setDetailsById] = React.useState<Record<string, any>>({})

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
    const customerType = payload?.data?.customer_type || "individual"
    const bestBySource = payload?.data?.best_by_source || [];
    const totalSearch = payload?.data?.total_search || 0;

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
            nextAnnoChoice[src.source] = "No Comment"
            nextAnnoText[src.source] = ""
        }

        setSourceDecision(nextDecision)
        setSourceAnnotationChoice(nextAnnoChoice)
        setSourceAnnotationText(nextAnnoText)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload])

    React.useEffect(() => {
        (async () => {
            const allDetails: Record<string, any> = {}
            for (const src of bestBySource) {
                for (const c of (src.data || []).filter(Boolean) as Candidate[]) {
                    try {
                        const res = await fetch(`/api/sanction-entities/${c.id}`, { method: "GET", credentials: "include" })
                        const detailsPayload: EntityDetailsResponse = await res.json().catch(async () => ({}))
                        allDetails[`${c.id}`] = (detailsPayload as any)?.data || (detailsPayload as any)?.data?.data || (detailsPayload as any)?.data || {}
                    } catch {
                        allDetails[`${c.id}`] = {}
                    }
                }
            }
            setDetailsById(allDetails)
        })()
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
            const annotationChoice = sourceAnnotationChoice[c.source] || "No Comment"
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

    const handleDownloadSessionPDF = async () => {
        await generateScreeningSessionPDF({
            searchedFor,
            customerType,
            bestBySource,
            sourceDecision,
            sourceAnnotationChoice,
            sourceAnnotationText,
            detailsById,
            total_search: totalSearch,
        })
    }
    const getConfidenceColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
        if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

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
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="text-sm text-muted-foreground">Searched for</div>
                    <div className="text-2xl font-semibold">{searchedFor}</div>
                    {/* <div className="text-sm text-muted-foreground mt-1">
                        Found results in {bestBySource.filter(src => (src.data || []).filter(Boolean).length > 0).length} out of {bestBySource.length} sources
                    </div> */}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadSessionPDF}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Report
                    </Button>
                    <Button variant="outline" onClick={() => (window.location.href = "/dashboard/screening/quick")}>New Search</Button>
                </div>
            </div>

            {/* List view for results */}
            <div className="bg-white rounded shadow p-4">
                {/* <p className="text-sm text-muted-foreground">Found {bestBySource.length} results</p> */}
                {totalSearch === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-lg">No results found.</div>
                ) : (
                    <ul className="space-y-4">
                        {bestBySource.map((src) => (
                            (src.data || []).map((c) => {
                                if (!c) return null;
                                return (
                                    <li key={`${src.source}:${c.id}`} className="border rounded p-4 flex flex-col gap-2 shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-base">{c.name || '-'}</div>
                                                {/* <div className="text-xs text-muted-foreground">Source: {src.source}</div> */}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                {/* <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">{c.subject_type}</span> */}
                                                <span className={`text-[15px] font-bold px-2 py-0.5 rounded-full border ${getConfidenceColor(c.confidence)}`}>
                                                    Confidence Level: {c.confidence}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            {c.nationality && <span>🌍 {c.nationality}</span>}
                                            {c.address && <span>📍 {c.address}</span>}
                                            {c.dob && <span>📅 {c.dob}</span>}
                                            {c.gender && <span>👤 {c.gender}</span>}
                                        </div>
                                        {/* Interactive annotation and decision system */}
                                        <div className="mt-2 text-xs space-y-2">
                                            <div>
                                                <Label>Decision:</Label>
                                                <RadioGroup
                                                    className="flex gap-4 mt-1"
                                                    value={sourceDecision[src.source] || ''}
                                                    onValueChange={(val) => setSourceDecision((prev) => ({ ...prev, [src.source]: val as SourceDecision }))}
                                                >
                                                    <RadioGroupItem value="relevant" id={`decision-relevant-${src.source}`} />
                                                    <Label htmlFor={`decision-relevant-${src.source}`}>Relevant</Label>
                                                    <RadioGroupItem value="irrelevant" id={`decision-irrelevant-${src.source}`} />
                                                    <Label htmlFor={`decision-irrelevant-${src.source}`}>Irrelevant</Label>
                                                    {/* <RadioGroupItem value="no_sp" id={`decision-nosp-${src.source}`} />
                                                    <Label htmlFor={`decision-nosp-${src.source}`}>No SP</Label> */}
                                                </RadioGroup>
                                            </div>
                                            <div>
                                                <Label className="mb-2">Annotation:</Label>
                                                <Select
                                                    value={sourceAnnotationChoice[src.source] || ''}
                                                    onValueChange={(val) => setSourceAnnotationChoice((prev) => ({ ...prev, [src.source]: val }))}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue placeholder="Select annotation" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ANNOTATION_OPTIONS.map(opt => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {sourceAnnotationChoice[src.source] === 'Other' && (
                                                    <Input
                                                        className="mt-2 w-60"
                                                        value={sourceAnnotationText[src.source] || ''}
                                                        onChange={e => setSourceAnnotationText((prev) => ({ ...prev, [src.source]: e.target.value }))}
                                                        placeholder="Type your annotation..."
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}