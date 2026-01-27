import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export type Candidate = {
  id: number
  source: string
  subject_type: string
  name: string
  original_name?: string | null
  confidence: number
  nationality?: string | null
  country?: string | null
  address?: string | null
  sanctions?: string | null
  other_information?: string | null
  dob?: string | null
  gender?: string | null
}

export type BestBySourceItem = {
  source: string
  best_confidence: boolean
  data: Array<Candidate | null>
  total_search?: number
}

export type SourceDecision = "relevant" | "irrelevant" | "no_sp" | null

export async function generateScreeningSessionPDF({
  searchedFor,
  bestBySource,
  sourceDecision,
  sourceAnnotationChoice,
  sourceAnnotationText,
  detailsById,
  total_search,
}: {
  searchedFor: string
  bestBySource: BestBySourceItem[]
  sourceDecision: Record<string, SourceDecision>
  sourceAnnotationChoice: Record<string, string>
  sourceAnnotationText: Record<string, string>
  detailsById: Record<string, any>
  total_search?: number
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // --- COVER PAGE ---
  doc.setFillColor(110, 70, 255) // More purple background
  const coverHeight = 110
  // Draw a larger header background
  // (height increased from 80 to 110)
  doc.rect(0, 0, pageWidth, coverHeight, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(36)
  doc.setFont("helvetica", "bold")
  doc.text("AML Meter", pageWidth / 2, 40, { align: "center" })
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("AML Name Screening Report", pageWidth / 2, 62, { align: "center" })
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text(`Searched For:`, pageWidth / 2, 80, { align: "center" })
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(searchedFor, pageWidth / 2, 92, { align: "center" })
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 104, { align: "center" })
  doc.setTextColor(0, 0, 0)

  // Add a new page for the rest of the report
  doc.addPage()
  let y = 30

  // --- EXECUTIVE SUMMARY (Single Page) ---
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Executive Summary", margin, y)
  y += 8
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  // Audit statistics (moved to bottom)
  // Use total_search from the response if available
  const totalSearch = total_search ? total_search : 0;
  const totalHits = bestBySource.reduce((acc, src) => acc + (src.data ? src.data.filter(Boolean).length : 0), 0)
  const totalSources = bestBySource.length
  const sourcesWithHits = bestBySource.filter(src => (src.data || []).filter(Boolean).length > 0).map(src => src.source)
  const sourcesWithoutHits = bestBySource.filter(src => !(src.data || []).filter(Boolean).length).map(src => src.source)

  // Build summary hint
  let summaryHint = ""
  if (sourcesWithHits.length === 0) {
    summaryHint = `No Match found under ${bestBySource.map(s => s.source).join(", ")}`
  } else if (sourcesWithoutHits.length === 0) {
    summaryHint = `Match found under ${bestBySource.map(s => s.source).join(", ")}`
  } else {
    summaryHint = `Match found under ${sourcesWithHits.join(", ")}. No match found under ${sourcesWithoutHits.join(", ")}.`
  }

  // Executive summary as a sentence
  const sourcesCount = bestBySource.length
  const foundCount = sourcesWithHits.length
  let summarySentence = `Screening was performed across ${sourcesCount} sources. Results were found in ${foundCount} source${foundCount !== 1 ? 's' : ''}.`
  if (foundCount === 0) summarySentence = `Screening was performed across ${sourcesCount} sources. No results were found in any source.`
  doc.text(summarySentence, margin, y, { maxWidth: pageWidth - margin * 2 })
  y += 8
  doc.setFont("helvetica", "bold")
  doc.text("Summary:", margin, y)
  doc.setFont("helvetica", "normal")
  doc.text(summaryHint, margin + 20, y, { maxWidth: pageWidth - margin * 2 - 20 })
  y += 8
  doc.setFont("helvetica", "normal")
  doc.text(`Report generated on: ${new Date().toLocaleString()}`, margin, y)
  y += 10

  // Ensure executive summary fits on a single page
  if (y > 250) { doc.addPage(); y = 20 }

  // --- RESULT PAGE (Overview) ---
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("Screening Results Overview", margin, y)
  y += 7
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  for (const src of bestBySource) {
    if (y > 260) { doc.addPage(); y = 20 }
    const hasResult = (src.data || []).filter(Boolean).length > 0
    doc.setFont("helvetica", hasResult ? "bold" : "normal")
    doc.text(`• ${src.source}: ${hasResult ? "Result found" : "No result found"}`, margin, y)
    y += 6
  }

  // --- DETAILED NAME MATCH REPORT ---
  y += 6
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("Detailed Name Match & Hit Report", margin, y)
  y += 7
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  for (const src of bestBySource) {
    const candidates = (src.data || []).filter(Boolean) as Candidate[]
    if (candidates.length === 0) continue
    if (y > 240) { doc.addPage(); y = 20 }
    y += 4
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(59, 130, 246)
    doc.text(src.source, margin, y)
    doc.setTextColor(0, 0, 0)
    y += 7
    for (const c of candidates) {
      if (y > 250) { doc.addPage(); y = 20 }
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(`Name: ${c.name || "-"}`, margin + 2, y)
      y += 5
      if (c.original_name) { doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(`Original Name: ${c.original_name}`, pageWidth - margin * 2 - 2); doc.text(lines, margin + 2, y); y += lines.length * 5 }
      if (c.nationality || c.country) { doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(`Country/Nationality: ${c.nationality || c.country}`, pageWidth - margin * 2 - 2); doc.text(lines, margin + 2, y); y += lines.length * 5 }
      if (c.address) {
        doc.setFont("helvetica", "normal");
        doc.text(`Address:`, margin + 2, y)
        y += 5
        // Wrap address lines and long lines
        const addressLines = c.address.split(/\r?\n/).flatMap(line => {
          const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2 - 8)
          return wrapped
        })
        for (const line of addressLines) {
          doc.text(line, margin + 8, y)
          y += 5
        }
      }
      if (c.sanctions) { doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(`Sanctions: ${c.sanctions}`, pageWidth - margin * 2 - 2); doc.text(lines, margin + 2, y); y += lines.length * 5 }
      if (c.other_information) { doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(`Other Information: ${c.other_information}`, pageWidth - margin * 2 - 2); doc.text(lines, margin + 2, y); y += lines.length * 5 }
      // Annotation & Decision
      const anno = sourceAnnotationChoice[src.source] || "-"
      const annoText = sourceAnnotationText[src.source] || ""
      const dec = sourceDecision[src.source] || "-"
      y += 2
      doc.setFont("helvetica", "bold")
      const annoLines = doc.splitTextToSize(`Annotation: ${anno}${anno === "Other" ? ` - ${annoText}` : ""}`, pageWidth - margin * 2 - 2)
      doc.text(annoLines, margin + 2, y)
      y += annoLines.length * 5
      doc.setFont("helvetica", "bold")
      doc.text(`Decision: ${dec}`, margin + 2, y)
      y += 8
    }
    y += 2
  }

  // --- AUDIT STATISTICS AT BOTTOM ---
  if (y > 250) { doc.addPage(); y = 20 }
  y += 8
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Audit Statistics", margin, y)
  y += 7
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  // Use autoTable for audit statistics
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total checks performed", totalSearch],
      ["Total results found", totalHits],
      // ["Total sources", totalSources],
      // ["Sources with hits", sourcesWithHits.length],
      // ["Sources without hits", sourcesWithoutHits.length],
    ],
    theme: "grid",
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [110, 70, 255], textColor: 255 },
    styles: { fontSize: 10 },
  })
  y = (doc as any).lastAutoTable.finalY + 8

  // --- FOOTER ---
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${pageCount} | Confidential Report`,
      pageWidth / 2,
      290,
      { align: "center" }
    )
    doc.setTextColor(0, 0, 0)
  }

  doc.save(`screening_session_report_${new Date().getTime()}.pdf`)
}
