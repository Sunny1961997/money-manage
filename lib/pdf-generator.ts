import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { registerGlobalFonts, PDF_FONT_PRIMARY, PDF_FONT_ITALIC } from "./pdf-utils"

interface CustomerData {
  id: number
  name: string
  email: string
  customer_type: "individual" | "corporate"
  status: string
  created_at: string
  risk_level: string
  country: string
  contact_office_number?: string
  contact_mobile_number?: string
  corporate_detail?: any
  individual_detail?: any
  country_operations?: any[]
  documents?: any[]
  products?: any[]
  corporate_related_persons?: any[]
  related_persons?: any[]
  screening_fuzziness?: string
}

export async function generateCustomerPDF(data: any) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    compress: true // This compresses the internal PDF stream
  })
  const isCorporate = data.customer_type === "corporate"
  const corp = data.corporate_detail
  const indiv = data.individual_detail

  registerGlobalFonts(doc)

  // Set colors - Updated to match new design
  const primaryColor: [number, number, number] = [93, 50, 145] // Purple
  const headerColor: [number, number, number] = [60, 0, 126] // Dark purple for header
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  const userCompany = data.user_company || data.user_company || "-"
  const userRole = data.user_role || data.user_role || "-"
  console.log("Data: ", data)

  // --- HEADER with Purple Background and Logo ---
  doc.setFillColor(...headerColor)
  doc.rect(0, 0, pageWidth, 35, "F") // Header bar

  const headerPadding = 15

  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    img.src = `${baseUrl}/aml_meter_transparent.png`

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    // --- START OPTIMIZATION (PRESERVE TRANSPARENCY) ---
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D context not available")

    // Downscale the image; still plenty for a 20mm logo and keeps alpha channel
    const targetWidth = 400
    const targetHeight = (img.height / img.width) * targetWidth
    canvas.width = targetWidth
    canvas.height = targetHeight

    // IMPORTANT: do NOT fill a background; keep transparency
    ctx.clearRect(0, 0, targetWidth, targetHeight)
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

    // Keep as PNG to preserve alpha (transparent background)
    const compressedDataUrl = canvas.toDataURL("image/png")

    const logoHeight = 20
    const logoWidth = (img.width / img.height) * logoHeight

    // Embed as PNG so transparency is preserved
    doc.addImage(compressedDataUrl, "PNG", headerPadding, 5, logoWidth, logoHeight, undefined, "FAST")
    // --- END OPTIMIZATION ---
  } catch (e) {
    console.error("Failed to load logo image:", e)
  }

  // Add "AML Meter" text in header
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont(PDF_FONT_PRIMARY, "bold")
  doc.text("AML Meter", pageWidth / 2, 16, { align: "center" })

  // Document type subtitle
  doc.setFontSize(9)
  doc.setFont(PDF_FONT_PRIMARY, "normal")
  doc.text("Customer Due Diligence & KYC Report", pageWidth / 2, 24, { align: "center" })

  // ----------------------------
  // KYC report layout (2 pages)
  // ----------------------------

  const toDate = (v: any) => {
    if (!v) return "-"
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString()
  }

  const toValue = (v: any) => {
    if (v === null || v === undefined || v === "") return "-"
    return String(v)
  }

  const customerName = isCorporate
    ? corp?.company_name || data.name || "-"
    : indiv
      ? `${indiv.first_name || ""} ${indiv.last_name || ""}`.trim() || data.name || "-"
      : data.name || "-"

  const customerEmail = isCorporate ? corp?.email || data.email || "-" : indiv?.email || data.email || "-"

  const riskScore = Number(data.risk_level)
  const riskClass = (s: number) => {
    if (!Number.isFinite(s)) return "-"
    if (s >= 4.0) return "High Risk"
    if (s >= 3.0) return "Medium High Risk"
    if (s >= 2.0) return "Medium Risk"
    return "Low Risk"
  }

  // Make tables more compact to reduce page count
  const gridStyles = {
    font: "helvetica",
    fontSize: 8,
    cellPadding: 1.6,
    lineColor: [210, 210, 210] as any,
    lineWidth: 0.1,
    textColor: [40, 40, 40] as any,
    overflow: "linebreak" as const,
  }

  // Add a small gap after titles to prevent title/table overlap
  // Decrease so title sits closer to the next table
  const TITLE_GAP = 2

  const sectionTitle = (title: string, y: number, minAfter = 14) => {
    // ensure room for title + at least a couple table rows
    y = ensureSpace(y, minAfter)

    doc.setFont(PDF_FONT_PRIMARY, "normal")
    doc.setFontSize(10)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(title, margin, y)
    doc.setTextColor(0, 0, 0)

    // return with extra spacing so the next table doesn't collide with the title
    return y + 3 + TITLE_GAP
  }

  const ensureSpace = (y: number, needed: number) => {
    // keep footer area
    const bottom = pageHeight - 18
    if (y + needed > bottom) {
      doc.addPage()
      // use more of the top space on pages 2+
      return 12
    }
    return y
  }

  // Increase vertical spacing between sections/tables
  const TABLE_GAP = 8

  const twoColKV = (y: number, leftPairs: Array<[string, any]>, rightPairs: Array<[string, any]>) => {
    const rows = Math.max(leftPairs.length, rightPairs.length)
    y = ensureSpace(y, 8 + rows * 4.4)

    const body = Array.from({ length: rows }).map((_, i) => {
      const l = leftPairs[i] || ["", ""]
      const r = rightPairs[i] || ["", ""]
      return [l[0], toValue(l[1]), r[0], toValue(r[1])]
    })

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: gridStyles as any,
      body,
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 58, fontStyle: "bold" },
        2: { cellWidth: 32 },
        3: { cellWidth: contentWidth - (32 + 58 + 32), fontStyle: "bold" },
      },
      margin: { left: margin, right: margin },
    })

    return (doc as any).lastAutoTable.finalY + TABLE_GAP
  }

  const oneColKV = (y: number, pairs: Array<[string, any]>) => {
    y = ensureSpace(y, 8 + pairs.length * 4.4)

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: gridStyles as any,
      body: pairs.map(([k, v]) => [k, toValue(v)]),
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: contentWidth - 70, fontStyle: "bold" },
      },
      margin: { left: margin, right: margin },
    })

    return (doc as any).lastAutoTable.finalY + TABLE_GAP
  }

  const simpleTable = (y: number, head: string[], body: any[][]) => {
    y = ensureSpace(y, 12 + body.length * 4.4)

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: gridStyles as any,
      head: [head],
      body,
      headStyles: {
        fillColor: [245, 245, 245] as any,
        textColor: [0, 0, 0] as any,
        fontStyle: "bold",
      },
      margin: { left: margin, right: margin },
    })

    return (doc as any).lastAutoTable.finalY + TABLE_GAP
  }

  // --- Corporate report (matches corporate screenshots) ---
  if (isCorporate) {
    let yPos = 45

    doc.setFontSize(8.5)
    doc.setTextColor(120, 120, 120)
    doc.setFont(PDF_FONT_PRIMARY, "normal")
    doc.text(
      `Generated Date: ${new Date().toLocaleDateString()} | Reference ID: AMLM-CDD-KYC-CORP-${String(data.id || "0000").padStart(4, "0")}`,
      pageWidth / 2,
      yPos,
      { align: "center" }
    )
    doc.setTextColor(0, 0, 0)
    yPos += 10

    // Page 1 sections
    yPos = sectionTitle("Company Identification", yPos)
    yPos = oneColKV(yPos, [
      ["Legal Entity Name", corp?.company_name || data.name || "-"],
      ["Customer Type", isCorporate ? "Corporate" : "Individual"],
      ["Legal Form", corp?.legal_form || corp?.entity_type || "-"],
      ["Country of Incorporation", corp?.country_incorporated || data.country || "-"],
      ["Registration Number", corp?.registration_number || corp?.trade_license_no || "-"],
      ["Date of Incorporation", corp?.date_of_incorporation || corp?.license_issue_date || "-"],
      ["Business Status", data.status || "-"],
    ])

    yPos = sectionTitle("Registered Address and Contact Information", yPos)
    yPos = oneColKV(yPos, [
      ["Registered Address", corp?.company_address || "-"],
      ["City", corp?.city || "-"],
      ["Country", corp?.country_incorporated || data.country || "-"],
      ["Contact Email", corp?.email || data.email || "-"],
      [
        "Contact Phone",
        corp?.mobile_no
          ? `${corp?.mobile_country_code || ""} ${corp?.mobile_no}`.trim()
          : data.contact_mobile_number || "-",
      ],
    ])

    yPos = sectionTitle("Business Information", yPos)
    yPos = oneColKV(yPos, [
      ["Nature of Business", corp?.business_activity || "-"],
      ["Purpose of Relationship", corp?.purpose_of_onboarding || "-"],
      [
        "Products or Services",
        Array.isArray((data as any).products) && (data as any).products.length
          ? (data as any).products.map((p: any) => p?.name || p?.product_name || p).join(", ")
          : "-",
      ],
      // ["Target Customers", corp?.target_customers || "-"],
      ["Delivery Channel", corp?.delivery_channel || "-"],
      ["Mode of Payment", corp?.payment_mode || "-"],
      [
        "Countries of Operation",
        Array.isArray((data as any).country_operations) && (data as any).country_operations.length
          ? (data as any).country_operations.map((c: any) => c?.country || c).join(", ")
          : (data.country || "-"),
      ],
    ])

    const partnersSources = [
      data.corporate_detail?.related_persons,
      data.corporate_related_persons,
      data.corporate_detail?.partners,
      data.related_persons,
      data.partners,
      data.corporate_detail?.ubo_partners,
    ].filter((a: any) => Array.isArray(a)) as any[]
    const ubos = partnersSources.reduce((acc: any[], a: any[]) => acc.concat(a), [] as any[])

    yPos = sectionTitle("Ownership and Control Summary", yPos, 30)
    yPos = oneColKV(yPos, [
      ["Ultimate Beneficial Owner Identified", ubos.length > 0 ? "Yes" : "No"],
      ["Number of UBOs", ubos.length.toString()],
      ["Control Structure", corp?.control_structure || "Direct Ownership"],
      ["Authorized Signatory Appointed", corp?.authorized_signatory ? "Yes" : "Yes"],
    ])

    // UBO details (dynamic list)
    if (ubos.length > 0) {
      // Ensure we have enough space for title + table header + at least 2 rows
      yPos = ensureSpace(yPos, 32)
      yPos = sectionTitle(`Ultimate Beneficial Owner Details (${ubos.length})`, yPos, 28)

      // Render as a table to support multiple UBOS
      const uboRows = ubos.map((ubo: any) => [
        ubo?.name || [ubo?.first_name, ubo?.last_name].filter(Boolean).join(" ") || "-",
        ubo?.nationality || ubo?.country || "-",
        (ubo?.ownership_percentage ?? ubo?.share_percentage ?? ubo?.ownership ?? "-").toString(),
        ubo?.control_type || ubo?.role || "-",
        ubo?.is_pep ? "Yes" : "No",
      ])

      // simpleTable does its own ensureSpace, but we also ensured above for the title
      yPos = simpleTable(yPos, ["UBO Name", "Nationality", "Ownership %", "Control Type", "PEP"], uboRows)
    }

    yPos = sectionTitle("Risk Assessment Summary", yPos)
    yPos = oneColKV(yPos, [
      ["Overall Risk Rating", riskClass(riskScore)],
      ["Final Risk Score", Number.isFinite(riskScore) ? riskScore.toFixed(2) : "-"],
      ["Due Diligence Level", "CDD"],
    ])

    yPos = ensureSpace(yPos, 40)
    yPos = sectionTitle("Risk Score Scale (Interpretation)", yPos)
    yPos = simpleTable(yPos, ["Risk Score Range", "Risk Classification"], [
      [">= 4.0", "High Risk"],
      [">= 3.0 to < 4.0", "Medium High Risk"],
      [">= 2.0 to < 3.0", "Medium Risk"],
      ["1.0 to < 2.0", "Low Risk"],
    ])

    // Page 2: only start a new page if we don't have enough room for the next section.
    // This avoids leaving a large empty block after the Risk Score Scale.
    // Estimate next section needs ~55mm (title + 5 rows table).
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = 16
    }

    yPos = sectionTitle("Entity Identity Verification", yPos)
    yPos = oneColKV(yPos, [
      ["Trade License Number", corp?.trade_license_no || "-"],
      ["Issuing Authority", corp?.trade_license_issued_by || "-"],
      ["License Issue Date", corp?.license_issue_date || "-"],
      ["License Expiry Date", corp?.license_expiry_date || "-"],
      ["Regulatory Classification", corp?.regulatory_classification || "-"],
    ])

    yPos = sectionTitle("AML Compliance Information", yPos)
    yPos = oneColKV(yPos, [
      ["AML Policy in Place", corp?.aml_policy_in_place ? "Yes" : "Yes"],
      ["MLRO Appointed", corp?.mlro_appointed ? "Yes" : "Yes"],
      ["Sanctions Screening Conducted", "Yes"],
      ["PEP Screening Conducted", "Yes"],
      ["Adverse Media Screening", "Yes"],
    ])

    yPos = sectionTitle("KYC Evidence Checklist", yPos)
    yPos = simpleTable(yPos, ["Control Item", "Status"], [
      ["Trade License Verified", "Yes"],
      ["Ownership Information Verified", "Yes"],
      ["UBO Identification Completed", ubos.length > 0 ? "Yes" : "No"],
      ["Screening Completed", "Yes"],
      ["Risk Assessment Performed", "Yes"],
    ])

    yPos = ensureSpace(yPos, 65)
    yPos = sectionTitle("Onboarding Decision", yPos, 60)
    yPos = oneColKV(yPos, [
      ["Decision", data.onboarding_decision || "Approved"],
      ["Decision Date", toDate(data.onboarding_decision_date || data.updated_at || data.created_at)],
      ["Responsible Function", data.responsible_function || "Compliance"],
      ["Jurisdiction", corp?.country_incorporated || data.country || "-"],
    ])

    yPos = sectionTitle("Audit Trail", yPos, 40)
    yPos = oneColKV(yPos, [
      ["Company Name", userCompany],
      ["Generated By (User)", userRole],
      ["Generation Timestamp", new Date().toLocaleString()],
    ])

    // Footer (reuse existing footer loop below)
  } else {
    // Page 1
    let yPos = 45

    doc.setFontSize(8.5)
    doc.setTextColor(120, 120, 120)
    doc.setFont(PDF_FONT_PRIMARY, "normal")
    doc.text(
      `Generated Date: ${new Date().toLocaleDateString()} | Reference ID: AMLM-CDD-KYC-${String(data.id || "0000").padStart(4, "0")}`,
      pageWidth / 2,
      yPos,
      { align: "center" }
    )
    doc.setTextColor(0, 0, 0)
    yPos += 10

    yPos = sectionTitle("Customer Identification", yPos)
    yPos = twoColKV(
      yPos,
      [
        ["Customer Type", isCorporate ? "Corporate" : "Individual"],
        ["Full Legal Name", customerName],
        ["Date of Birth", !isCorporate ? indiv?.dob || "-" : "-"],
        ["Residential Status", !isCorporate ? indiv?.residential_status || "-" : "-"],
      ],
      [
        ["Customer ID", data.id || "-"],
        ["Status", data.status || "Onboarded"],
        ["Nationality", !isCorporate ? indiv?.nationality || data.country || "-" : corp?.country_incorporated || data.country || "-"],
        ["Onboarding Date", toDate(data.created_at)],
      ]
    )

    yPos = sectionTitle("Contact Information", yPos)
    yPos = oneColKV(yPos, [
      [
        "Contact Number",
        !isCorporate
          ? indiv?.contact_no
            ? `${indiv?.country_code || ""} ${indiv?.contact_no}`.trim()
            : data.contact_mobile_number || "-"
          : corp?.mobile_no
            ? `${corp?.mobile_country_code || ""} ${corp?.mobile_no}`.trim()
            : data.contact_mobile_number || "-",
      ],
      ["Email Address", customerEmail],
      ["City", !isCorporate ? indiv?.city || "-" : corp?.city || "-"],
      ["Country of Residence", !isCorporate ? indiv?.country_of_residence || indiv?.country || data.country || "-" : corp?.country_incorporated || data.country || "-"],
    ])

    yPos = sectionTitle("Business Information", yPos)
    yPos = oneColKV(
      yPos,
      isCorporate
        ? [
          ["Business Activity", corp?.business_activity || "-"],
          ["Purpose", corp?.purpose_of_onboarding || "-"],
          ["Payment Mode", corp?.payment_mode || "-"],
          ["Source of Funds", corp?.product_source || "-"],
          ["Expected No. of Transactions", corp?.expected_no_of_transactions ?? "-"],
          ["Expected Volume", corp?.expected_volume ?? "-"],
          [
            "Product Type",
            Array.isArray((data as any).products) && (data as any).products.length
              ? (data as any).products.map((p: any) => p?.name || p?.product_name || p).join(", ")
              : "-",
          ],
        ]
        : [
          ["Occupation", indiv?.occupation || "-"],
          ["Purpose", indiv?.purpose_of_onboarding || "-"],
          ["Payment Mode", indiv?.payment_mode || "-"],
          ["Source of Income", indiv?.source_of_income || "-"],
          ["Expected No. of Transactions", indiv?.expected_no_of_transactions ?? "-"],
          ["Expected Volume", indiv?.expected_volume ?? "-"],
          [
            "Product Type",
            Array.isArray((data as any).products) && (data as any).products.length
              ? (data as any).products.map((p: any) => p?.name || p?.product_name || p).join(", ")
              : "-",
          ],
        ]
    )

    yPos = sectionTitle("Risk Assessment Summary", yPos)
    yPos = oneColKV(yPos, [
      ["Overall Risk Rating", riskClass(riskScore)],
      ["Final Risk Score", Number.isFinite(riskScore) ? riskScore.toFixed(2) : "-"],
      ["Due Diligence Level", "CDD"],
    ])

    // Before Risk Score Scale, ensure it won't be split
    yPos = ensureSpace(yPos, 40)
    yPos = sectionTitle("Risk Score Scale (Interpretation)", yPos)
    yPos = simpleTable(yPos, ["Risk Score Range", "Risk Classification"], [
      [">= 4.0", "High Risk"],
      [">= 3.0 to < 4.0", "Medium High Risk"],
      [">= 2.0 to < 3.0", "Medium Risk"],
      ["1.0 to < 2.0", "Low Risk"],
    ])

    // Only add a new page for page 2 if we actually need it
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = 16
    }

    // Page 2
    yPos = sectionTitle("Identification Summary", yPos)
    yPos = oneColKV(yPos, [
      ["ID Type", !isCorporate ? indiv?.id_type || "-" : "-"],
      ["ID Number", !isCorporate ? indiv?.id_no || "-" : "-"],
      ["Issuing Authority", !isCorporate ? indiv?.issuing_authority || "-" : "-"],
      ["Issuing Country", !isCorporate ? indiv?.issuing_country || "-" : "-"],
      ["Expiry Date", !isCorporate ? indiv?.id_expiry_date || "-" : "-"],
    ])

    yPos = sectionTitle("Expected Activity Profile", yPos)
    yPos = oneColKV(yPos, [
      ["Source of Funds", isCorporate ? corp?.product_source || "-" : indiv?.source_of_income || "-"],
      ["Expected Transaction Frequency", "Low"],
      [
        "Geographic Exposure",
        Array.isArray((data as any).country_operations) && (data as any).country_operations.length
          ? (data as any).country_operations.map((c: any) => c?.country || c).join(", ")
          : data.country || "Domestic",
      ],
    ])

    yPos = sectionTitle("KYC Evidence Checklist", yPos)
    yPos = simpleTable(yPos, ["Control Item", "Status"], [
      ["Identity Document Verified", "Yes"],
      ["Address Verified", "Yes"],
      ["Screening Completed", "Yes"],
      ["Risk Assessment Performed", "Yes"],
      ["Records Retained", "Yes"],
    ])

    yPos = sectionTitle("Audit Trail", yPos, 40)
    yPos = oneColKV(yPos, [
      ["Company Name", corp?.company_name || data.company?.company_name || "-"],
      ["Generated By (User)", data.generated_by || "Compliance Analyst – AML Meter"],
      ["Generation Timestamp", new Date().toLocaleString()],
    ])
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    doc.setFont(PDF_FONT_PRIMARY, "normal")
    doc.setFontSize(7.5)

    // Line 1: note (ONLY on last page)
    if (i === totalPages) {
      doc.setTextColor(0, 0, 0)
      doc.setFont(PDF_FONT_ITALIC, "normal")
      doc.text("**System-generated report. No signature required.**", pageWidth / 2, pageHeight - 21, {
        align: "center",
      })
    }

    // Line 2: footer (ALL pages)
    doc.setTextColor(0, 0, 0)
    doc.setFont(PDF_FONT_ITALIC, "normal")
    doc.text("Confidential – For Authorized Use Only | Generated by AML Meter", pageWidth / 2, pageHeight - 10, {
      align: "center",
    })
  }

  const fileName = `Customer_KYC_${customerName}.pdf`
  doc.save(fileName.replace(/[^a-zA-Z0-9._-]/g, "_"))
}

function addSectionHeader(doc: jsPDF, title: string, yPos: number, fillColor: [number, number, number]) {
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setFillColor(...fillColor)
  doc.rect(15, yPos - 2, pageWidth - 30, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont(PDF_FONT_PRIMARY, "bold")
  doc.text(title, 17, yPos + 4)
  doc.setTextColor(0, 0, 0)
  doc.setFont(PDF_FONT_PRIMARY, "normal")
}
