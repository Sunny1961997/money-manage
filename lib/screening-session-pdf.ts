import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { YanoneKaffeesatzRegular, YanoneKaffeesatzBold } from "./fonts/yanone-kaffeesatz"
import {MarmeladRegular} from "./fonts/Marmelad-Regular"

// Helper to determine Risk Level based on confidence
// const getRiskLevel = (score: number) => {
//   if (score >= 90) return { label: "High", color: [239, 68, 68] as [number, number, number] } // Red
//   if (score >= 50) return { label: "Medium", color: [245, 158, 11] as [number, number, number] } // Orange
//   return { label: "Low", color: [34, 197, 94] as [number, number, number] } // Green
// }
// const addCustomFonts = (doc: jsPDF) => {
//   doc.addFileToVFS("YanoneKaffeesatz-Regular.ttf", YanoneKaffeesatzRegular)
//   doc.addFileToVFS("YanoneKaffeesatz-Bold.ttf", YanoneKaffeesatzBold)
//   doc.addFileToVFS("Marmelad-Regular.ttf", MarmeladRegular)

//   doc.addFont("YanoneKaffeesatz-Regular.ttf", "YanoneKaffeesatz", "normal")
//   doc.addFont("YanoneKaffeesatz-Bold.ttf", "YanoneKaffeesatz", "bold")
//   doc.addFont("Marmelad-Regular.ttf", "Marmelad", "normal")
// }
const getRiskLevel = (score: number) => {
  if (score >= 90) return { label: "True Match", color: [34, 197, 94] as [number, number, number] } // Green
  if (score >= 40) return { label: "Potential Match", color: [245, 158, 11] as [number, number, number] } // Orange
  return { label: "No Match", color: [239, 68, 68] as [number, number, number] } // Red
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
  user_id,
}: {
  searchedFor: string
  customerType: string
  bestBySource: any[]
  sourceDecision: Record<string, string | null>
  sourceAnnotationChoice: Record<string, string>
  sourceAnnotationText: Record<string, string>
  detailsById: Record<string, any>
  total_search?: number
  user_id?: string
}) {
  const doc = new jsPDF({ 
    unit: "mm", 
    format: "a4",
    compress: true 
  })
  // addCustomFonts(doc)
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  // --- HEADER ---
  doc.setFillColor(60, 0, 126)
  doc.rect(0, 0, pageWidth, 40, "F") // Full width header, increased height to 40mm

  const headerPadding = 15 // Padding inside the purple header

  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    img.src = `${baseUrl}/aml_meter_transparent.png`
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    // --- START IMAGE OPTIMIZATION ---
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Target width of 800px is more than enough for a 22mm logo
    const targetWidth = 800
    const targetHeight = (img.height / img.width) * targetWidth
    canvas.width = targetWidth
    canvas.height = targetHeight

    if (!ctx) throw new Error("Canvas 2D context not available")

    // Fill background with header color if the PNG is transparent
    // to avoid black boxes after JPEG conversion
    ctx.fillStyle = "#3c007e" // Your header purple color
    ctx.fillRect(0, 0, targetWidth, targetHeight)

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

    // Convert to compressed JPEG (Quality 0.75)
    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75)
    // --- END IMAGE OPTIMIZATION ---

    const logoHeight = 22
    const logoWidth = (img.width / img.height) * logoHeight

    // Use 'FAST' compression alias
    doc.addImage(compressedDataUrl, "JPEG", headerPadding, 5, logoWidth, logoHeight, undefined, 'FAST')

  } catch (e) {
    console.error("Failed to load logo image:", e)
  }

  // Add "AML Meter" text in bold between logo and case ID
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  // doc.setFont("times", "bold")
  doc.setFont("times", "bold")
  doc.text("AML Meter", pageWidth / 2, 18, { align: "center" })

  // Case ID on the right
  doc.setFontSize(10)
  doc.setFont("times", "normal")
  doc.text(`Case ID: AML-CASE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - headerPadding, 16, { align: "right" })

  // --- TITLE ---
  let y = 50
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(22)
  doc.setFont("times", "bold")
  doc.text("Screening Result Report", margin, y)
  y += 7
  doc.setFontSize(11)
  doc.setFont("times", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`Screening summary and supporting evidence for ${customerType}`, margin, y)
  y += 5
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageWidth - margin, y)
  y += 12

  // --- CASE SUMMARY & OUTCOME (Two Columns) ---
  const colWidth = (contentWidth - 6) / 2
  const boxHeight = 49 // Reduced height by 30%
  
  // Left Box: Case Summary
  doc.setDrawColor(200, 200, 200)
  doc.roundedRect(margin, y, colWidth, boxHeight, 3, 3)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Summary", margin + 5, y + 8)

  const hasPep = bestBySource.some(src => (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1')));
  
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  let summaryY = y + 16
  const summaryItems = [
    ["Subject Name:", searchedFor],
    ["Subject Type:", customerType == "individual" ? "Individual" : (customerType == "entity" ? "Entity" : "Vessel")],
    ["Total Search:", total_search?.toString() || "0"],
    ["Screening Type:", "Automated Name Search"],
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
  
  // Determine overall decision based on first annotation choice
  const annotations = Object.values(sourceAnnotationChoice).filter(Boolean)
  let finalDecision = "Pending Review"
  if (annotations.length > 0) {
    finalDecision = annotations[0] // Use the first annotation as final decision
  }
  
  const outcomeBoxHeight = 49 // Reduced height by 30%
  
  doc.roundedRect(margin + colWidth + 6, y, colWidth, outcomeBoxHeight, 3, 3)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Outcome", margin + colWidth + 11, y + 8)

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  let outcomeY = y + 18
  
  // Final Decision first (from first annotation)
  doc.setFont("helvetica", "bold"); doc.text("Final Decision:", margin + colWidth + 11, outcomeY)
  doc.setFont("helvetica", "normal")
  const decisionText = doc.splitTextToSize(finalDecision, colWidth - 52)
  doc.text(decisionText, margin + colWidth + 48, outcomeY)
  outcomeY += (decisionText.length * 5) + 4
  
  // Confidence Score
  doc.setFont("helvetica", "bold"); doc.text("Confidence Score:", margin + colWidth + 11, outcomeY)
  doc.setFont("helvetica", "normal"); doc.text(`${(maxConf / 100).toFixed(2)}`, margin + colWidth + 48, outcomeY)
  outcomeY += (decisionText.length * 5) + 4
  
  // Result with color
  doc.setFont("helvetica", "bold"); doc.text("Result:", margin + colWidth + 11, outcomeY)
  doc.setTextColor(...risk.color)
  doc.setFont("helvetica", "bold"); doc.text(risk.label, margin + colWidth + 48, outcomeY)
  doc.setTextColor(0, 0, 0)


  y += outcomeBoxHeight + 10

  // --- AUDIT TRAIL ---
  // Check if there's enough space for audit trail (estimated ~35mm needed)
  if (y > 235) {
    doc.addPage()
    y = 30
  }

  doc.setFontSize(13)
  doc.setFont("times", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text("Audit Trail", margin, y)
  y += 5

  const auditHeader = [["Particular", "Description"]];

  const auditBody = [
    ["Total Searches Performed", total_search?.toString() || "0"],
    ["Total Results Found", bestBySource.reduce((sum, src) => sum + (src.data || []).filter(Boolean).length, 0).toString()],
    ["Search Timestamp", new Date().toLocaleString()],
    ["User Details", user_id || "N/A"]
  ];

  autoTable(doc, {
    startY: y,
    head: auditHeader, 
    body: auditBody,
    theme: "striped", 
    headStyles: { 
      fillColor: [93, 50, 145], 
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold' 
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: margin, right: margin },
    styles: { 
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    }
  });

  y = (doc as any).lastAutoTable.finalY + 10

  // --- MATCH SUMMARY TABLE ---
  // Estimate space needed for match summary table (header + rows + spacing)
  const estimatedMatchSummaryHeight = 15 + (bestBySource.length * 8)
  
  // Check if there's enough space for Match Summary table header + at least 3 rows
  if (y + Math.min(estimatedMatchSummaryHeight, 40) > 270) {
    doc.addPage()
    y = 30
  }

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("Match Summary", margin, y)
  y += 5

  const tableData = bestBySource.map(src => {
    const hits = (src.data || []).filter(Boolean).length
    const sourceHasPep = (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1'));
    
    let displaySource = src.source;
    if (src.source && src.source.toUpperCase().includes("UAE")) {
        displaySource = "UAE Local list";
    }
    if (src.source && src.source.toUpperCase().includes("UN")) {
        displaySource = "UNSCR";
    }
    const isWhitelisted = (src.data || []).some((c: any) => c && (c.is_whitelisted === true || c.is_whitelisted === 'true' || c.is_whitelisted === 1));
    const annotation = sourceAnnotationChoice[src.source] || "No Comment";
    
    return [
      sourceHasPep ? `${displaySource} (PEP)` : displaySource,
      hits,
      hits > 0 ? `${src.best_confidence}/100` : "-",
      hits > 0 ? (sourceDecision[src.source] || "Review") : "Clear",
      isWhitelisted ? `WL: Yes | ${annotation}` : annotation
    ]
  })

  // Append a full-width note row at the end
  tableData.push([
    "Screening conducted against global, regional, and national sanctions lists, and politically exposed person databases, using a risk-based methodology",
    "",
    "",
    "",
    "",
  ])

  autoTable(doc, {
    startY: y,
    head: [["Source List", "Matches", "Highest Match", "Status", "Notes"]],
    body: tableData,
    headStyles: { fillColor: [110, 70, 255] },
    margin: { left: margin, right: margin },
    theme: "striped",
    didParseCell: (data) => {
      // Make the last row span all columns
      const isLastRow = data.section === "body" && data.row.index === tableData.length - 1
      if (isLastRow) {
        if (data.column.index === 0) (data.cell as any).colSpan = 5
        else (data.cell as any).text = ""
        data.cell.styles.fontStyle = "italic"
        data.cell.styles.textColor = [80, 80, 80]
      }
    },
  })

  y = (doc as any).lastAutoTable.finalY + 5

  // Append methodology note
  // const methodologyNote = "Note: The match summary is based on automated name matching algorithms and confidence scoring methodology."
  // doc.setFontSize(9)
  // doc.setFont("helvetica", "italic")
  // doc.text(methodologyNote, margin, y)

  y += 10

  // --- DETAILED RESULTS ---
  // Only add new page if there's not enough space for at least one evidence box
  if (y > 240) {
    doc.addPage()
    y = 30
  }
  
  doc.setFontSize(13)
  doc.setFont("times", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text("Evidence", margin, y)
  y += 8

  bestBySource.forEach(src => {
    const candidates = (src.data || []).filter(Boolean)
    candidates.forEach((c: any) => {
      
      const riskInfo = getRiskLevel(c.confidence)
      // Updated PEP check here as well
      const isPep = c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1';

      // Calculate address lines to determine box height dynamically
      const addr = doc.splitTextToSize(c.address || "N/A", contentWidth - 45)
      const addressLines = Array.isArray(addr) ? addr.length : 1
      
      // Base height + extra space for PEP + address lines (5mm per line)
      const baseHeight = 39 // Base for name, decision, annotation labels
      const pepHeight = isPep ? 6 : 0
      const addressHeight = addressLines * 5
      const boxHeight = baseHeight + pepHeight + addressHeight
      
      // Check if box fits on current page, if not add new page
      if (y + boxHeight > 270) { doc.addPage(); y = 30 }
      
      doc.setDrawColor(200, 200, 200)
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2)
      
      doc.setFontSize(11)
      doc.setFont("times", "bold")
      doc.text(`${src.source} Result Details`, margin + 5, y + 8)
      
      // Hit Badge
      doc.setFillColor(...riskInfo.color)
      doc.roundedRect(margin + contentWidth - 35, y + 4, 30, 6, 2, 2, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.text(`${(c.confidence/100).toFixed(2)} Match`, margin + contentWidth - 20, y + 8.2, { align: "center" })

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      let detailY = y + 16
      doc.setFont("times", "bold"); doc.text("Matched Name:", margin + 5, detailY)
      doc.setFont("times", "normal"); doc.text(c.name || "-", margin + 35, detailY)
      detailY += 6

      if (isPep) {
        doc.setFont("times", "bold"); doc.text("PEP Status:", margin + 5, detailY)
        doc.setTextColor(220, 38, 38)
        doc.setFont("times", "bold"); doc.text("Politically Exposed Person", margin + 35, detailY)
        doc.setTextColor(0, 0, 0)
        detailY += 6
      }

      doc.setFont("times", "bold"); doc.text("Decision:", margin + 5, detailY)
      doc.setFont("times", "normal"); doc.text(sourceDecision[src.source] || "Not Set", margin + 35, detailY)
      detailY += 6
      doc.setFont("times", "bold"); doc.text("Annotation:", margin + 5, detailY)
      const annotationText = sourceAnnotationChoice[src.source] === 'Other' ? sourceAnnotationText[src.source] : sourceAnnotationChoice[src.source]
      doc.setFont("times", "normal"); doc.text(annotationText || "None", margin + 35, detailY)
      detailY += 6
      doc.setFont("times", "bold"); doc.text("Address:", margin + 5, detailY)
      doc.setFont("times", "normal"); doc.text(addr, margin + 35, detailY)

      y += boxHeight + 10 // Dynamic spacing based on calculated box height
    })
  })

  // --- FOOTER ---
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Confidential - AML Meter Report`, margin, 285)
    doc.text(`Generated: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`, pageWidth - margin, 285, { align: "right" })
  }

  doc.save(`${searchedFor.replace(/\s+/g, '_')}.pdf`)
}