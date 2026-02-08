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
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return `${v}T00:00:00`
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? "" : `${d.toISOString().slice(0, 10)}T00:00:00`
  }

  const isCorporate = customer?.customer_type === "corporate"

  // Use API values as-is (no country-name -> code mapping).
  const countryVal = (v: any) => (v === null || v === undefined ? "" : String(v))

  const reporting = {
    first_name: isCorporate ? "" : ind?.first_name || "",
    last_name: isCorporate ? "" : ind?.last_name || "",
    birthdate: isCorporate ? "" : dateOnly(ind?.dob),
    passport_number: isCorporate ? "" : ind?.id_no || "",
    passport_country: isCorporate ? "" : countryVal(ind?.issuing_country || ""),
    nationality1: isCorporate ? "" : countryVal(ind?.nationality || ""),
    phone:
      !isCorporate && ind?.contact_no
        ? `${ind?.country_code || ""} ${ind?.contact_no}`.trim()
        : isCorporate && corp?.office_no
          ? `${corp?.office_country_code || ""} ${corp?.office_no}`.trim()
          : "",
    address: isCorporate ? corp?.company_address || "" : ind?.address || "",
    city: isCorporate ? corp?.city || "" : ind?.city || "",
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
  lines.push(xmlTag("report_code", "AMLMR", "  "))
  lines.push(xmlTag("entity_reference", report?.entity_reference ?? report?.id ?? "", "  "))
  lines.push(xmlTag("submission_date", report?.created_at ? dateOnly(report.created_at) : "", "  "))
  lines.push(xmlTag("currency_code_local", report?.currency_code ?? "", "  "))

  // reporting_person (fill from available API data)
  lines.push(`  <reporting_person>`)
  lines.push(xmlTag("first_name", reporting.first_name, "    "))
  lines.push(xmlTag("last_name", reporting.last_name, "    "))
  lines.push(xmlTag("birthdate", reporting.birthdate, "    "))
  lines.push(xmlTag("ssn", "", "    "))
  lines.push(xmlTag("passport_number", reporting.passport_number, "    "))
  lines.push(xmlTag("passport_country", reporting.passport_country, "    "))
  lines.push(xmlTag("nationality1", reporting.nationality1, "    "))

  lines.push(`    <phones>`)
  if (reporting.phone) {
    lines.push(`      <phone>`)
    lines.push(xmlTag("tph_contact_type", isCorporate ? "OFFIC" : "HOME", "        "))
    lines.push(xmlTag("tph_communication_type", isCorporate ? "L" : "M", "        "))
    lines.push(xmlTag("tph_number", reporting.phone, "        "))
    lines.push(`      </phone>`)
  }
  lines.push(`    </phones>`)

  lines.push(`    <addresses>`)
  if (reporting.address || reporting.city || reporting.country_code) {
    lines.push(`      <address>`)
    lines.push(xmlTag("address_type", isCorporate ? "OFFIC" : "HOME", "        "))
    lines.push(xmlTag("address", reporting.address, "        "))
    lines.push(xmlTag("city", reporting.city, "        "))
    lines.push(xmlTag("country_code", reporting.country_code, "        "))
    lines.push(xmlTag("state", "", "        "))
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
  lines.push(xmlTag("state", "", "    "))
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
      ? `${corp?.office_country_code || ""}${corp?.office_no}`.replace(/\s+/g, "")
      : ""
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
    lines.push(xmlTag("state", "", "              "))
    lines.push(`            </address>`)
    lines.push(`          </addresses>`)

    lines.push(xmlTag("incorporation_country_code", countryVal(corp?.country_incorporated), "          "))

    // director_id placeholder: use the first product as hint for role? keep minimal for now
    lines.push(`          <director_id></director_id>`)

    lines.push(xmlTag("incorporation_date", dateOnly(corp?.license_issue_date || corp?.created_at), "          "))
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