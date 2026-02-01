import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Helper to determine Risk Level based on confidence
const getRiskLevel = (score: number) => {
  if (score >= 90) return { label: "High", color: [239, 68, 68] as [number, number, number] } // Red
  if (score >= 50) return { label: "Medium", color: [245, 158, 11] as [number, number, number] } // Orange
  return { label: "Low", color: [34, 197, 94] as [number, number, number] } // Green
}

export async function generateScreeningSessionPDF({
  searchedFor,
  customerType,
  bestBySource,
  sourceDecision,
  sourceAnnotationChoice,
  sourceAnnotationText,
  detailsById,
  total_search,
}: {
  searchedFor: string
  customerType: string
  bestBySource: any[]
  sourceDecision: Record<string, string | null>
  sourceAnnotationChoice: Record<string, string>
  sourceAnnotationText: Record<string, string>
  detailsById: Record<string, any>
  total_search?: number
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  // --- HEADER ---
  doc.setFillColor(110, 70, 255)
  doc.rect(0, 0, pageWidth, 25, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("AML Meter", margin, 16)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Case ID: AML-CASE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - margin, 16, { align: "right" })

  // --- TITLE ---
  let y = 40
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("Screening Result Report", margin, y)
  y += 7
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`Screening summary and supporting evidence for ${customerType}`, margin, y)
  y += 5
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageWidth - margin, y)
  y += 12

  // --- CASE SUMMARY & OUTCOME (Two Columns) ---
  const colWidth = (contentWidth - 6) / 2
  const topBoxHeight = 55
  
  // Left Box: Case Summary
  doc.setDrawColor(200, 200, 200)
  doc.roundedRect(margin, y, colWidth, topBoxHeight, 3, 3)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Case Summary", margin + 5, y + 8)

  const hasPep = bestBySource.some(src => (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1')));
  
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  let summaryY = y + 16
  const summaryItems = [
    ["Subject Name:", searchedFor],
    ["Subject Type:", customerType == "individual" ? "Individual" : (customerType == "entity" ? "Entity" : "Vessel")],
    ["Total Search:", total_search?.toString() || "0"],
    ["Screening Type:", "Automated Quick Search"],
    ["PEP Identified:", hasPep ? "YES" : "No"]
  ]
  summaryItems.forEach(([label, val]) => {
    // Highlight PEP YES in red if found
    if (label === "PEP Identified:" && val === "YES") {
        doc.setFont("helvetica", "bold"); doc.text(label, margin + 5, summaryY)
        doc.setTextColor(220, 38, 38); // Red
        doc.setFont("helvetica", "bold"); doc.text(val, margin + 35, summaryY)
        doc.setTextColor(0, 0, 0); // Reset
    } else {
        doc.setFont("helvetica", "bold"); doc.text(label, margin + 5, summaryY)
        doc.setFont("helvetica", "normal"); doc.text(val, margin + 35, summaryY)
    }
    summaryY += 6
  })

  // Right Box: Outcome
  const maxConf = Math.max(...bestBySource.map(s => s.best_confidence || 0))
  const risk = getRiskLevel(maxConf)
  
  doc.roundedRect(margin + colWidth + 6, y, colWidth, topBoxHeight, 3, 3)
  doc.setFont("helvetica", "bold")
  doc.text("Outcome", margin + colWidth + 11, y + 8)
  
  // Risk Badge
  doc.setFillColor(...risk.color)
  doc.roundedRect(margin + contentWidth - 35, y + 4, 30, 6, 2, 2, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text(`Risk: ${risk.label}`, margin + contentWidth - 20, y + 8.2, { align: "center" })

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold"); doc.text("Final Decision:", margin + colWidth + 11, y + 16)
  doc.setFont("helvetica", "normal"); doc.text("Pending Review", margin + colWidth + 40, y + 16)
  
  doc.setFont("helvetica", "bold"); doc.text("Confidence Score:", margin + colWidth + 11, y + 24)
  doc.setFont("helvetica", "normal"); doc.text(`${maxConf}/100`, margin + colWidth + 45, y + 24)

  y += topBoxHeight + 15

  // --- MATCH SUMMARY TABLE ---
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("Match Summary", margin, y)
  y += 5

  const tableData = bestBySource.map(src => {
    const hits = (src.data || []).filter(Boolean).length
    const sourceHasPep = (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1'));
    
    return [
      sourceHasPep ? `${src.source} (PEP)` : src.source,
      hits,
      hits > 0 ? `${src.best_confidence}/100` : "-",
      hits > 0 ? (sourceDecision[src.source] || "Review") : "Clear",
      sourceAnnotationChoice[src.source] || "No Comment"
    ]
  })

  autoTable(doc, {
    startY: y,
    head: [["Source List", "Matches", "Highest Match", "Status", "Notes"]],
    body: tableData,
    headStyles: { fillColor: [110, 70, 255] },
    margin: { left: margin, right: margin },
    theme: "striped"
  })

  y = (doc as any).lastAutoTable.finalY + 15

  // --- DETAILED RESULTS ---
  doc.setFontSize(13)
  doc.text("Supporting Evidence", margin, y)
  y += 8

  bestBySource.forEach(src => {
    const candidates = (src.data || []).filter(Boolean)
    candidates.forEach((c: any) => {
      if (y > 230) { doc.addPage(); y = 30 }
      
      const riskInfo = getRiskLevel(c.confidence)
      // Updated PEP check here as well
      const isPep = c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1';

      const boxHeight = isPep ? 51 : 45;
      doc.setDrawColor(200, 200, 200)
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2)
      
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(`${src.source} Result Details`, margin + 5, y + 8)
      
      // Hit Badge
      doc.setFillColor(...riskInfo.color)
      doc.roundedRect(margin + contentWidth - 35, y + 4, 30, 6, 2, 2, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.text(`${c.confidence}% Match`, margin + contentWidth - 20, y + 8.2, { align: "center" })

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      let detailY = y + 16
      doc.setFont("helvetica", "bold"); doc.text("Matched Name:", margin + 5, detailY)
      doc.setFont("helvetica", "normal"); doc.text(c.name || "-", margin + 35, detailY)
      detailY += 6

      if (isPep) {
        doc.setFont("helvetica", "bold"); doc.text("PEP Status:", margin + 5, detailY)
        doc.setTextColor(220, 38, 38)
        doc.setFont("helvetica", "bold"); doc.text("Politically Exposed Person", margin + 35, detailY)
        doc.setTextColor(0, 0, 0)
        detailY += 6
      }

      doc.setFont("helvetica", "bold"); doc.text("Decision:", margin + 5, detailY)
      doc.setFont("helvetica", "normal"); doc.text(sourceDecision[src.source] || "Not Set", margin + 35, detailY)
      detailY += 6
      doc.setFont("helvetica", "bold"); doc.text("Annotation:", margin + 5, detailY)
      const annotationText = sourceAnnotationChoice[src.source] === 'Other' ? sourceAnnotationText[src.source] : sourceAnnotationChoice[src.source]
      doc.setFont("helvetica", "normal"); doc.text(annotationText || "None", margin + 35, detailY)
      detailY += 6
      doc.setFont("helvetica", "bold"); doc.text("Address:", margin + 5, detailY)
      const addr = doc.splitTextToSize(c.address || "N/A", contentWidth - 45)
      doc.setFont("helvetica", "normal"); doc.text(addr, margin + 35, detailY)

      y += boxHeight + 10 // Dynamic spacing based on box height
    })
  })

  // --- FOOTER ---
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Confidential - AML Compliance Report`, margin, 285)
    doc.text(`Generated: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`, pageWidth - margin, 285, { align: "right" })
  }

  doc.save(`AML_Report_${searchedFor.replace(/\s+/g, '_')}.pdf`)
}