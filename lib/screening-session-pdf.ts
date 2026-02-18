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
  if (score >= 90) return { label: "True Match", color: [239, 68, 68] as [number, number, number] } // Red
  if (score >= 40) return { label: "Potential Match", color: [245, 158, 11] as [number, number, number] } // Orange
  return { label: "False Positive", color: [34, 197, 94] as [number, number, number] } // Green
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
  total_found,
  user_id,
  user_name,
  user_company,
  savedCandidateKeys,
  relevantCount,
  irrelevantCount,
  screening_log_id,
}: {
  searchedFor: string
  customerType: string
  bestBySource: any[]
  sourceDecision: Record<string, string | null>
  sourceAnnotationChoice: Record<string, string>
  sourceAnnotationText: Record<string, string>
  detailsById: Record<string, any>
  total_search?: number
  total_found?: number
  user_id?: string
  user_name?: string
  user_company?: string
  savedCandidateKeys?: string[]
  relevantCount?: number
  irrelevantCount?: number
  screening_log_id?: string
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
    // Check per-candidate key first for decision
    const candidateKey = `${source}:${c?.id}`
    
    // If savedCandidateKeys is provided, only include saved candidates
    if (savedCandidateKeys && savedCandidateKeys.length > 0) {
      if (!savedCandidateKeys.includes(candidateKey)) return false
    }

    // Check per-candidate decision first, then fall back to per-source
    const perCandidateDecision = (sourceDecision as any)[candidateKey]
    const d = perCandidateDecision || decisionForSource(source)
    const dNorm = typeof d === "string" ? d.toLowerCase().trim() : ""
    return dNorm === "relevant"
  }

  // Pre-filter sources/candidates for Evidence only
  const bestBySourceFiltered = (bestBySource || [])
    .map((src: any) => ({
      ...src,
      data: (src.data || []).filter((c: any) => c && includeInEvidence(src.source, c)),
    }))
    .filter((src: any) => (src.data || []).length > 0)

  // Use original full list for Match Summary
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
  doc.setFontSize(18)
  doc.setFont("times", "bold")
  const titleText = `Subject: `
  const titleWidth = doc.getTextWidth(titleText)
  doc.text(titleText, margin, y)
  doc.setFont("times", "normal")
  doc.setFontSize(16)
  doc.setTextColor(60, 60, 60)
  const nameLines = doc.splitTextToSize(searchedFor, contentWidth - titleWidth - 2)
  doc.text(nameLines, margin + titleWidth, y)
  y += (nameLines.length > 1 ? nameLines.length * 6 : 7)
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageWidth - margin, y)
  y += 3

  // --- CASE SUMMARY & OUTCOME (Two Tables Side by Side) ---
  const colWidth = (contentWidth - 6) / 2

  const hasPep = bestBySourceForPdf.some(src => (src.data || []).some((c: any) => c && (c.is_pep === true || c.is_pep === 'true' || c.is_pep === 1 || c.is_pep === '1')));

  const computedIrrelevant = (total_found ?? 0) - (relevantCount ?? 0)

  // Summary table (left)
  autoTable(doc, {
    startY: y,
    head: [["Summary", "Value"]],
    body: [
      ["Subject Type", customerType == "individual" ? "Individual" : (customerType == "entity" ? "Entity" : "Vessel")],
      ["Total Result", total_found?.toString() || "0"],
      ["Relevant", String(relevantCount ?? 0)],
      ["Irrelevant", String(computedIrrelevant)],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [93, 50, 145],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin + colWidth + 6 },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    didParseCell: (data) => {
      // Make header span both columns visually
      if (data.section === 'head' && data.column.index === 1) {
        data.cell.text = []
      }
    },
  })

  const summaryFinalY = (doc as any).lastAutoTable.finalY

    // Outcome prep - determine Final Decision and Result from saved candidates
  // Relevant priority: True Match > Potential Match
  // Irrelevant priority: No Match > Insufficient Data
  const relevantPriority: Record<string, number> = {
    "True Match": 0,
    "Potential Match": 1,
  }

  const irrelevantPriority: Record<string, number> = {
    "No Match": 0,
    "Insufficient Data": 1,
  }

  let finalDecision = "N/A"
  let finalResultType = ""

  // Collect all saved candidate entries that have both decision and result type
  const savedEntries: Array<{ decision: string; resultType: string }> = []

  if (savedCandidateKeys && savedCandidateKeys.length > 0) {
    for (const key of savedCandidateKeys) {
      const perCandidateDecision = (sourceDecision as any)[key]
      const perCandidateChoice = (sourceAnnotationChoice as any)[key]
      // Only use per-candidate keyed data — don't fall back to per-source
      if (perCandidateDecision && perCandidateChoice) {
        savedEntries.push({ decision: String(perCandidateDecision), resultType: String(perCandidateChoice) })
      }
    }
  }

  // Separate by decision type
  const relevantEntries = savedEntries.filter(e => e.decision.toLowerCase() === "relevant")
  const irrelevantEntries = savedEntries.filter(e => e.decision.toLowerCase() === "irrelevant")

  const pickBestRelevant = (entries: Array<{ decision: string; resultType: string }>) => {
    if (entries.length === 0) return null
    entries.sort((a, b) => {
      const pa = relevantPriority[a.resultType] ?? 99
      const pb = relevantPriority[b.resultType] ?? 99
      return pa - pb
    })
    return entries[0]
  }

  const pickBestIrrelevant = (entries: Array<{ decision: string; resultType: string }>) => {
    if (entries.length === 0) return null
    entries.sort((a, b) => {
      const pa = irrelevantPriority[a.resultType] ?? 99
      const pb = irrelevantPriority[b.resultType] ?? 99
      return pa - pb
    })
    return entries[0]
  }

  const bestRelevant = pickBestRelevant(relevantEntries)
  const bestIrrelevant = pickBestIrrelevant(irrelevantEntries)

  console.log("Best Relevant Entry:", bestRelevant)
  console.log("Best Irrelevant Entry:", bestIrrelevant)

  if (bestRelevant) {
    finalDecision = bestRelevant.resultType || "Relevant"
    finalResultType = bestRelevant.decision
  } else if (bestIrrelevant) {
    finalDecision = bestIrrelevant.resultType || "Irrelevant"
    finalResultType = bestIrrelevant.decision
  }
  else{
    finalResultType = "Irrelevant"
  }
  console.log("Determined Final Decision:", finalDecision, "with Result Type:", finalResultType)

  // Determine risk from finalDecision (result type)
  const decisionToRisk = (dec: string): { label: string; color: [number, number, number] } => {
    const d = dec.toLowerCase()
    if (d === "true match") return { label: "True Match", color: [239, 68, 68] }
    if (d === "potential match") return { label: "Potential Match", color: [245, 158, 11] }
    if (d === "no match") return { label: "No Match", color: [34, 197, 94] }
    if (d === "insufficient data") return { label: "Insufficient Data", color: [156, 163, 175] }
    // if (d === "pending review") return { label: "Pending Review", color: [156, 163, 175] }
    return { label: "No Match", color: [156, 163, 175] }
  }

  const risk = decisionToRisk(finalDecision)

  // Outcome table (right)
  autoTable(doc, {
    startY: y,
    head: [["Outcome", "Value"]],
    body: [
      ["Final Decision", finalResultType],
      ["Result", risk.label],
      ["PEP Status", hasPep ? "YES" : "No"],
      ["Screening Type", "Automated"],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [93, 50, 145],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin + colWidth + 6, right: margin },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 1) {
        data.cell.text = []
      }
      // Color the Result value
      if (data.section === 'body' && data.row.index === 1 && data.column.index === 1) {
        data.cell.styles.textColor = risk.color
        data.cell.styles.fontStyle = 'bold'
      }
      // Color PEP YES in red
      if (data.section === 'body' && data.row.index === 2 && data.column.index === 1 && hasPep) {
        data.cell.styles.textColor = [220, 38, 38]
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  const outcomeFinalY = (doc as any).lastAutoTable.finalY
  y = Math.max(summaryFinalY, outcomeFinalY) + 10



    // --- Report History ---
  // Check if there's enough space for report HIstory (estimated ~35mm needed)
  if (y > 235) {
    doc.addPage()
    y = 30
  }

  doc.setFontSize(13)
  doc.setFont("times", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text("Report History", margin, y)
  y += 5

  const reportHistoryHeader = [["User", "Action", "Date"]];

  const reportHistoryBody = [
    [user_name || "N/A", "Performed screening against relevant source lists", new Date().toLocaleString()],
  ];

  autoTable(doc, {
    startY: y,
    head: reportHistoryHeader, 
    body: reportHistoryBody,
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
  console.log("User name:", user_name)
  const auditBody = [
    ["Total Searches Performed", total_search?.toString() || "0"],
    ["Total Results Found", bestBySourceForPdf.reduce((sum, src) => sum + (src.data || []).filter(Boolean).length, 0).toString()],
    ["Search Timestamp", new Date().toLocaleString()],
    ["User Details", user_name || "N/A"],
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
      return n.includes("uae") || n.includes("united arab emirates") || n.includes("un") || n.includes("unsc") || n.includes("unscr") || n.includes("ofac") || n.includes("sdn") || n.includes("eu") || n.includes("europe") || n.includes("uk") || n.includes("united kingdom")
    },
    regional: (s: string) => {
      const n = normalizeSource(s)
      return n.includes("canada")
    },
    pep: (s: string) => {
      const n = normalizeSource(s)
      return n.includes("pep") || n.includes("opensanctions")
    },
  }

  const labelSource = (src: any) => {
    const raw = src?.source || ""
    const n = normalizeSource(raw)

    if (n.includes("uae") || n.includes("united arab emirates")) {
      return "United Arab Emirates Local Terrorist and Sanctions List"
    }
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
      hits > 0 ? `${(src.best_confidence/100).toFixed(2)}` : "-",
      hits > 0 ? status : "Clear",
      isWhitelisted ? `WL: Yes | ${notes}` : notes,
    ]
  }

  const globalRows = (bestBySourceForPdf || [])
    .filter((s: any) => belongsTo.global(s.source) && !belongsTo.pep(s.source))
    .sort((a: any, b: any) => {
      const na = normalizeSource(a.source)
      const nb = normalizeSource(b.source)
      const order = (n: string) => {
        if (n.includes("uae") || n.includes("united arab emirates")) return 0
        if (n.includes("un") && !n.includes("united kingdom")) return 1
        if (n.includes("ofac") || n.includes("sdn")) return 2
        if (n.includes("eu") || n.includes("europe")) return 3
        if (n.includes("uk") || n.includes("united kingdom")) return 4
        return 5
      }
      return order(na) - order(nb)
    })
    .map(buildRow)
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
    headStyles: { fillColor: [93, 50, 145] },
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

  y = (doc as any).lastAutoTable.finalY + 8

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

  // if (bestBySourceFiltered.length === 0) {
  //   doc.setFontSize(10)
  //   doc.setFont("times", "italic")
  //   doc.setTextColor(120, 120, 120)
  //   doc.text("No results have been selected. Please save at least one result to include evidence in this report.", margin, y)
  //   y += 10
  // }
  if (bestBySourceFiltered.length === 0) {
    autoTable(doc, {
      startY: y,
      // head: [['Evidence Results']],
      body: [[
        'No results have been selected.'
      ]],
      styles: {
        font: 'times',
        fontStyle: 'italic',
        fontSize: 10,
        textColor: [120, 120, 120],
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fontStyle: 'bold',
        halign: 'center',
      },
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
    })

    y = (doc as any).lastAutoTable.finalY + 10
  }

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

  // --- FOOTER + DISCLAIMER ---
  const pageCount = doc.getNumberOfPages()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Add disclaimer on the last page, ensuring it doesn't overlap content
  doc.setPage(pageCount)

  // If current content is too close to the bottom, add a new page for the disclaimer
  const lastContentY = y
  const disclaimerNeededY = pageHeight - 30
  if (lastContentY > disclaimerNeededY) {
    doc.addPage()
  }

  const totalPages = doc.getNumberOfPages()

  // Draw disclaimer on last page
  doc.setPage(totalPages)
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, pageHeight - 22, pageWidth - margin, pageHeight - 22)
  doc.setFontSize(8)
  doc.setFont("times", "italic")
  doc.setTextColor(120, 120, 120)
  doc.text(
    "Disclaimer: This is an automatically generated report. No signature is required. The information contained herein is based on automated screening results and should be reviewed in accordance with applicable compliance policies.",
    margin,
    pageHeight - 18,
    { maxWidth: contentWidth }
  )

  // Add page numbers on all pages
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Confidential - AML Meter Report`, margin, pageHeight - 5)
    doc.text(`Generated: ${new Date().toLocaleString()} | Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: "right" })
  }

  const fileName = `${searchedFor.replace(/\s+/g, '_')}_AML_METER.pdf`

  // Get PDF as blob for uploading
  const pdfBlob = doc.output('blob')

  // Upload to backend via proxy API
  try {
    const formData = new FormData()
    formData.append('file', new File([pdfBlob], fileName, { type: 'application/pdf' }))
    if (screening_log_id && screening_log_id !== 'N/A') {
      formData.append('screening_log_id', screening_log_id)
    }

    const res = await fetch('/api/screening-reports', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Failed to upload screening report:', data)
    } else {
      console.log('Screening report uploaded successfully:', data)
    }
  } catch (err) {
    console.error('Error uploading screening report:', err)
  }

  // Also download locally
  doc.save(fileName)
}