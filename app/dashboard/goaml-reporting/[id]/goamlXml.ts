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

export function buildGoamlXml(report: any) {
  // Simple XML export of fields shown on the page (not official goAML XSD).
  const customer = report?.customer || {}
  const ind = customer?.individual_detail || {}
  const corp = customer?.corporate_detail || {}

  const created = report?.created_at ? new Date(report.created_at).toISOString() : ""

  const lines: string[] = []
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  lines.push(`<goaml_report>`)

  lines.push(xmlTag("report_id", report?.id ?? "", "  "))
  lines.push(xmlTag("created_at", created, "  "))

  lines.push(`  <customer>`)
  lines.push(xmlTag("customer_type", customer?.customer_type ?? "", "    "))
  lines.push(xmlTag("customer_name", report?.customer_name ?? customer?.name ?? "", "    "))
  lines.push(xmlTag("customer_id", report?.customer_id ?? customer?.id ?? "", "    "))
  lines.push(xmlTag("contact_office_number", customer?.contact_office_number ?? "", "    "))
  lines.push(xmlTag("company_address", corp?.company_address ?? customer?.company_address ?? "", "    "))

  lines.push(`    <individual_detail>`)
  lines.push(xmlTag("first_name", ind?.first_name ?? "", "      "))
  lines.push(xmlTag("last_name", ind?.last_name ?? "", "      "))
  lines.push(xmlTag("passport_country", ind?.passport_country ?? "", "      "))
  lines.push(xmlTag("nationality", ind?.nationality ?? "", "      "))
  lines.push(xmlTag("phone_number", ind?.phone_number ?? "", "      "))
  lines.push(xmlTag("address", ind?.address ?? "", "      "))
  lines.push(xmlTag("country_code", ind?.country_code ?? "", "      "))
  lines.push(`    </individual_detail>`)

  lines.push(`  </customer>`)

  lines.push(`  <report_details>`)
  lines.push(xmlTag("entity_reference", report?.entity_reference ?? "", "    "))
  lines.push(xmlTag("transaction_type", report?.transaction_type ?? "", "    "))
  lines.push(xmlTag("comments", report?.comments ?? "", "    "))
  lines.push(xmlTag("item_type", report?.item_type ?? "", "    "))
  lines.push(xmlTag("item_make", report?.item_make ?? "", "    "))
  lines.push(xmlTag("description", report?.description ?? "", "    "))
  lines.push(xmlTag("disposed_value", report?.disposed_value ?? "", "    "))
  lines.push(xmlTag("status_comments", report?.status_comments ?? "", "    "))
  lines.push(xmlTag("estimated_value", report?.estimated_value ?? "", "    "))
  lines.push(xmlTag("currency_code", report?.currency_code ?? "", "    "))
  lines.push(`  </report_details>`)

  lines.push(`</goaml_report>`)
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