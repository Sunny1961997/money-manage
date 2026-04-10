export function escapeXml(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v)
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function xmlTag(tag: string, value: unknown, indent = "  ") {
  return `${indent}<${tag}>${escapeXml(value)}</${tag}>`
}

function sanitizeFilenamePart(v: any) {
  const s = (v ?? "").toString().trim() || "UNKNOWN"
  return s
    .replace(/\s+/g, " ")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\.+$/g, "")
    .slice(0, 80)
}

export function buildGoamlXmlFilename(report: any, fallbackId?: string) {
  const customer = report?.customer || {}
  const type = customer?.customer_type
  const ind = customer?.individual_detail || {}
  const corp = customer?.corporate_detail || {}

  const subject =
    type === "corporate"
      ? sanitizeFilenamePart(corp?.company_name || customer?.name)
      : sanitizeFilenamePart([ind?.first_name, ind?.last_name].filter(Boolean).join(" ") || customer?.name)

  const date = (() => {
    const d = report?.created_at ? new Date(report.created_at) : null
    if (!d || Number.isNaN(d.getTime())) return ""
    return d.toISOString().slice(0, 10)
  })()

  const prefix = type === "corporate" ? "DPMS_COR" : "DPMS_INV"
  const rentity_id = report?.company_information_id ?? report?.entity_reference ?? report?.id ?? fallbackId ?? "UNKNOWN"

  const base = [prefix, rentity_id, subject, date]
    .filter(Boolean)
    .join("_")

  return `${base}.xml`
}

