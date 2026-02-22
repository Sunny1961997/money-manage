"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCcw,
  Rows3,
} from "lucide-react"

type BatchRow = {
  row_number: number
  input?: {
    name?: string
    customer_type?: string
  }
  best_match?: {
    name?: string
    confidence?: number
    source?: string
  } | null
  results?: Array<{
    id?: string | number
    name?: string
    source?: string
    subject_type?: string
    confidence?: number
  }>
}

type BatchResults = {
  meta?: {
    processed_rows?: number
    matched_rows?: number
  }
  rows?: BatchRow[]
}

const PAGE_CLASS =
  "space-y-8 mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] backdrop-blur-sm transition-all"

export default function BatchResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<BatchResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const stored = sessionStorage.getItem("batchResults")
    if (!stored) {
      router.push("/dashboard/screening/batch")
      return
    }

    try {
      setData(JSON.parse(stored))
    } catch {
      router.push("/dashboard/screening/batch")
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  const rows = useMemo(
    () => (data?.rows || []).filter((row) => Boolean(row.input?.name?.trim())),
    [data]
  )

  const processedRows = Number(data?.meta?.processed_rows ?? rows.length)
  const matchedRows = Number(
    data?.meta?.matched_rows ?? rows.filter((row) => Boolean(row.best_match)).length
  )
  const cleanRows = Math.max(processedRows - matchedRows, 0)

  const toggleRow = (rowNum: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowNum]: !prev[rowNum],
    }))
  }

  const handleDownloadCSV = () => {
    const headers = [
      "Row Number",
      "Input Name",
      "Input Type",
      "Best Match Score",
      "Best Match Source",
      "Match Name",
      "Match ID",
      "Match Source",
      "Match Type",
      "Match Confidence",
    ]

    const csvRows: string[] = [headers.join(",")]

    rows.forEach((row) => {
      const baseRow = [
        row.row_number,
        `"${(row.input?.name || "").replace(/"/g, '""')}"`,
        row.input?.customer_type || "",
        row.best_match?.confidence || 0,
        row.best_match?.source || "N/A",
      ]

      if (row.results && row.results.length > 0) {
        row.results.forEach((result) => {
          const fullRow = [
            ...baseRow,
            `"${(result.name || "").replace(/"/g, '""')}"`,
            result.id || "",
            result.source || "",
            result.subject_type || "",
            result.confidence || "",
          ]
          csvRows.push(fullRow.join(","))
        })
      } else {
        csvRows.push([...baseRow, '"No Match"', "", "", "", ""].join(","))
      }
    })

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "Batch_Screening_Results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadExcel = () => {
    let html =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table>'

    html += `<thead><tr>
        <th>Row Number</th>
        <th>Input Name</th>
        <th>Input Type</th>
        <th>Best Match Score</th>
        <th>Best Match Source</th>
        <th>Match Name</th>
        <th>Match ID</th>
        <th>Match Source</th>
        <th>Match Type</th>
        <th>Match Confidence</th>
    </tr></thead><tbody>`

    rows.forEach((row) => {
      const baseCells = `
            <td>${row.row_number}</td>
            <td>${row.input?.name || ""}</td>
            <td>${row.input?.customer_type || ""}</td>
            <td>${row.best_match?.confidence || 0}</td>
            <td>${row.best_match?.source || "N/A"}</td>
        `

      if (row.results && row.results.length > 0) {
        row.results.forEach((result) => {
          html += `<tr>
                    ${baseCells}
                    <td>${result.name || ""}</td>
                    <td>${result.id || ""}</td>
                    <td>${result.source || ""}</td>
                    <td>${result.subject_type || ""}</td>
                    <td>${result.confidence || ""}</td>
               </tr>`
        })
      } else {
        html += `<tr>
                ${baseCells}
                <td>No Match</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
             </tr>`
      }
    })

    html += "</tbody></table></body></html>"

    const blob = new Blob([html], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "Batch_Screening_Results.xls"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="space-y-4 p-6">
            <h1 className="text-2xl font-semibold tracking-tight">Batch Screening Results</h1>
            <p className="text-sm text-muted-foreground">
              No result payload was found. Start a new batch screening to continue.
            </p>
            <Button variant="outline" className="h-10 rounded-xl" onClick={() => router.push("/dashboard/screening/batch")}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Back to Batch Screening
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card
        className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Rows3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Batch Screening Results</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Processed {processedRows} rows with {matchedRows} matched records.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button variant="outline" className="h-10 rounded-xl" onClick={() => router.push("/dashboard/screening/batch")}>
                New Batch
              </Button>
              <Button variant="outline" className="h-10 rounded-xl" onClick={handleDownloadExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
              <Button className="h-10 rounded-xl px-4" onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Processed Rows</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{processedRows}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Matches Found</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{matchedRows}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Clean Records</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{cleanRows}</p>
          </CardContent>
        </Card>
      </div>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="border-b border-border/60 px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Results Preview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Expand a row to inspect all source matches and confidence scores.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[56px]"></TableHead>
                  <TableHead>Row</TableHead>
                  <TableHead>Input Name</TableHead>
                  <TableHead>Input Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Best Match</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No rows available in this batch result.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const isExpanded = Boolean(expandedRows[row.row_number])

                    return (
                      <Fragment key={row.row_number}>
                        <TableRow className="hover:bg-muted/20">
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md"
                              onClick={() => toggleRow(row.row_number)}
                              aria-label={isExpanded ? "Collapse row" : "Expand row"}
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">{row.row_number}</TableCell>
                          <TableCell className="font-medium text-foreground">{row.input?.name || "-"}</TableCell>
                          <TableCell>{row.input?.customer_type || "-"}</TableCell>
                          <TableCell>
                            {row.best_match ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Hit Found
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Clean
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate">{row.best_match?.name || "-"}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {row.best_match?.confidence !== null && row.best_match?.confidence !== undefined
                              ? `${row.best_match.confidence}%`
                              : "-"}
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow className="bg-muted/20 hover:bg-muted/20">
                            <TableCell colSpan={7} className="px-6 py-4 md:px-12">
                              {row.results && row.results.length > 0 ? (
                                <div className="overflow-hidden rounded-xl border border-border/60 bg-background/90">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Matched Name</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Score</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {row.results.map((result, index) => (
                                        <TableRow key={`${row.row_number}-${result.id || index}`}>
                                          <TableCell>{result.name || "-"}</TableCell>
                                          <TableCell>{result.source || "-"}</TableCell>
                                          <TableCell>{result.subject_type || "-"}</TableCell>
                                          <TableCell className="text-right font-medium">
                                            {result.confidence !== null && result.confidence !== undefined
                                              ? `${result.confidence}%`
                                              : "-"}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <div className="rounded-xl border border-dashed border-border/70 bg-background/90 p-4 text-sm text-muted-foreground">
                                  No detailed matches for this row.
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
