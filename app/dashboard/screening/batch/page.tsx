"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function BatchScreeningPage() {
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleDownloadTemplate = () => {
    // In a real app, this should link to a static asset in /public or similar
    // For now, let's trigger a download from a public URL or similar
    const link = document.createElement("a")
    link.href = "/Bulk screening.xlsx" // Ensure this file exists in /public folder
    link.download = "Bulk screening.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFile = async (file: File) => {
    if (!file) return
    if (!file.name.endsWith(".xlsx")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel (.xlsx) file.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/screening/batch", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()

      if (res.ok && json?.status === "success") {
        toast({
          title: "Batch processed successfully",
          description: `Processed ${json.meta?.processed_rows || 0} rows.`,
        })

        // Store result in localStorage or context to display on results page
        // Since payload can be large, consider other state management if needed.
        // For quick implementation:
        sessionStorage.setItem("batchResults", JSON.stringify(json))
        router.push("/dashboard/screening/batch/results")
      } else {
        toast({
          title: "Processing failed",
          description: json?.message || "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Batch Screening</h1>
      </div>

      <div className="space-y-4">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDownloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Excel Template
        </Button>

        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Customer Type: Required, must be <code className="bg-slate-100 px-1 rounded">Individual</code> or{" "}
                  <code className="bg-slate-100 px-1 rounded">Entity</code> or{" "}
                  <code className="bg-slate-100 px-1 rounded">Vessel</code>.
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Name: Required, enter the full name.</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Date of Birth: Optional, supported formats:</span>
              </li>
              <ul className="ml-8 space-y-1 text-sm text-muted-foreground">
                <li>
                  • <code className="bg-slate-100 px-1 rounded">mm/dd/yyyy</code> – Full date known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">01/05/1990</code>).
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">00/00/yyyy</code> – Only year known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">00/00/1990</code>).
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">mm/00/yyyy</code> – Month and year known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">00/05/1990</code>).
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">00/dd/yyyy</code> – Day and year known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">01/00/1990</code>).
                </li>
              </ul>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Gender: Optional, must be <code className="bg-slate-100 px-1 rounded">male</code>,{" "}
                  <code className="bg-slate-100 px-1 rounded">female</code>, or left empty.
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Fuzzy Search: Optional, must be <code className="bg-slate-100 px-1 rounded">1</code>,{" "}
                  <code className="bg-slate-100 px-1 rounded">2</code>, or empty (0 is omitted).
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Rows with missing Customer Type or Name will be{" "}
                  <span className="text-red-600 font-medium">skipped</span>.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept=".xlsx"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-4">
            {loading ? (
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {loading ? "Processing batch..." : "Drag & drop a .xlsx file here, or click to select"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
          >
            {loading ? (
               <>
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                 Processing...
               </>
            ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Process Batch
                </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
