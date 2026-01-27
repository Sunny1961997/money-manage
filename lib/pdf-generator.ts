import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

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

export function generateCustomerPDF(data: any) {
  const doc = new jsPDF()
  const isCorporate = data.customer_type === "corporate"
  const corp = data.corporate_detail
  const indiv = data.individual_detail

  // Set colors
  const primaryColor: [number, number, number] = [41, 128, 185]
  const secondaryColor: [number, number, number] = [52, 73, 94]
  const lightGray: [number, number, number] = [236, 240, 241]

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Customer Details Report", 105, 20, { align: "center" })
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" })

  let yPos = 50

  // Customer Type Badge
  doc.setFillColor(...lightGray)
  doc.roundedRect(10, yPos, 60, 8, 2, 2, "F")
  doc.setTextColor(...secondaryColor)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text(isCorporate ? "CORPORATE CUSTOMER" : "INDIVIDUAL CUSTOMER", 40, yPos + 5.5, { align: "center" })
  yPos += 15

  // Basic Information Section
  addSectionHeader(doc, "Basic Information", yPos)
  yPos += 10
  const basicInfo = [
    ["Customer ID", data.id?.toString() || "-"],
    ["Name", isCorporate ? (corp?.company_name || data.name || "-") : (indiv ? `${indiv.first_name} ${indiv.last_name}` : data.name || "-")],
    ["Email", isCorporate ? (corp?.email || data.email || "-") : (indiv?.email || data.email || "-")],
    ["Customer Type", isCorporate ? "Corporate" : "Individual"],
    ["Status", data.status || "Onboarded"],
    [
      "Risk Level",
      data.risk_level
        ? `${Number(data.risk_level).toFixed(2)} - ${Number(data.risk_level) <= 2.0 ? "Low" : Number(data.risk_level) <= 3.5 ? "Medium" : "High"} Risk`
        : "-",
    ],
    ["Created Date", data.created_at ? new Date(data.created_at).toLocaleDateString() : "-"],
  ]
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: basicInfo,
    theme: "grid",
    headStyles: { fillColor: primaryColor },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
      1: { cellWidth: 130 },
    },
    margin: { left: 10, right: 10 },
  })
  yPos = (doc as any).lastAutoTable.finalY + 10

  if (isCorporate) {
    // Company Information
    addSectionHeader(doc, "Company Information", yPos)
    yPos += 10
    const companyInfo = [
      ["Company Name", corp?.company_name || "-"],
      ["Company Address", corp?.company_address || "-"],
      ["City", corp?.city || "-"],
      ["Country of Incorporation", corp?.country_incorporated || "-"],
      ["P.O. Box", corp?.po_box || "-"],
      ["Office Contact", corp?.office_no ? `${corp.office_country_code || ""} ${corp.office_no}` : "-"],
      ["Mobile Contact", corp?.mobile_no ? `${corp.mobile_country_code || ""} ${corp.mobile_no}` : "-"],
      ["Email", corp?.email || data.email || "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: companyInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10

    // License Information
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    addSectionHeader(doc, "License Information", yPos)
    yPos += 10
    const licenseInfo = [
      ["Trade License No", corp?.trade_license_no || "-"],
      ["Issued At", corp?.trade_license_issued_at || "-"],
      ["Issued By", corp?.trade_license_issued_by || "-"],
      ["Issue Date", corp?.license_issue_date || "-"],
      ["Expiry Date", corp?.license_expiry_date || "-"],
      ["VAT Registration No", corp?.vat_registration_no || "-"],
      ["Tenancy Contract Expiry", corp?.tenancy_contract_expiry_date || "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: licenseInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10

    // Business Details
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    addSectionHeader(doc, "Business Details", yPos)
    yPos += 10
    const businessInfo = [
      ["Entity Type", corp?.entity_type || "-"],
      ["Business Activity", corp?.business_activity || "-"],
      ["Import/Export", corp?.is_entity_dealting_with_import_export ? "Yes" : "No"],
      ["Sister Concern", corp?.has_sister_concern ? "Yes" : "No"],
      ["Account Holding Bank", corp?.account_holding_bank_name || "-"],
      ["Product Source", corp?.product_source || "-"],
      ["Payment Mode", corp?.payment_mode || "-"],
      ["Delivery Channel", corp?.delivery_channel || "-"],
      ["Expected Transactions", corp?.expected_no_of_transactions?.toString() || "-"],
      ["Expected Volume", corp?.expected_volume?.toString() || "-"],
      ["Dual Use Goods", corp?.dual_use_goods ? "Yes" : "No"],
      ["Countries of Operation", Array.isArray(data.country_operations) && data.country_operations.length > 0 ? data.country_operations.map((c: any) => c.country || c).join(", ") : "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: businessInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10

    // Partners/UBOs
    const partners = Array.isArray(corp?.related_persons) ? corp.related_persons : []
    if (partners.length > 0) {
      if (yPos > 250) { doc.addPage(); yPos = 20 }
      addSectionHeader(doc, `Partners / UBOs (${partners.length})`, yPos)
      yPos += 10
      const partnerData = partners.map((p: any) => [
        p.name || "-",
        p.role || "-",
        p.nationality || "-",
        p.ownership_percentage?.toString() || "-",
        p.is_pep ? "Yes" : "No",
      ])
      autoTable(doc, {
        startY: yPos,
        head: [["Name", "Role", "Nationality", "Ownership %", "PEP"]],
        body: partnerData,
        theme: "striped",
        headStyles: { fillColor: primaryColor },
        margin: { left: 10, right: 10 },
      })
      yPos = (doc as any).lastAutoTable.finalY + 10
    }
  } else {
    // Individual customer information
    addSectionHeader(doc, "Personal Information", yPos)
    yPos += 10
    const personalInfo = [
      ["First Name", indiv?.first_name || "-"],
      ["Last Name", indiv?.last_name || "-"],
      ["Date of Birth", indiv?.dob || "-"],
      ["Gender", indiv?.gender || "-"],
      ["Nationality", indiv?.nationality || "-"],
      ["Place of Birth", indiv?.place_of_birth || "-"],
      ["Residential Status", indiv?.residential_status || "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: personalInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
    // Contact & Address
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    addSectionHeader(doc, "Contact & Address Information", yPos)
    yPos += 10
    const contactInfo = [
      ["Address", indiv?.address || "-"],
      ["City", indiv?.city || "-"],
      ["Country", indiv?.country || "-"],
      ["Country of Residence", indiv?.country_of_residence || "-"],
      ["Contact Number", indiv?.contact_no ? `${indiv.country_code || ""} ${indiv.contact_no}` : "-"],
      ["Email", indiv?.email || data.email || "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: contactInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
    // Occupation & Financial
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    addSectionHeader(doc, "Occupation & Financial Details", yPos)
    yPos += 10
    const occupationInfo = [
      ["Occupation", indiv?.occupation || "-"],
      ["Source of Income", indiv?.source_of_income || "-"],
      ["Purpose of Onboarding", indiv?.purpose_of_onboarding || "-"],
      ["Payment Mode", indiv?.payment_mode || "-"],
      ["Mode of Approach", indiv?.mode_of_approach || "-"],
      ["Expected Transactions", indiv?.expected_no_of_transactions?.toString() || "-"],
      ["Expected Volume", indiv?.expected_volume?.toString() || "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: occupationInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
    // ID Information
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    addSectionHeader(doc, "Identification Details", yPos)
    yPos += 10
    const idInfo = [
      ["ID Type", indiv?.id_type || "-"],
      ["ID Number", indiv?.id_no || "-"],
      ["Issuing Authority", indiv?.issuing_authority || "-"],
      ["Issuing Country", indiv?.issuing_country || "-"],
      ["Issue Date", indiv?.id_issue_date || "-"],
      ["Expiry Date", indiv?.id_expiry_date || "-"],
    ]
    autoTable(doc, {
      startY: yPos,
      body: idInfo,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
        1: { cellWidth: 130 },
      },
      margin: { left: 10, right: 10 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
  }

  // Risk & Compliance (common for both)
  if (yPos > 250) { doc.addPage(); yPos = 20 }
  addSectionHeader(doc, "Risk & Compliance", yPos)
  yPos += 10
  const riskInfo = [
    ["PEP Status", isCorporate ? "-" : (indiv?.is_pep ? "Yes" : "No")],
    ["Dual Nationality", isCorporate ? "-" : (indiv?.dual_nationality ? "Yes" : "No")],
    ["Adverse News", isCorporate ? (corp?.is_entity_having_adverse_news ? "Yes" : "No") : (indiv?.adverse_news ? "Yes" : "No")],
    // ["Screening Fuzziness", data.screening_fuzziness || "-"],
    ["KYC Documents Collected", isCorporate ? (corp?.kyc_documents_collected_with_form ? "Yes" : "No") : "-"],
    ["Registered in GOAML", isCorporate ? (corp?.is_entity_registered_in_GOAML ? "Yes" : "No") : "-"],
  ]
  autoTable(doc, {
    startY: yPos,
    body: riskInfo,
    theme: "grid",
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "bold", fillColor: lightGray },
      1: { cellWidth: 130 },
    },
    margin: { left: 10, right: 10 },
  })
  yPos = (doc as any).lastAutoTable.finalY + 10

  // Risk Assessment Details Table
  if (yPos > 250) { doc.addPage(); yPos = 20 }
  addSectionHeader(doc, "Risk Assessment Details", yPos)
  yPos += 10
  const riskBreakdown = data.riskBreakdown || {}
  let riskRows: any[] = []
  function fmt(val: any) {
    if (typeof val === 'number') return val.toFixed(2)
    if (typeof val === 'string' && !isNaN(Number(val))) return Number(val).toFixed(2)
    return val ?? "-"
  }
  if (isCorporate) {
    riskRows = [
      // ["Ownership Score", fmt(riskBreakdown.ownership_score)],
      ["Ownership Weighted", fmt(riskBreakdown.ownership_weighted)],
      // ["Business Activity Score", fmt(riskBreakdown.business_activity_score)],
      ["Business Activity Weighted", fmt(riskBreakdown.business_activity_weighted)],
      // ["Country Incorporate Score", fmt(riskBreakdown.country_incorporate_score)],
      ["Country Incorporate Weighted", fmt(riskBreakdown.country_incorporate_weighted)],
      // ["Product Score", fmt(riskBreakdown.product_score)],
      ["Product Weighted", fmt(riskBreakdown.product_weighted)],
      // ["Channel Score", fmt(riskBreakdown.channel_score)],
      ["Channel Weighted", fmt(riskBreakdown.channel_weighted)],
      ["Final Risk Level", fmt(riskBreakdown.final_risk_level)],
    ]
  } else {
    riskRows = [
      // ["Customer Average", fmt(riskBreakdown.customer_avg)],
      ["Customer Weighted", fmt(riskBreakdown.customer_weighted)],
      // ["Geo Score", fmt(riskBreakdown.geo_score)],
      ["Geo Weighted", fmt(riskBreakdown.geo_weighted)],
      // ["Product Score", fmt(riskBreakdown.product_score)],
      ["Product Weighted", fmt(riskBreakdown.product_weighted)],
      // ["Channel Score", fmt(riskBreakdown.channel_score)],
      ["Channel Weighted", fmt(riskBreakdown.channel_weighted)],
      ["Final Risk Level", fmt(riskBreakdown.final_risk_level)],
    ]
  }
  autoTable(doc, {
    startY: yPos,
    head: [["Category", "Value"]],
    body: riskRows,
    theme: "grid",
    headStyles: { fillColor: primaryColor, textColor: 255 },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: "bold", fillColor: lightGray },
      1: { cellWidth: 60 },
    },
    margin: { left: 40, right: 40 },
  })
  yPos = (doc as any).lastAutoTable.finalY + 10

  // Documents
  if (Array.isArray(data.documents) && data.documents.length > 0) {
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    addSectionHeader(doc, `Uploaded Documents (${data.documents.length})`, yPos)
    yPos += 10
    const docData = data.documents.map((document: any) => [
      document.file_name || "-",
      document.document_type || "-",
      document.created_at ? new Date(document.created_at).toLocaleDateString() : "-",
    ])
    autoTable(doc, {
      startY: yPos,
      head: [["File Name", "Type", "Upload Date"]],
      body: docData,
      theme: "striped",
      headStyles: { fillColor: primaryColor },
      margin: { left: 10, right: 10 },
    })
  }

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
    doc.text("Confidential - For Internal Use Only", 105, 285, { align: "center" })
  }

  // Save the PDF
  const fileName = `Customer_${data.id}_${isCorporate ? (corp?.company_name || data.name) : (indiv ? `${indiv.first_name}_${indiv.last_name}` : data.name)}_${new Date().getTime()}.pdf`
  doc.save(fileName.replace(/[^a-zA-Z0-9._-]/g, "_"))
}

function addSectionHeader(doc: jsPDF, title: string, yPos: number) {
  doc.setFillColor(41, 128, 185)
  doc.rect(10, yPos - 2, 190, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(title, 12, yPos + 3.5)
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "normal")
}