export function buildGoamlXml(
  report: any,
  options?: {
    countryCodeByName?: Record<string, string>
  }
) {
  // Normalize input: caller may pass { report: {...} } or the report itself
  const r = report?.report ? report.report : report

  const countryCodeByName = options?.countryCodeByName || {}

  const countryVal = (v: any) => {
    if (v === null || v === undefined) return ""
    const raw = String(v).trim()
    if (!raw) return ""
    if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase()

    const key = raw
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.,]/g, "")
      .trim()

    return countryCodeByName[key] || countryCodeByName[raw.toLowerCase()] || raw
  }

  const customer = r?.customer || {}
  const ind = customer?.individual_detail || {}
  const corp = customer?.corporate_detail || {}

  const reporterUser = r?.user || {}
  const reporterInfo = reporterUser?.user_info || {}
  const companyInfo = r?.company_information || {}

  const products = Array.isArray(customer?.products) ? customer.products : []

  const toNum = (v: any) => {
    const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN
    return Number.isFinite(n) ? n : 0
  }

  const splitName = (full: any) => {
    const s = String(full || "").trim().replace(/\s+/g, " ")
    if (!s) return { first: "", last: "" }
    const parts = s.split(" ")
    return { first: parts[0] || "", last: parts.slice(1).join(" ") || "" }
  }

  const goamlIdType = (idType: any) => {
    const t = String(idType || "").toLowerCase().trim()
    if (t.includes("passport")) return "PASSP"
    if (t === "eid" || t.includes("emirates")) return "EID"
    if (t.includes("gcc")) return "GCCID"
    if (t.includes("commercial") || t.includes("license")) return "COMML"
    if (t.includes("gov")) return "GOVID"
    return "OTHR"
  }

  const normalizeCommType = (v: any) => {
    const t = String(v || "").toUpperCase()
    if (t.startsWith("M")) return "M"
    if (t.startsWith("L")) return "L"
    return "M"
  }

  const normalizeContactType = (v: any) => {
    const t = String(v || "").toUpperCase()
    if (t.includes("OFF")) return "OFFIC"
    if (t.includes("HOME")) return "HOME"
    if (t.includes("MOB")) return "MOBIL"
    return "OFFIC"
  }

  const dateOnly = (v: any) => {
    if (!v) return ""
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10)
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
  }

  const dateTimeTo4am = (v: any) => {
    if (!v) return ""
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return `${v.slice(0, 10)}T04:00:00`
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? "" : `${d.toISOString().slice(0, 10)}T04:00:00`
  }

  const upper = (v: any) => String(v ?? "").toUpperCase()

  const sqlDateTime = (v: any) => {
    const d = dateOnly(v)
    return d ? `${d}T00:00:00` : ""
  }

  const isCorporate = customer?.customer_type === "corporate"

  const normalizePhone = (v: any) => {
    const s0 = (v ?? "").toString().trim()
    if (!s0) return ""
    // remove spaces and separators
    let s = s0.replace(/\s+/g, "").replace(/[-()]/g, "")
    // collapse duplicated country code patterns like +971+971xxxx
    const m = s.match(/^(\+\d{1,4})\1(.+)$/)
    if (m) s = `${m[1]}${m[2]}`
    // also handle +97100971 style (rare)
    const m2 = s.match(/^(\+\d{1,4})0+\1(.+)$/)
    if (m2) s = `${m2[1]}${m2[2]}`
    return s
  }

  const buildPhoneBlock = (phoneNumber: string, contactType: string, commType: string, indent: string) => {
    const phone = normalizePhone(phoneNumber)
    if (!phone) return [] as string[]
    return [
      `${indent}<phone>`,
      xmlTag("tph_contact_type", contactType, indent + "  "),
      xmlTag("tph_communication_type", commType, indent + "  "),
      xmlTag("tph_number", phone, indent + "  "),
      `${indent}</phone>`,
    ]
  }

  const relatedPeople: any[] = Array.isArray(corp?.related_persons) ? corp.related_persons : []
  const directorPicked = relatedPeople.reduce((best: any, cur: any) => {
    const bestPct = toNum(best?.ownership_percentage)
    const curPct = toNum(cur?.ownership_percentage)
    return curPct > bestPct ? cur : best
  }, relatedPeople[0] || {})

  const directorName = splitName(directorPicked?.name)

  // reporting_person should come from user + user_info (not director)
  const reportingPersonIdentity = {
    first_name: reporterUser?.name ? String(reporterUser.name).split(" ")[0] : "",
    last_name: reporterUser?.name ? String(reporterUser.name).split(" ").slice(1).join(" ") : "",
    birthdate: sqlDateTime(reporterInfo?.dob),
    ssn: reporterInfo?.ssn || reporterUser?.ssn || "",
    passport_number: reporterInfo?.passport_number || "",
    passport_country: countryVal(reporterInfo?.passport_country || ""),
    nationality1: countryVal(reporterInfo?.nationality || ""),
  }

  const reporting = {
    ...reportingPersonIdentity,
    phone:
      normalizePhone(companyInfo?.phone_number || reporterUser?.phone || "") ||
      (!isCorporate && ind?.contact_no
        ? normalizePhone(`${ind?.country_code || ""}${ind?.contact_no}`)
        : isCorporate && corp?.office_no
          ? normalizePhone(`${corp?.office_country_code || ""}${corp?.office_no}`)
          : ""),
    address: companyInfo?.address || (isCorporate ? corp?.company_address || "" : ind?.address || ""),
    city: companyInfo?.city || (isCorporate ? corp?.city || "" : ind?.city || ""),
    state: companyInfo?.state || (isCorporate ? upper(corp?.state) : upper(ind?.state)),
    country_code: countryVal(
      companyInfo?.country ||
        (isCorporate ? corp?.country_incorporated || "" : ind?.country_of_residence || ind?.country || "")
    ),
  }

  const reportingAddress = {
    address_type: normalizeContactType(companyInfo?.contact_type) || "OFFIC",
    address: companyInfo?.address || "",
    city: companyInfo?.city || "",
    state: upper(companyInfo?.state),
    country_code: countryVal(companyInfo?.country || ""),
  }

  const lines: string[] = []
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  lines.push(`<report>`)

  // Use normalized r everywhere below (instead of report)
  lines.push(xmlTag("rentity_id", r?.entity_reference ?? r?.id ?? "", "  "))
  lines.push(xmlTag("rentity_branch", "", "  "))
  lines.push(xmlTag("submission_code", "E", "  "))
  lines.push(xmlTag("report_code", "DPMSR", "  "))
  lines.push(xmlTag("entity_reference", r?.entity_reference ?? r?.id ?? "", "  "))
  lines.push(xmlTag("submission_date", r?.created_at ? dateTimeTo4am(r.created_at) : "", "  "))
  lines.push(xmlTag("currency_code_local", r?.currency_code ?? "", "  "))

  lines.push(`  <reporting_person>`)
  lines.push(xmlTag("first_name", reporting.first_name, "    "))
  lines.push(xmlTag("last_name", reporting.last_name, "    "))
  lines.push(xmlTag("birthdate", reporting.birthdate, "    "))
  lines.push(xmlTag("ssn", reporting.ssn, "    "))
  lines.push(xmlTag("passport_number", reporting.passport_number, "    "))
  lines.push(xmlTag("passport_country", reporting.passport_country, "    "))
  lines.push(xmlTag("nationality1", reporting.nationality1, "    "))

  lines.push(`    <phones>`)
  if (reporting.phone) {
    lines.push(`      <phone>`)
    lines.push(xmlTag("tph_contact_type", normalizeContactType(companyInfo?.contact_type), "        "))
    lines.push(xmlTag("tph_communication_type", normalizeCommType(companyInfo?.communication_type), "        "))
    lines.push(xmlTag("tph_number", reporting.phone, "        "))
    lines.push(`      </phone>`)
  }
  lines.push(`    </phones>`)

  lines.push(`    <addresses>`)
  if (
    reportingAddress.address ||
    reportingAddress.city ||
    reportingAddress.country_code ||
    reportingAddress.state
  ) {
    lines.push(`      <address>`)
    lines.push(xmlTag("address_type", reportingAddress.address_type, "        "))
    lines.push(xmlTag("address", reportingAddress.address, "        "))
    lines.push(xmlTag("city", upper(reportingAddress.city), "        "))
    lines.push(xmlTag("country_code", reportingAddress.country_code, "        "))
    lines.push(xmlTag("state", upper(reportingAddress.state), "        "))
    lines.push(`      </address>`)
  }
  lines.push(`    </addresses>`)
  lines.push(`  </reporting_person>`)

  lines.push(`  <location>`)
  lines.push(xmlTag("address_type", "OFFIC", "    "))
  lines.push(xmlTag("address", isCorporate ? corp?.company_address || "" : ind?.address || "", "    "))
  lines.push(xmlTag("city", isCorporate ? upper(corp?.city) : upper(ind?.city), "    "))
  lines.push(
    xmlTag(
      "country_code",
      isCorporate ? countryVal(corp?.country_incorporated || "") : countryVal(ind?.country_of_residence || ind?.country || ""),
      "    "
    )
  )
  lines.push(xmlTag("state", upper(reportingAddress.state), "    "))
  lines.push(`  </location>`)

  lines.push(xmlTag("reason", r?.comments ?? "", "  "))
  lines.push(xmlTag("action", "DPMSR filed in accordance with UAE AML regulations", "  "))

  lines.push(`  <activity>`)
  lines.push(`    <report_parties>`)
  lines.push(`      <report_party>`)

  if (isCorporate) {
    lines.push(`        <entity>`)
    lines.push(xmlTag("name", corp?.company_name ?? "", "          "))
    lines.push(xmlTag("commercial_name", corp?.company_name ?? "", "          "))
    lines.push(xmlTag("incorporation_number", corp?.trade_license_no ?? "", "          "))

    const corpPhone = corp?.office_no
      ? normalizePhone(`${corp?.office_country_code || ""}${corp?.office_no}`)
      : normalizePhone(corp?.phone_number)

    lines.push(`          <phones>`)
    if (corpPhone) {
      lines.push(`            <phone>`)
      lines.push(xmlTag("tph_contact_type", "OFFIC", "              "))
      lines.push(xmlTag("tph_communication_type", "L", "              "))
      lines.push(xmlTag("tph_number", corpPhone, "              "))
      lines.push(`            </phone>`)
    }
    lines.push(`          </phones>`)

    lines.push(`          <addresses>`)
    lines.push(`            <address>`)
    lines.push(xmlTag("address_type", "OFFIC", "              "))
    lines.push(xmlTag("address", corp?.company_address ?? "", "              "))
    lines.push(xmlTag("city", upper(corp?.city), "              "))
    lines.push(xmlTag("country_code", countryVal(corp?.country_incorporated), "              "))
    lines.push(xmlTag("state", upper(corp?.state), "              "))
    lines.push(`            </address>`)
    lines.push(`          </addresses>`)

    lines.push(xmlTag("incorporation_country_code", countryVal(corp?.country_incorporated), "          "))

    if (directorPicked && (directorPicked?.name || directorPicked?.id_no || directorPicked?.nationality)) {
      lines.push(`          <director_id>`)
      lines.push(xmlTag("first_name", directorName.first, "            "))
      lines.push(xmlTag("last_name", directorName.last, "            "))
      lines.push(xmlTag("birthdate", sqlDateTime(directorPicked?.dob), "            "))

      const idTypeCode = goamlIdType(directorPicked?.id_type)
      const idNo = directorPicked?.id_no || ""

      // Based on id_type: Passport -> passport_number, EID -> ssn
      if (idTypeCode === "PASSP") {
        lines.push(xmlTag("passport_number", idNo, "            "))
        lines.push(xmlTag("passport_country", countryVal(directorPicked?.passport_country || corp?.country_incorporated || ""), "            "))
      } else if (idTypeCode === "EID") {
        lines.push(xmlTag("ssn", idNo, "            "))
      }

      lines.push(xmlTag("id_number", idNo, "            "))
      lines.push(xmlTag("nationality1", countryVal(directorPicked?.nationality || ""), "            "))

      lines.push(`            <phones>`)
      const directorPhone = normalizePhone(directorPicked?.phone || directorPicked?.phone_number || "")
      const phoneLines = directorPhone
        ? buildPhoneBlock(directorPhone, "OFFIC", "L", "              ")
        : buildPhoneBlock(corpPhone, "OFFIC", "L", "              ")
      if (phoneLines.length > 0) lines.push(...phoneLines)
      lines.push(`            </phones>`)

      lines.push(`            <addresses>`)
      lines.push(`              <address>`)
      lines.push(xmlTag("address_type", "OFFIC", "                "))
      lines.push(xmlTag("address", corp?.company_address ?? "", "                "))
      lines.push(xmlTag("city", upper(corp?.city), "                "))
      lines.push(xmlTag("country_code", countryVal(corp?.country_incorporated), "                "))
      lines.push(xmlTag("state", upper(corp?.state), "                "))
      lines.push(`              </address>`)
      lines.push(`            </addresses>`)

      // lines.push(`            <employer_address_id>`)
      // lines.push(xmlTag("address_type", "OFFIC", "              "))
      // lines.push(xmlTag("address", corp?.company_address ?? "", "              "))
      // lines.push(xmlTag("city", upper(corp?.city), "              "))
      // lines.push(xmlTag("country_code", countryVal(corp?.country_incorporated), "              "))
      // lines.push(xmlTag("state", upper(corp?.state), "              "))
      // lines.push(`            </employer_address_id>`)

      // lines.push(`            <employer_phone_id>`)
      // lines.push(xmlTag("tph_contact_type", "OFFIC", "              "))
      // lines.push(xmlTag("tph_communication_type", "L", "              "))
      // lines.push(xmlTag("tph_number", corpPhone, "              "))
      // lines.push(`            </employer_phone_id>`)

      lines.push(`            <identification>`)
      lines.push(xmlTag("type", idTypeCode, "              "))
      lines.push(xmlTag("number", idNo, "              "))
      lines.push(xmlTag("issue_date", sqlDateTime(directorPicked?.id_issue), "              "))
      lines.push(xmlTag("expiry_date", sqlDateTime(directorPicked?.id_expiry), "              "))
      lines.push(xmlTag("issue_country", countryVal(directorPicked?.issuing_country || corp?.country_incorporated || ""), "              "))
      lines.push(`            </identification>`)

      lines.push(xmlTag("role", directorPicked?.role || "UBO", "            "))
      lines.push(`          </director_id>`)
    }

    lines.push(xmlTag("incorporation_date", dateTimeTo4am(corp?.license_issue_date || corp?.created_at), "          "))
    lines.push(`        </entity>`)
  } 
  else {
    lines.push(`        <person>`)
    lines.push(xmlTag("first_name", ind?.first_name ?? "", "          "))
    lines.push(xmlTag("last_name", ind?.last_name ?? "", "          "))
    lines.push(xmlTag("birthdate", sqlDateTime(ind?.dob), "          "))
    lines.push(xmlTag("nationality1", countryVal(ind?.nationality), "          "))

    const indPhone = ind?.contact_no ? `${ind?.country_code || ""}${ind?.contact_no}`.replace(/\s+/g, "") : ""
    lines.push(`          <phones>`)
    if (indPhone) {
      lines.push(`            <phone>`)
      lines.push(xmlTag("tph_contact_type", "HOME", "              "))
      lines.push(xmlTag("tph_communication_type", "M", "              "))
      lines.push(xmlTag("tph_number", indPhone, "              "))
      lines.push(`            </phone>`)
    }
    lines.push(`          </phones>`)

    lines.push(`          <addresses>`)
    lines.push(`            <address>`)
    lines.push(xmlTag("address_type", "HOME", "              "))
    lines.push(xmlTag("address", ind?.address ?? "", "              "))
    lines.push(xmlTag("city", ind?.city ?? "", "              "))
    lines.push(xmlTag("country_code", countryVal(ind?.country_of_residence || ind?.country), "              "))
    lines.push(xmlTag("state", "", "              "))
    lines.push(`            </address>`)
    lines.push(`          </addresses>`)

    lines.push(`          <identification>`)
    lines.push(xmlTag("type", ind?.id_type ? String(ind.id_type).slice(0, 4).toUpperCase() : "", "            "))
    lines.push(xmlTag("number", ind?.id_no ?? "", "            "))
    lines.push(xmlTag("issue_date", ind?.id_issue_date, "            "))
    lines.push(xmlTag("expiry_date", ind?.id_expiry_date, "            "))
    lines.push(xmlTag("issue_country", countryVal(ind?.issuing_country), "            "))
    lines.push(`          </identification>`)

    lines.push(`        </person>`)
  }

  // report_party reason/comments
  lines.push(xmlTag("reason", r?.comments ?? "", "        "))
  lines.push(xmlTag("comments", r?.comments ?? "", "        "))

  lines.push(`      </report_party>`)
  lines.push(`    </report_parties>`)



  lines.push(`    <goods_services>`)
  lines.push(`      <item>`)
  lines.push(xmlTag("item_type", r?.item_type?.toUpperCase?.() ?? "", "        "))
  lines.push(xmlTag("item_make", r?.item_make ?? "", "        "))
  lines.push(xmlTag("description", r?.description ?? "", "        "))
  lines.push(xmlTag("estimated_value", r?.estimated_value ?? "", "        "))
  lines.push(xmlTag("status_comments", r?.status_comments ?? "", "        "))
  lines.push(xmlTag("disposed_value", r?.disposed_value ?? "", "        "))
  lines.push(xmlTag("currency_code", r?.currency_code ?? "", "        "))

  // if (products.length > 0) {
  //   lines.push(`        <products>`)
  //   for (const p of products) {
  //     lines.push(`          <product>`) 
  //     lines.push(xmlTag("id", p?.id ?? "", "            "))
  //     lines.push(xmlTag("name", p?.name ?? "", "            "))
  //     lines.push(xmlTag("sku", p?.sku ?? "", "            "))
  //     lines.push(`          </product>`)
  //   }
  //   lines.push(`        </products>`)
  // }

  lines.push(`      </item>`)
  lines.push(`    </goods_services>`)
  lines.push(`  </activity>`)

  lines.push(`  <report_indicators>`)
  lines.push(xmlTag("indicator", "DPMSJ", "    "))
  lines.push(`  </report_indicators>`)

  lines.push(`</report>`)
  return lines.join("\n")
}

export function downloadXml(filename: string, xml: string) {
  const blob = new Blob([xml], { type: "application/xml" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}