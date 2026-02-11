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
    user_id?: number | string
    data?: {
        user_id?: number | string
        user_company?: string
        searched_for?: string
        subject_type?: string
        total_candidates?: number
        best_by_source?: BestBySourceItem[]
        total_search?: number
        total_found?: number
        user_name?: string
    }
}

type SourceDecision = "relevant" | "irrelevant" | "Relevant" | "Irrelevant" | "no_sp" | string | null

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
    // { value: "No Annotation", label: "Select Annotation" },
    { value: "True Match", label: "True Match" },
    { value: "Potential Match", label: "Potential Match" },
    { value: "No Match", label: "No Match" },
    // { value: "Potential Name Match", label: "Potential Name Match" },
    { value: "Insufficient Data", label: "Insufficient Data" },
    // { value: "Escalation Required", label: "Escalation Required" },
    // { value: "Name matched", label: "Name matched" },
    // { value: "Other", label: "Other (type below)" },
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
    const [savedTypedByCandidate, setSavedTypedByCandidate] = React.useState<Record<string, string>>({})

    React.useEffect(() => {
        const raw = sessionStorage.getItem("screening_results")
        if (!raw) return
        try {
            const parsed = JSON.parse(raw)
            console.log("Full payload:", parsed)
            console.log("User ID from payload:", parsed?.data?.user_id)
            console.log("User ID from company name:", parsed?.data?.user_company)
            setPayload(parsed)
        } catch {
            setPayload(null)
        }
    }, [])
    const userId = String(payload?.data?.user_id || payload?.user_id || "N/A")
    const userName = String(payload?.data?.user_name || "N/A")
    const userCompany = String(payload?.data?.user_company || "N/A")
    const searchedFor = payload?.data?.searched_for || "-"
    const customerType = payload?.data?.subject_type || "individual"
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
            nextAnnoChoice[src.source] = "No Annotation"
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
            const decision = (sourceDecision[c.source] || null) as SourceDecision
            const annotationChoice = sourceAnnotationChoice[c.source] || "No Annotation"
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
        // Build per-source maps from saved per-candidate data
        const pdfDecision: Record<string, string | null> = {}
        const pdfChoice: Record<string, string> = {}
        const pdfText: Record<string, string> = {}

        Object.entries(savedByCandidate).forEach(([key, v]) => {
            const source = key.split(":")[0]
            if (v.decision) pdfDecision[source] = v.decision
            if (v.annotationChoice) pdfChoice[source] = v.annotationChoice
            if (v.annotationText) pdfText[source] = v.annotationText
            pdfText[key] = v.annotationText
        })

        // Pass ALL sources for Match Summary, saved keys for Evidence filtering
        const savedKeys = Object.keys(savedByCandidate)

        // Count relevant and irrelevant from saved candidates
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
            user_id: userId,
            user_name: userName,
            user_company: userCompany,
            savedCandidateKeys: savedKeys,
            relevantCount: relCount,
            irrelevantCount: irrelCount,
        })
    }

    const getConfidenceColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
        if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const renderDetailValue = (value: any): React.ReactNode => {
        if (value === null || value === undefined) return <span className="text-muted-foreground">-</span>;
        if (typeof value === 'boolean') return value ? "Yes" : "No";
        
        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-muted-foreground">Empty</span>;
            return (
                <ul className="list-disc pl-4 space-y-1">
                    {value.map((item, i) => (
                        <li key={i} className="text-sm">{renderDetailValue(item)}</li>
                    ))}
                </ul>
            );
        }

        if (typeof value === 'object') {
            return (
                <div className="pl-3 border-l-2 border-muted space-y-1 mt-1">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                            <span className="font-medium text-muted-foreground capitalize">{k.replace(/_/g, ' ')}:</span>
                            <span>{renderDetailValue(v)}</span>
                        </div>
                    ))}
                </div>
            );
        }

        return String(value);
    };

    if (!payload) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6 space-y-3">
                        <div className="text-sm text-muted-foreground">No results found in session. Run a search first.</div>
                        <Button onClick={() => (window.location.href = "/dashboard/screening/quick")}>Back to Name Screening</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="border p-4 rounded rounded-bottom-xlsx pr-30">
                    <div className="flex items-center justify-start text-left">
                        <div className="text-2xl font-bold text-foreground">Subject:&nbsp;</div>
                        <div className="text-2xl font-semibold">{searchedFor}</div>
                    </div>
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
                {totalSearch === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-lg">No results found.</div>
                ) : (
                    <ul className="space-y-4">
                        {bestBySource.map((src) => (
                            (src.data || []).map((c) => {
                                if (!c) return null
                                const candidateKey = `${src.source}:${c.id}`
                                const isSaved = !!savedByCandidate[candidateKey]
                                const canSave = !!(sourceDecision[src.source] && sourceAnnotationChoice[src.source] && sourceAnnotationChoice[src.source] !== "No Annotation")

                                return (
                                    <li key={candidateKey} className="border rounded p-4 flex flex-col gap-2 shadow-lg">
                                        <div className="flex items-center justify-between p-2">
                                            <div>
                                                <a
                                                    href={`/dashboard/screening/entity/${c.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xl font-semibold text-base text-primary hover:underline cursor-pointer flex items-center gap-2"
                                                >
                                                    {c.name || '-'}
                                                    <span className="text-xs font-normal text-muted-foreground no-underline">(view details)</span>
                                                </a>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[15px] font-bold px-2 py-0.5 rounded-full border ${getConfidenceColor(c.confidence)}`}>
                                                    Confidence Level: {c.confidence !== 0 ? (c.confidence / 100).toFixed(2) : c.confidence}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 p-2 text-xs text-muted-foreground">
                                            {c.nationality && <span>Country: {c.nationality}</span>}
                                            {c.address && <span>Address: {c.address}</span>}
                                            {c.dob && <span>Date Of Birth: {c.dob}</span>}
                                            {c.gender && <span>Gender: {c.gender}</span>}
                                        </div>
                                        {/* Interactive annotation and decision system */}
                                        <div className="mt-2 text-xls space-y-2">
                                            <div className="p-2 flex items-center gap-4">
                                                <Label className="text-xls whitespace-nowrap">
                                                    Decision:
                                                </Label>

                                                <RadioGroup
                                                    className="flex items-center gap-4"
                                                    value={sourceDecision[src.source] || ''}
                                                    disabled={isSaved}
                                                    onValueChange={(val) =>
                                                        setSourceDecision((prev) => ({
                                                            ...prev,
                                                            [src.source]: val as SourceDecision,
                                                        }))
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem
                                                            value="Relevant"
                                                            id={`decision-relevant-${src.source}`}
                                                        />
                                                        <Label htmlFor={`decision-relevant-${src.source}`}>
                                                            Relevant
                                                        </Label>

                                                        <RadioGroupItem
                                                            value="Irrelevant"
                                                            id={`decision-irrelevant-${src.source}`}
                                                        />
                                                        <Label htmlFor={`decision-irrelevant-${src.source}`}>
                                                            Irrelevant
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                            <div className="p-3">
                                                <div className="flex flex-wrap items-end gap-6">

                                                    {/* Left: Result Type */}
                                                    <div className="flex flex-col gap-2">
                                                        <Label>Result Type:</Label>

                                                        <div className="flex items-center gap-3">
                                                            <Select
                                                                value={sourceAnnotationChoice[src.source] || ''}
                                                                disabled={isSaved}
                                                                onValueChange={(val) =>
                                                                    setSourceAnnotationChoice((prev) => ({
                                                                        ...prev,
                                                                        [src.source]: val,
                                                                    }))
                                                                }
                                                            >
                                                                <SelectTrigger className="w-56">
                                                                    <SelectValue placeholder="No Annotation" />
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
                                                    </div>

                                                    {/* Input field */}
                                                    <div className="flex flex-col gap-2 min-w-[280px]">
                                                        <Label htmlFor={`annotation-input-${src.source}`}>
                                                            Annotation:
                                                        </Label>

                                                        <Input
                                                            id={`annotation-input-${src.source}`}
                                                            className={`w-70 ${isSaved ? 'text-gray-400' : ''}`}
                                                            value={sourceAnnotationText[src.source] || ''}
                                                            disabled={isSaved}
                                                            onChange={(e) =>
                                                                setSourceAnnotationText((prev) => ({
                                                                    ...prev,
                                                                    [src.source]: e.target.value,
                                                                }))
                                                            }
                                                            placeholder="Type your annotation details here..."
                                                        />
                                                    </div>

                                                    {/* Save / Edit button */}
                                                    {isSaved ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="self-end bg-primary text-white hover:bg-primary/90"
                                                            onClick={() => editForCandidate(src.source, c.id)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="self-end bg-primary text-white hover:bg-primary/90"
                                                            disabled={!canSave}
                                                            onClick={() => saveForCandidate(src.source, c.id)}
                                                        >
                                                            Save
                                                        </Button>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}