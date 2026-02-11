import jsPDF from "jspdf"

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

type SourceDecision = "relevant" | "irrelevant" | "Relevant" | "Irrelevant" | "no_sp" | string | null

function safeString(v: any) {
    if (v === null || v === undefined) return ""
    if (typeof v === "string") return v
    if (typeof v === "number" || typeof v === "boolean") return String(v)
    try {
        return JSON.stringify(v)
    } catch {
        return String(v)
    }
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 6) {
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * lineHeight
}

function addSectionHeader(doc: jsPDF, title: string, y: number, margin: number) {
    doc.setFillColor(59, 130, 246) // Blue
    doc.rect(margin, y - 5, doc.internal.pageSize.getWidth() - margin * 2, 10, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(title, margin + 3, y + 1)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    return y + 12
}

function addLabelValue(doc: jsPDF, label: string, value: string, x: number, y: number, labelWidth = 50) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text(label + ":", x, y)
    doc.setFont("helvetica", "normal")
    doc.text(value, x + labelWidth, y)
    return y + 7
}

function addDivider(doc: jsPDF, y: number, margin: number) {
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    return y + 5
}

function objectToLines(obj: Record<string, any>) {
    const lines: string[] = []
    const keys = Object.keys(obj || {})
    for (const k of keys) {
        lines.push(`${k}: ${safeString(obj[k])}`)
    }
    return lines
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

function decisionLabel(decision: SourceDecision): string {
    if (!decision) return "Not selected"
    const d = decision.toLowerCase()
    if (d === "relevant") return "Relevant"
    if (d === "irrelevant") return "Irrelevant"
    if (d === "no_sp") return "Not any S.P."
    return decision
}

function annotationLabel(annotationChoice: string, annotationText: string): string {
    const labels: Record<string, string> = {
        false_positive: "False positive",
        name_match_only: "Name match only",
        insufficient_data: "Insufficient data",
        needs_review: "Needs review",
        other: annotationText || "Other",
    }
    return labels[annotationChoice] || "Not selected"
}

export async function generateScreeningPDF(
    candidate: Candidate,
    searchedFor: string,
    detailData: Record<string, any>,
    decision: SourceDecision,
    annotationChoice: string,
    annotationText: string
) {
    const conf = confidenceNum(candidate.confidence)

    const doc = new jsPDF({ unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - margin * 2

    // Header function for all pages
    const addPageHeader = (pageNum: number) => {
        doc.setFillColor(59, 130, 246)
        doc.rect(0, 0, pageWidth, 15, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text("AML Screening Report", margin, 10)
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.text(`Page ${pageNum}`, pageWidth - margin - 20, 10, { align: "right" })
        doc.setTextColor(0, 0, 0)
    }

    // Footer function for all pages
    const addPageFooter = () => {
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
            `Generated: ${new Date().toLocaleString()} | Confidential Report`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        )
        doc.setTextColor(0, 0, 0)
    }

    // ==================== PAGE 1: COVER PAGE ====================
    let pageNum = 1
    
    // Blue header banner
    doc.setFillColor(59, 130, 246)
    doc.rect(0, 0, pageWidth, 60, "F")
    
    // Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text("SCREENING REPORT", pageWidth / 2, 30, { align: "center" })
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Compliance & Due Diligence Analysis", pageWidth / 2, 45, { align: "center" })
    
    doc.setTextColor(0, 0, 0)
    
    // Summary box
    let y = 80
    doc.setFillColor(245, 247, 250)
    doc.rect(margin, y, maxWidth, 60, "F")
    doc.setDrawColor(200, 200, 200)
    doc.rect(margin, y, maxWidth, 60, "S")
    
    y += 10
    doc.setFontSize(11)
    y = addLabelValue(doc, "Searched For", searchedFor, margin + 10, y, 45)
    y = addLabelValue(doc, "Candidate Name", candidate.name, margin + 10, y, 45)
    y = addLabelValue(doc, "Source", candidate.source, margin + 10, y, 45)
    y = addLabelValue(doc, "Confidence Score", `${conf.toFixed(2)}%`, margin + 10, y, 45)
    y = addLabelValue(doc, "Result", resultLabel(conf), margin + 10, y, 45)
    y = addLabelValue(doc, "Generated Date", new Date().toLocaleDateString(), margin + 10, y, 45)
    
    addPageFooter()

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
    doc.addPage()
    pageNum++
    addPageHeader(pageNum)
    
    y = 25
    y = addSectionHeader(doc, "EXECUTIVE SUMMARY", y, margin)
    
    doc.setFontSize(10)
    y = addWrappedText(
        doc,
        "This report provides a comprehensive analysis of the screening result for the selected candidate. The screening process compares the searched entity against various sanctions lists, watchlists, and databases to identify potential matches.",
        margin,
        y,
        maxWidth
    )
    
    y += 10
    y = addDivider(doc, y, margin)
    y += 5
    
    // Key Findings
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Key Findings", margin, y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y += 10
    
    y = addLabelValue(doc, "Search Query", searchedFor, margin, y, 60)
    y = addLabelValue(doc, "Matched Candidate", candidate.name, margin, y, 60)
    y = addLabelValue(doc, "Data Source", candidate.source, margin, y, 60)
    y = addLabelValue(doc, "Subject Type", candidate.subject_type || "N/A", margin, y, 60)
    y = addLabelValue(doc, "Confidence Level", `${conf.toFixed(2)}%`, margin, y, 60)
    y = addLabelValue(doc, "Match Classification", resultLabel(conf), margin, y, 60)
    
    y += 5
    y = addDivider(doc, y, margin)
    y += 5
    
    // Confidence interpretation
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Confidence Score Interpretation", margin, y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y += 10
    
    doc.text("• 90-100%: High Confidence Match - Strong indication of identity match", margin + 5, y)
    y += 7
    doc.text("• 31-89%: Partial Match - Requires further investigation", margin + 5, y)
    y += 7
    doc.text("• 0-30%: Low Confidence - Likely false positive", margin + 5, y)
    
    addPageFooter()

    // ==================== PAGE 3: DETAILED RESULT ====================
    doc.addPage()
    pageNum++
    addPageHeader(pageNum)
    
    y = 25
    y = addSectionHeader(doc, "SCREENING RESULT", y, margin)
    
    // Result badge with color
    const resultText = resultLabel(conf)
    let badgeColor: [number, number, number] = [34, 197, 94] // Green
    if (conf > 90) {
        badgeColor = [239, 68, 68] // Red
    } else if (conf > 30) {
        badgeColor = [251, 191, 36] // Yellow/Orange
    }
    
    doc.setFillColor(...badgeColor)
    doc.roundedRect(margin, y, maxWidth, 25, 3, 3, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(resultText.toUpperCase(), pageWidth / 2, y + 16, { align: "center" })
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")
    
    y += 35
    
    // Candidate details
    doc.setFillColor(245, 247, 250)
    doc.rect(margin, y, maxWidth, 70, "F")
    doc.setDrawColor(200, 200, 200)
    doc.rect(margin, y, maxWidth, 70, "S")
    
    y += 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Candidate Information", margin + 5, y)
    doc.setFont("helvetica", "normal")
    y += 10
    
    y = addLabelValue(doc, "Name", candidate.name, margin + 10, y, 50)
    y = addLabelValue(doc, "Confidence Score", `${conf.toFixed(2)}%`, margin + 10, y, 50)
    y = addLabelValue(doc, "Subject Type", candidate.subject_type || "N/A", margin + 10, y, 50)
    y = addLabelValue(doc, "Nationality", candidate.nationality || "N/A", margin + 10, y, 50)
    y = addLabelValue(doc, "Gender", candidate.gender || "N/A", margin + 10, y, 50)
    y = addLabelValue(doc, "Date of Birth", candidate.dob || "N/A", margin + 10, y, 50)
    
    addPageFooter()

    // ==================== PAGE 4: DECISION & ANNOTATION ====================
    doc.addPage()
    pageNum++
    addPageHeader(pageNum)
    
    y = 25
    y = addSectionHeader(doc, "DECISION & ANNOTATION", y, margin)
    
    // Decision box
    doc.setFillColor(245, 247, 250)
    doc.rect(margin, y, maxWidth, 30, "F")
    doc.setDrawColor(200, 200, 200)
    doc.rect(margin, y, maxWidth, 30, "S")
    
    y += 10
    doc.setFontSize(11)
    y = addLabelValue(doc, "Analyst Decision", decisionLabel(decision), margin + 10, y, 50)
    y = addLabelValue(doc, "Decision Date", new Date().toLocaleDateString(), margin + 10, y, 50)
    
    y += 15
    
    // Annotation box
    doc.setFillColor(245, 247, 250)
    const annotationHeight = 40
    doc.rect(margin, y, maxWidth, annotationHeight, "F")
    doc.setDrawColor(200, 200, 200)
    doc.rect(margin, y, maxWidth, annotationHeight, "S")
    
    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Annotation:", margin + 10, y)
    doc.setFont("helvetica", "normal")
    y += 7
    
    const annotation = annotationLabel(annotationChoice, annotationText)
    y = addWrappedText(doc, annotation, margin + 10, y, maxWidth - 20, 6)
    
    y += annotationHeight - 15
    
    // Notes section
    y = addDivider(doc, y, margin)
    y += 10
    
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Recommendation", margin, y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y += 10
    
    if (conf > 90) {
        y = addWrappedText(
            doc,
            "HIGH RISK: This is a strong match. Recommend immediate review and potential escalation to compliance officer. Further due diligence required before proceeding.",
            margin,
            y,
            maxWidth,
            6
        )
    } else if (conf > 30) {
        y = addWrappedText(
            doc,
            "MEDIUM RISK: Partial match detected. Recommend additional verification and enhanced due diligence. Review supporting documentation and cross-reference with other sources.",
            margin,
            y,
            maxWidth,
            6
        )
    } else {
        y = addWrappedText(
            doc,
            "LOW RISK: Low confidence match, likely a false positive. Standard review procedures apply. Monitor for any additional risk indicators.",
            margin,
            y,
            maxWidth,
            6
        )
    }
    
    addPageFooter()

    // ==================== PAGE 5+: DETAILED ENTITY INFORMATION ====================
    doc.addPage()
    pageNum++
    addPageHeader(pageNum)
    
    y = 25
    y = addSectionHeader(doc, "DETAILED ENTITY INFORMATION", y, margin)
    
    doc.setFontSize(10)
    
    const detailKeys = Object.keys(detailData || {})
    
    if (detailKeys.length === 0) {
        doc.text("No additional details available.", margin, y)
    } else {
        for (const key of detailKeys) {
            if (y > pageHeight - 30) {
                addPageFooter()
                doc.addPage()
                pageNum++
                addPageHeader(pageNum)
                y = 25
            }
            
            const value = safeString(detailData[key])
            const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            
            doc.setFont("helvetica", "bold")
            doc.text(formattedKey + ":", margin, y)
            doc.setFont("helvetica", "normal")
            
            const wrappedValue = doc.splitTextToSize(value || "N/A", maxWidth - 60)
            doc.text(wrappedValue, margin + 60, y)
            
            y += Math.max(7, wrappedValue.length * 5)
        }
    }
    
    addPageFooter()

    const filename = `screening_report_${candidate.source}_${candidate.id}_${new Date().getTime()}.pdf`.replace(/\s+/g, "_")
    doc.save(filename)
}
