import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { validateXML } from "xmllint-wasm"

const GOAML_XSD_PATH = path.join(process.cwd(), "public", "UAEFIU-GOAML-XML-SCHEMA-V2.00-18032026.xsd")

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const xml = typeof body?.xml === "string" ? body.xml : ""

    if (!xml.trim()) {
      return NextResponse.json(
        { status: false, message: "XML payload is required" },
        { status: 400 }
      )
    }

    const xsd = await readFile(GOAML_XSD_PATH, "utf8")
    const result = await validateXML({
      xml: [{
        fileName: "goaml-report.xml",
        contents: xml,
      }],
      schema: [{
        fileName: "UAEFIU-GOAML-XML-SCHEMA-V2.00-18032026.xsd",
        contents: xsd,
      }],
    })

    return NextResponse.json({
      status: true,
      data: {
        valid: result.valid,
        errors: result.errors.map((error) => error.message),
        rawOutput: result.rawOutput,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to validate XML"

    return NextResponse.json(
      { status: false, message },
      { status: 500 }
    )
  }
}