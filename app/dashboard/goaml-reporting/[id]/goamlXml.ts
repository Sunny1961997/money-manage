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

  const prefix = type === "corporate" ? "AMLM_COR" : "AMLM_INV"

  const base = [prefix, subject, date]
    .filter(Boolean)
    .join("_")

  return `${base}.xml`
}

export function buildGoamlXml(report: any) {
  const customer = report?.customer || {}
  const ind = customer?.individual_detail || {}
  const corp = customer?.corporate_detail || {}

  const products = Array.isArray(customer?.products) ? customer.products : []

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

  const isCorporate = customer?.customer_type === "corporate"

  // Use API values as-is (no country-name -> code mapping).
  const countryVal = (v: any) => (v === null || v === undefined ? "" : String(v))

  const normalizePhone = (v: any) => {
    const s = (v ?? "").toString().trim()
    if (!s) return ""
    // keep + if present, remove spaces
    return s.replace(/\s+/g, "")
  }

  // Best-effort: corporate related persons / UBOs
  const relatedPeople: any[] = Array.isArray(corp?.related_persons) ? corp.related_persons : []

  const firstDirector = relatedPeople[0] || {}

  const reporting = {
    first_name: isCorporate ? "" : ind?.first_name || "",
    last_name: isCorporate ? "" : ind?.last_name || "",
    birthdate: isCorporate ? "" : dateOnly(ind?.dob),
    ssn: !isCorporate ? (ind?.ssn || ind?.national_id || ind?.id_no || "") : "",
    passport_number: isCorporate ? "" : ind?.id_no || "",
    passport_country: isCorporate ? "" : countryVal(ind?.issuing_country || ""),
    nationality1: isCorporate ? "" : countryVal(ind?.nationality || ""),
    phone:
      !isCorporate && ind?.contact_no
        ? normalizePhone(`${ind?.country_code || ""}${ind?.contact_no}`)
        : isCorporate && corp?.office_no
          ? normalizePhone(`${corp?.office_country_code || ""}${corp?.office_no}`)
          : "",
    address: isCorporate ? corp?.company_address || "" : ind?.address || "",
    city: isCorporate ? corp?.city || "" : ind?.city || "",
    state: isCorporate ? (corp?.state || "") : (ind?.state || ""),
    country_code: isCorporate
      ? countryVal(corp?.country_incorporated || "")
      : countryVal(ind?.country_of_residence || ind?.country || ""),
  }

  const lines: string[] = []
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  lines.push(`<report>`)

  // Top-level metadata (align with example file; use available data where possible)
  lines.push(xmlTag("rentity_id", report?.company_information_id ?? "", "  "))
  lines.push(xmlTag("rentity_branch", "", "  "))
  lines.push(xmlTag("submission_code", "E", "  "))
  lines.push(xmlTag("report_code", "DPMSR", "  "))
  lines.push(xmlTag("entity_reference", report?.entity_reference ?? report?.id ?? "", "  "))
  lines.push(xmlTag("submission_date", report?.created_at ? dateTimeTo4am(report.created_at) : "", "  "))
  lines.push(xmlTag("currency_code_local", report?.currency_code ?? "", "  "))

  // reporting_person (fill from available API data)
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
    lines.push(xmlTag("tph_contact_type", "OFFIC", "        "))
    lines.push(xmlTag("tph_communication_type", "M", "        "))
    lines.push(xmlTag("tph_number", reporting.phone, "        "))
    lines.push(`      </phone>`)
  }
  lines.push(`    </phones>`)

  lines.push(`    <addresses>`)
  if (reporting.address || reporting.city || reporting.country_code || reporting.state) {
    lines.push(`      <address>`)
    lines.push(xmlTag("address_type", "OFFIC", "        "))
    lines.push(xmlTag("address", reporting.address, "        "))
    lines.push(xmlTag("city", reporting.city, "        "))
    lines.push(xmlTag("country_code", reporting.country_code, "        "))
    lines.push(xmlTag("state", reporting.state, "        "))
    lines.push(`      </address>`)
  }
  lines.push(`    </addresses>`)
  lines.push(`  </reporting_person>`)

  // location (fill from available API data)
  lines.push(`  <location>`)
  lines.push(xmlTag("address_type", "OFFIC", "    "))
  lines.push(xmlTag("address", isCorporate ? corp?.company_address || "" : ind?.address || "", "    "))
  lines.push(xmlTag("city", isCorporate ? corp?.city || "" : ind?.city || "", "    "))
  lines.push(
    xmlTag(
      "country_code",
      isCorporate ? countryVal(corp?.country_incorporated || "") : countryVal(ind?.country_of_residence || ind?.country || ""),
      "    "
    )
  )
  lines.push(xmlTag("state", isCorporate ? (corp?.state || "") : (ind?.state || ""), "    "))
  lines.push(`  </location>`)

  lines.push(xmlTag("reason", report?.comments ?? "", "  "))
  lines.push(xmlTag("action", "Filing a DPMSR as per the mandate", "  "))

  // activity
  lines.push(`  <activity>`)
  lines.push(`    <report_parties>`)
  lines.push(`      <report_party>`)

  if (isCorporate) {
    lines.push(`        <entity>`)
    lines.push(xmlTag("name", corp?.company_name ?? "", "          "))
    lines.push(xmlTag("commercial_name", corp?.company_name ?? "", "          "))
    lines.push(xmlTag("incorporation_number", corp?.trade_license_no ?? "", "          "))

    // phones
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

    // addresses
    lines.push(`          <addresses>`)
    lines.push(`            <address>`)
    lines.push(xmlTag("address_type", "OFFIC", "              "))
    lines.push(xmlTag("address", corp?.company_address ?? "", "              "))
    lines.push(xmlTag("city", corp?.city ?? "", "              "))
    lines.push(xmlTag("country_code", countryVal(corp?.country_incorporated), "              "))
    lines.push(xmlTag("state", corp?.state ?? "", "              "))
    lines.push(`            </address>`)
    lines.push(`          </addresses>`)

    lines.push(xmlTag("incorporation_country_code", countryVal(corp?.country_incorporated), "          "))

    // director_id block(s) (use related_persons if available)
    const directorsToEmit = relatedPeople.length > 0 ? relatedPeople : [firstDirector]

    for (const rp of directorsToEmit) {
      if (!rp) continue

      lines.push(`          <director_id>`)
      const directorFirst = rp?.first_name || rp?.name?.split?.(" ")?.[0] || ""
      const directorLast = rp?.last_name || (rp?.name ? rp.name.split(" ").slice(1).join(" ") : "")
      lines.push(xmlTag("first_name", directorFirst, "            "))
      lines.push(xmlTag("last_name", directorLast, "            "))
      lines.push(xmlTag("birthdate", dateOnly(rp?.dob), "            "))
      lines.push(xmlTag("passport_number", rp?.passport_number || rp?.id_no || rp?.id_number || "", "            "))
      lines.push(xmlTag("passport_country", countryVal(rp?.passport_country || rp?.issuing_country || corp?.country_incorporated || ""), "            "))
      lines.push(xmlTag("id_number", rp?.id_number || rp?.id_no || "", "            "))
      lines.push(xmlTag("nationality1", countryVal(rp?.nationality || rp?.nationality1 || ""), "            "))

      // Contact/addresses: fallback to entity office/address if not provided
      const directorPhone = normalizePhone(rp?.phone || rp?.phone_number || corpPhone)
      lines.push(`            <phones>`)
      if (directorPhone) {
        lines.push(`              <phone>`)
        lines.push(xmlTag("tph_contact_type", "OFFIC", "                "))
        lines.push(xmlTag("tph_communication_type", "L", "                "))
        lines.push(xmlTag("tph_number", directorPhone, "                "))
        lines.push(`              </phone>`)
      }
      lines.push(`            </phones>`)

      lines.push(`            <addresses>`)
      lines.push(`              <address>`)
      lines.push(xmlTag("address_type", "OFFIC", "                "))
      lines.push(xmlTag("address", corp?.company_address ?? "", "                "))
      lines.push(xmlTag("city", corp?.city ?? "", "                "))
      lines.push(xmlTag("country_code", countryVal(corp?.country_incorporated), "                "))
      lines.push(xmlTag("state", corp?.state ?? "", "                "))
      lines.push(`              </address>`)
      lines.push(`            </addresses>`)

      lines.push(`            <employer_address_id>`)
      lines.push(xmlTag("address_type", "OFFIC", "              "))
      lines.push(xmlTag("address", corp?.company_address ?? "", "              "))
      lines.push(xmlTag("city", corp?.city ?? "", "              "))
      lines.push(xmlTag("country_code", countryVal(corp?.country_incorporated), "              "))
      lines.push(xmlTag("state", corp?.state ?? "", "              "))
      lines.push(`            </employer_address_id>`)

      lines.push(`            <employer_phone_id>`)
      lines.push(xmlTag("tph_contact_type", "OFFIC", "              "))
      lines.push(xmlTag("tph_communication_type", "L", "              "))
      lines.push(xmlTag("tph_number", corpPhone, "              "))
      lines.push(`            </employer_phone_id>`)

      lines.push(`            <identification>`)
      lines.push(xmlTag("type", rp?.id_type ? String(rp.id_type).slice(0, 5).toUpperCase() : "PASSP", "              "))
      lines.push(xmlTag("number", rp?.id_no || rp?.id_number || "", "              "))
      // related_persons payload uses id_issue / id_expiry
      lines.push(xmlTag("issue_date", dateOnly(rp?.id_issue_date || rp?.id_issue), "              "))
      lines.push(xmlTag("expiry_date", dateOnly(rp?.id_expiry_date || rp?.id_expiry), "              "))
      lines.push(xmlTag("issue_country", countryVal(rp?.issuing_country || corp?.country_incorporated || ""), "              "))
      lines.push(`            </identification>`)

      lines.push(xmlTag("role", rp?.role || "UBO", "            "))
      lines.push(`          </director_id>`)
    }

    lines.push(xmlTag("incorporation_date", dateTimeTo4am(corp?.license_issue_date || corp?.created_at), "          "))
    lines.push(`        </entity>`)
  } else {
    // individual
    lines.push(`        <person>`)
    lines.push(xmlTag("first_name", ind?.first_name ?? "", "          "))
    lines.push(xmlTag("last_name", ind?.last_name ?? "", "          "))
    lines.push(xmlTag("birthdate", dateOnly(ind?.dob), "          "))
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
    lines.push(xmlTag("issue_date", dateOnly(ind?.id_issue_date), "            "))
    lines.push(xmlTag("expiry_date", dateOnly(ind?.id_expiry_date), "            "))
    lines.push(xmlTag("issue_country", countryVal(ind?.issuing_country), "            "))
    lines.push(`          </identification>`)

    lines.push(`        </person>`)
  }

  lines.push(xmlTag("reason", report?.comments ?? "", "        "))
  lines.push(xmlTag("comments", report?.comments ?? "", "        "))

  lines.push(`      </report_party>`)
  lines.push(`    </report_parties>`)

  // goods_services
  lines.push(`    <goods_services>`)
  lines.push(`      <item>`)
  lines.push(xmlTag("item_type", report?.item_type ?? "", "        "))
  lines.push(xmlTag("item_make", report?.item_make ?? "", "        "))
  lines.push(xmlTag("description", report?.description ?? "", "        "))
  lines.push(xmlTag("estimated_value", report?.estimated_value ?? "", "        "))
  lines.push(xmlTag("status_comments", report?.status_comments ?? "", "        "))
  lines.push(xmlTag("disposed_value", report?.disposed_value ?? "", "        "))
  lines.push(xmlTag("currency_code", report?.currency_code ?? "", "        "))

  // include products list as non-standard extension for now
  if (products.length > 0) {
    lines.push(`        <products>`)
    for (const p of products) {
      lines.push(`          <product>`) 
      lines.push(xmlTag("id", p?.id ?? "", "            "))
      lines.push(xmlTag("name", p?.name ?? "", "            "))
      lines.push(xmlTag("sku", p?.sku ?? "", "            "))
      lines.push(`          </product>`)
    }
    lines.push(`        </products>`)
  }

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