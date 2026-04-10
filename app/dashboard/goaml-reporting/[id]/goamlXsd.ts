
/**
 * Builds the filename for the XSD download
 * @param report - The report object containing metadata
 * @param fallbackId - Optional fallback ID if report doesn't have one
 * @returns Formatted filename string
 */
export function buildGoamlXsdFilename(report: any, fallbackId?: string): string {
  const date = (() => {
    const d = report?.created_at ? new Date(report.created_at) : null
    if (!d || Number.isNaN(d.getTime())) return ""
    return d.toISOString().slice(0, 10).replace(/-/g, "")
  })()

  const rentity_id = report?.company_information_id ?? 
                     report?.entity_reference ?? 
                     report?.id ?? 
                     fallbackId ?? 
                     "UNKNOWN"
  
  return `UAEFIU-GOAML-XML-SCHEMA-${rentity_id}-${date}.xsd`
}

/**
 * Fetches the XSD schema from the public directory
 * Works on both client and server side
 * @returns Promise with the XSD content
 */
export async function fetchGoamlXsd(): Promise<string> {
  // Client-side fetch from public directory
  try {
    const response = await fetch('/UAEFIU-GOAML-XML-SCHEMA-V2.00-18032026.xsd');
    if (!response.ok) {
      throw new Error(`Failed to fetch XSD: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching XSD file:', error);
    throw new Error('Failed to fetch GOAML XSD schema from /public directory');
  }
}

export type GoamlXmlValidationResult = {
  valid: boolean
  errors: string[]
  rawOutput: string
}

export async function validateGoamlXmlAgainstXsd(xml: string): Promise<GoamlXmlValidationResult> {
  const response = await fetch("/api/goaml/validate-xml", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ xml }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.status || !payload?.data) {
    throw new Error(payload?.message || "Failed to validate XML against GOAML XSD")
  }

  return payload.data as GoamlXmlValidationResult
}

/**
 * Downloads the XSD file
 * @param filename - Name of the file to download
 * @param xsd - XSD content to download
 */
export function downloadXsd(filename: string, xsd: string): void {
  const blob = new Blob([xsd], { type: "application/xml" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}