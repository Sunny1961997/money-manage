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
  user_company,
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
  user_company?: string
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

  // Helper to decide if a candidate should be included in Evidence
  const decisionForSource = (source: string) => {
     // normalized lookup to be safe
     const exact = (sourceDecision as any)[source]
     if (exact) return exact
     const key = Object.keys(sourceDecision).find(k => k.toLowerCase().trim() === source.toLowerCase().trim())
     return key ? sourceDecision[key] : null
  }

  // Selected annotation is per-source
  const annChoiceForSource = (source: string) => (sourceAnnotationChoice as any)[source] ?? ""

  // Typed annotation can be per-candidate (key: `${source}:${candidateId}`) with fallback to per-source
  const annTextFor = (source: string, candidateId: number) => {
    const key = `${source}:${candidateId}`
    return (sourceAnnotationText as any)[key] ?? (sourceAnnotationText as any)[source] ?? ""
  }

  const includeInEvidence = (source: string, c: any) => {
    const conf = Number(c?.confidence) || 0
    const d = decisionForSource(source)
    return d === "relevant" || conf >= 80
  }

  // Pre-filter sources/candidates for the PDF
  const bestBySourceFiltered = (bestBySource || [])
    .map((src: any) => ({
      ...src,
      data: (src.data || []).filter((c: any) => c && includeInEvidence(src.source, c)),
    }))
    .filter((src: any) => (src.data || []).length > 0)

  // Use original list for Match Summary
  const bestBySourceForPdf = bestBySource

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
  y += 3

  // --- CASE SUMMARY & OUTCOME (Two Columns) ---
  const colWidth = (contentWidth - 6) / 2
  
  // Calculate dynamic heights for boxes to prevent overlap
  const summaryNameLines = doc.splitTextToSize(searchedFor, colWidth - 40)
  // Base 16mm + name height + (4 other items * 6mm) + 5mm padding
  const summaryHeight = 16 + (summaryNameLines.length * 5) + 24 + 5

  // Outcome prep
  const annotations = Object.values(sourceAnnotationChoice).filter(Boolean)
  let finalDecision = "Pending Review"
  if (annotations.length > 0) {
    finalDecision = annotations[0] 
  }
  const decisionText = doc.splitTextToSize(finalDecision, colWidth - 52)
  // Base 18mm + decision height + 4mm gap + conf(6) + result(6) + 5mm padding
  const outcomeHeight = 18 + (decisionText.length * 5) + 4 + 12 + 5

  const boxHeight = Math.max(49, summaryHeight, outcomeHeight)
  
  // Left Box: Case Summary
  doc.setDrawColor(200, 200, 200)
  doc.roundedRect(margin, y, colWidth, boxHeight, 3, 3)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Summary", margin + 5, y + 8)

  const hasPep = bestBySourceForPdf.some(src => (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1')));
  
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  let summaryY = y + 16
  const summaryItems = [
    ["Subject Name:", summaryNameLines], // Use split lines
    ["Subject Type:", customerType == "individual" ? "Individual" : (customerType == "entity" ? "Entity" : "Vessel")],
    ["Total Search:", total_search?.toString() || "0"],
    ["Screening Type:", "Automated Name Search"],
    ["PEP Identified:", hasPep ? "YES" : "No"]
  ]
  summaryItems.forEach(([label, val]) => {
    doc.setFont("helvetica", "bold"); doc.text(label as string, margin + 5, summaryY)
    
    // Highlight PEP YES in red if found
    if (label === "PEP Identified:" && val === "YES") {
        doc.setTextColor(220, 38, 38); // Red
        doc.setFont("helvetica", "bold"); doc.text(val as string, margin + 35, summaryY)
        doc.setTextColor(0, 0, 0); // Reset
    } else {
        doc.setFont("helvetica", "normal"); doc.text(val as string | string[], margin + 35, summaryY)
    }

    if (Array.isArray(val)) {
        summaryY += (val.length * 5) + 1
    } else {
        summaryY += 6
    }
  })

  // Right Box: Outcome
  const maxConf = Math.max(...bestBySourceForPdf.map(s => s.best_confidence || 0))
  const risk = getRiskLevel(maxConf)
  
  // Use calculated boxHeight for matching height
  doc.roundedRect(margin + colWidth + 6, y, colWidth, boxHeight, 3, 3)
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
  doc.text(decisionText, margin + colWidth + 48, outcomeY)
  outcomeY += (decisionText.length * 5) + 4
  
  // Confidence Score
  doc.setFont("helvetica", "bold"); doc.text("Confidence Score:", margin + colWidth + 11, outcomeY)
  doc.setFont("helvetica", "normal"); doc.text(`${(maxConf / 100).toFixed(2)}`, margin + colWidth + 48, outcomeY)
  outcomeY += 6
  
  // Result with color
  doc.setFont("helvetica", "bold"); doc.text("Result:", margin + colWidth + 11, outcomeY)
  doc.setTextColor(...risk.color)
  doc.setFont("helvetica", "bold"); doc.text(risk.label, margin + colWidth + 48, outcomeY)
  doc.setTextColor(0, 0, 0)


  y += boxHeight + 10

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
    ["Total Results Found", bestBySourceForPdf.reduce((sum, src) => sum + (src.data || []).filter(Boolean).length, 0).toString()],
    ["Search Timestamp", new Date().toLocaleString()],
    ["User Details", user_id || "N/A"],
    ["Company Name", user_company || "N/A"],
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
  doc.setFontSize(13)
  doc.setFont("times", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text("Match Summary", margin, y)
  y += 5

  const normalizeSource = (s: string) => (s || "").toLowerCase()

  const belongsTo = {
    global: (s: string) => {
      const n = normalizeSource(s)
      return n.includes("un") || n.includes("unsc") || n.includes("unscr") || n.includes("ofac") || n.includes("sdn") || n.includes("eu") || n.includes("europe") || n.includes("uk") || n.includes("united kingdom")
    },
    regional: (s: string) => {
      const n = normalizeSource(s)
      return n.includes("canada") || n.includes("uae") || n.includes("united arab emirates")
    },
    pep: (s: string) => {
      const n = normalizeSource(s)
      return n.includes("pep") || n.includes("opensanctions")
    },
  }

  const labelSource = (src: any) => {
    const raw = src?.source || ""
    const n = normalizeSource(raw)

    if ((n.includes("un"))) {
      return "United Nations Security Council Consolidated Sanctions List (UNSCR)"
    }
    if (n.includes("ofac")) {
      return "United States OFAC – Specially Designated Nationals and Blocked Persons List (SDN)"
    }
    if (n.includes("eu") || n.includes("european union")) {
      return "European Union Consolidated Sanctions List"
    }
    if (n.includes("uk") || n.includes("united kingdom")) {
      return "United Kingdom Consolidated Sanctions List"
    }
    if (n.includes("canada")) {
      return "Government of Canada Consolidated Sanctions List"
    }
    if (n.includes("uae") || n.includes("united arab emirates")) {
      return "United Arab Emirates Local Terrorist and Sanctions List"
    }
    if (n.includes("opensanctions-regulatory") || n.includes("opensanctions_regulatory")) {
      return "OpenSanctions - Regulatory"
    }

    if (n.includes("opensanctions") || n.includes("pep")) {
      return "OpenSanctions – Politically Exposed Persons (PEP)"
    }

    // fallback
    return raw
  }

  const buildRow = (src: any) => {
    const hits = (src.data || []).filter(Boolean).length
    const sourceHasPep = (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1'))

    const displaySource = labelSource(src)

    const first = (src.data || []).filter(Boolean)[0] as any
    const cid = Number(first?.id) || 0
    const chosen = annChoiceForSource(src.source)
    const typed = annTextFor(src.source, cid)
    const notes = [chosen, typed].filter(Boolean).join(" - ") || "No Comment"

    const status = hits > 0 ? (decisionForSource(src.source) || "Review") : "Clear"

    const isWhitelisted = (src.data || []).some((c: any) => c && (c.is_whitelisted === true || c.is_whitelisted === 'true' || c.is_whitelisted === 1))

    return [
      sourceHasPep ? `${displaySource} (PEP)` : displaySource,
      hits,
      hits > 0 ? `${src.best_confidence}/100` : "-",
      hits > 0 ? status : "Clear",
      isWhitelisted ? `WL: Yes | ${notes}` : notes,
    ]
  }

  const globalRows = (bestBySourceForPdf || []).filter((s: any) => belongsTo.global(s.source) && !belongsTo.pep(s.source)).map(buildRow)
  const regionalRows = (bestBySourceForPdf || []).filter((s: any) => belongsTo.regional(s.source)).map(buildRow)
  const pepRows = (bestBySourceForPdf || [])
    .filter((s: any) => belongsTo.pep(s.source))
    // Keep a stable order: PEP first, Regulatory second
    .sort((a: any, b: any) => {
      const la = labelSource(a)
      const lb = labelSource(b)
      if (la === lb) return 0
      if (la === "OpenSanctions – Politically Exposed Persons (PEP)") return -1
      if (lb === "OpenSanctions – Politically Exposed Persons (PEP)") return 1
      if (la === "OpenSanctions - Regulatory") return -1
      if (lb === "OpenSanctions - Regulatory") return 1
      return la.localeCompare(lb)
    })
    .map(buildRow)

  const otherRows = (bestBySourceForPdf || [])
    .filter((s: any) => !belongsTo.global(s.source) && !belongsTo.regional(s.source) && !belongsTo.pep(s.source))
    .map(buildRow)

  const tableData: any[] = []

  // Section 1
  // tableData.push(["Global Sanctions Lists", "", "", "", ""])
  globalRows.forEach(r => tableData.push(r))

  // Section 2
  // tableData.push(["Regional and National Sanctions Lists", "", "", "", ""])
  regionalRows.forEach(r => tableData.push(r))

  // Section 3
  // tableData.push(["Politically Exposed Persons and Regulatory Intelligence", "", "", "", ""])
  pepRows.forEach(r => tableData.push(r))

  // Any remaining sources
  if (otherRows.length) {
    // tableData.push(["Other", "", "", "", ""])
    otherRows.forEach(r => tableData.push(r))
  }

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
    styles: { 
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    didParseCell: (data) => {
      // const isSectionRow = data.section === "body" && [
      //   "Global Sanctions Lists",
      //   "Regional and National Sanctions Lists",
      //   "Politically Exposed Persons and Regulatory Intelligence",
      //   "Other",
      // ].includes(String((data.row.raw as any[])?.[0] || ""))

      const isLastRow = data.section === "body" && data.row.index === tableData.length - 1

      // if (isSectionRow) {
      //   if (data.column.index === 0) (data.cell as any).colSpan = 5
      //   else (data.cell as any).text = ""
      //   data.cell.styles.fontStyle = "bold"
      //   data.cell.styles.fillColor = [245, 245, 245]
      //   data.cell.styles.textColor = [40, 40, 40]
      // }

      // Make the last row span all columns
      if (isLastRow) {
        if (data.column.index === 0) (data.cell as any).colSpan = 5
        else (data.cell as any).text = ""
        data.cell.styles.fontStyle = "italic"
        data.cell.styles.textColor = [80, 80, 80]
      }
    },
  })

  y = (doc as any).lastAutoTable.finalY + 5

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

  bestBySourceFiltered.forEach(src => {
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
      doc.setFont("times", "normal"); doc.text(decisionForSource(src.source) || "Not Set", margin + 35, detailY)
      detailY += 6

      doc.setFont("times", "bold"); doc.text("Annotation:", margin + 5, detailY)
      const chosen = annChoiceForSource(src.source)
      const typed = annTextFor(src.source, Number(c.id))
      const annotationText = [chosen, typed].filter(Boolean).join(" - ")
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