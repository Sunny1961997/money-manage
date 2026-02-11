"use client"

import { useEffect, useState, Fragment } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Download, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react"

export default function BatchResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
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
    }
  }, [router])

  if (!data) return <div className="p-6">Loading results...</div>

  const toggleRow = (rowNum: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowNum]: !prev[rowNum]
    }))
  }

  const handleDownloadCSV = () => {
    // Flatten data for CSV export
    const headers = [
       "Row Number", "Input Name", "Input Type", "Best Match Score", "Best Match Source",
       "Match Name", "Match ID", "Match Source", "Match Type", "Match Confidence"
    ]
    
    const rows: string[] = []
    rows.push(headers.join(","))

    data.rows?.filter((r: any) => r.input?.name?.trim()).forEach((row: any) => {
        const baseRow = [
            row.row_number,
            `"${(row.input?.name || "").replace(/"/g, '""')}"`,
            row.input?.customer_type,
            row.best_match?.confidence || 0,
            row.best_match?.source || "N/A"
        ]

        if (row.results && row.results.length > 0) {
            row.results.forEach((res: any) => {
                const fullRow = [
                    ...baseRow,
                    `"${(res.name || "").replace(/"/g, '""')}"`,
                    res.id,
                    res.source,
                    res.subject_type,
                    res.confidence
                ]
                rows.push(fullRow.join(","))
            })
        } else {
             const fullRow = [
                ...baseRow,
                `"No Match"`,
                "",
                "",
                "",
                ""
             ]
             rows.push(fullRow.join(","))
        }
    })

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "Batch_Screening_Results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadExcel = () => {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table>`
    
    // Headers
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

    data.rows?.filter((r: any) => r.input?.name?.trim()).forEach((row: any) => {
        const baseCells = `
            <td>${row.row_number}</td>
            <td>${row.input?.name || ""}</td>
            <td>${row.input?.customer_type || ""}</td>
            <td>${row.best_match?.confidence || 0}</td>
            <td>${row.best_match?.source || "N/A"}</td>
        `

        if (row.results && row.results.length > 0) {
            row.results.forEach((res: any) => {
               html += `<tr>
                    ${baseCells}
                    <td>${res.name || ""}</td>
                    <td>${res.id || ""}</td>
                    <td>${res.source || ""}</td>
                    <td>${res.subject_type || ""}</td>
                    <td>${res.confidence || ""}</td>
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
    
    html += `</tbody></table></body></html>`
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Batch_Screening_Results.xls'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-semibold">Batch Screening Results</h1>
           <p className="text-muted-foreground text-sm">
             Processed {data.meta?.processed_rows} rows | {data.meta?.matched_rows} matches found
           </p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard/screening/batch")}>
                New Batch
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={handleDownloadExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Excel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleDownloadCSV}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
             <CardTitle className="text-base">Results Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
             <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Row</TableHead>
                        <TableHead>Input Name</TableHead>
                        <TableHead>Input Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Best Match</TableHead>
                        <TableHead className="text-right">Confidence</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.rows?.filter((r: any) => r.input?.name?.trim()).map((row: any) => (
                        <Fragment key={row.row_number}>
                           <TableRow className="hover:bg-muted/5 cursor-pointer" onClick={() => toggleRow(row.row_number)}>
                                <TableCell>
                                    {expandedRows[row.row_number] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </TableCell>
                                <TableCell>{row.row_number}</TableCell>
                                <TableCell className="font-medium">{row.input?.name}</TableCell>
                                <TableCell>{row.input?.customer_type}</TableCell>
                                <TableCell>
                                    {row.best_match ? (
                                        <div className="flex items-center text-red-600 gap-1 text-xs font-medium bg-red-50 px-2 py-1 rounded w-fit">
                                            <AlertCircle className="w-3 h-3" />
                                            Hit Found
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-green-600 gap-1 text-xs font-medium bg-green-50 px-2 py-1 rounded w-fit">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Clean
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {row.best_match ? row.best_match.name : "-"}
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {row.best_match ? `${row.best_match.confidence}%` : "-"}
                                </TableCell>
                           </TableRow>
                           {expandedRows[row.row_number] && row.results && row.results.length > 0 && (
                               <TableRow className="bg-slate-50 hover:bg-slate-50 border-t-0">
                                   <TableCell colSpan={7} className="p-4 pl-12">
                                       <div className="border rounded-md bg-white">
                                           <Table>
                                               <TableHeader>
                                                   <TableRow className="border-b">
                                                       <TableHead className="h-9">Matched Name</TableHead>
                                                       <TableHead className="h-9">Source</TableHead>
                                                       <TableHead className="h-9">Type</TableHead>
                                                       <TableHead className="h-9 text-right">Score</TableHead>
                                                   </TableRow>
                                               </TableHeader>
                                               <TableBody>
                                                   {row.results.map((res: any) => (
                                                       <TableRow key={`${row.row_number}-${res.id}`}>
                                                           <TableCell>{res.name}</TableCell>
                                                           <TableCell>{res.source}</TableCell>
                                                           <TableCell>{res.subject_type}</TableCell>
                                                           <TableCell className="text-right font-medium">
                                                              {res.confidence}%
                                                           </TableCell>
                                                       </TableRow>
                                                   ))}
                                               </TableBody>
                                           </Table>
                                       </div>
                                   </TableCell>
                               </TableRow>
                           )}
                        </Fragment>
                    ))}
                </TableBody>
             </Table>
        </CardContent>
      </Card>
    </div>
  )
}
