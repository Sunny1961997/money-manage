"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Info, Loader2, Upload } from "lucide-react"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const PAGE_CLASS = "space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"
const INSTRUCTION_ICON_CLASS = "mt-0.5 h-4 w-4 shrink-0"

export default function BatchScreeningPage() {
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/Bulk screening.xlsx" 
    link.download = "Bulk screening.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFile = async (file: File) => {
    if (!file) return
    if (!/\.xlsx$/i.test(file.name)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel (.xlsx) file.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSelectedFileName(file.name)
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
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Batch Screening</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload one Excel file to process multiple screening checks in a single run.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
              <Button variant="outline" className="h-10 rounded-xl border-border/70 bg-background/90" onClick={handleDownloadTemplate}>
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept=".xlsx"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_minmax(0,1fr)]">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Info className={`${INSTRUCTION_ICON_CLASS} text-primary`} />
              <p className={SECONDARY_LABEL_CLASS}>Instructions</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-foreground">
              <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/80 p-3">
                <CheckCircle2 className={`${INSTRUCTION_ICON_CLASS} text-emerald-600`} />
                <p>
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">Customer Type</code> and{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">Name</code> are required. Type must be{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">Individual</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">Entity</code>, or{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">Vessel</code>.
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/80 p-3">
                <CheckCircle2 className={`${INSTRUCTION_ICON_CLASS} text-emerald-600`} />
                <p>
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">Gender</code> is optional and supports{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">male</code> or{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">female</code>.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/80 p-3">
                <p className="font-medium">Date of Birth: Optional, supported formats:</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`${INSTRUCTION_ICON_CLASS} text-emerald-600`} />
                    <span>
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">mm/dd/yyyy</code> - Full date known (e.g.,{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">01/05/1990</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`${INSTRUCTION_ICON_CLASS} text-emerald-600`} />
                    <span>
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">00/00/yyyy</code> - Only year known (e.g.,{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">00/00/1990</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`${INSTRUCTION_ICON_CLASS} text-emerald-600`} />
                    <span>
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">mm/00/yyyy</code> - Month and year known (e.g.,{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">00/05/1990</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`${INSTRUCTION_ICON_CLASS} text-emerald-600`} />
                    <span>
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">00/dd/yyyy</code> - Day and year known (e.g.,{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-[11px]">01/00/1990</code>).
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                <AlertTriangle className={`${INSTRUCTION_ICON_CLASS}`} />
                <p>
                  Rows with missing <code className="rounded bg-rose-100 px-1 py-0.5 text-[11px]">Customer Type</code> or{" "}
                  <code className="rounded bg-rose-100 px-1 py-0.5 text-[11px]">Name</code> will be skipped automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${CARD_STYLE} xl:self-start`}>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className={SECONDARY_LABEL_CLASS}>Upload File</p>
              <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                .xlsx only
              </span>
            </div>

            <div
              className={`mt-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors sm:p-9 ${
                dragActive ? "border-primary/60 bg-primary/10" : "border-border/70 bg-background/80"
              } ${loading ? "cursor-wait opacity-90" : "cursor-pointer"}`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => !loading && inputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
                    <Upload className="h-6 w-6" />
                  </span>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {loading ? "Processing batch file..." : "Drag and drop your template file here"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFileName ? `Selected: ${selectedFileName}` : "or click to select an Excel file"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="text-xs text-muted-foreground">
                Template:{" "}
                <code className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[11px]">Bulk screening.xlsx</code>
              </p>
              <Button className="h-10 rounded-xl px-5" disabled={loading} onClick={() => inputRef.current?.click()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Select and Process
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
