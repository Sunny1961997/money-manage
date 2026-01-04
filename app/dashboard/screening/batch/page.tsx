"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, FileSpreadsheet } from "lucide-react"
import { useState } from "react"

export default function BatchScreeningPage() {
  const [dragActive, setDragActive] = useState(false)

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Batch Screening</h1>
      </div>

      <div className="space-y-4">
        <Button className="bg-blue-600 hover:bg-blue-700">
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
                  <code className="bg-slate-100 px-1 rounded">Entity</code>.
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
                  • <code className="bg-slate-100 px-1 rounded">dd/mm/yyyy</code> – Full date known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">01/05/1990</code>).
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">00/00/yyyy</code> – Only year known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">00/00/1990</code>).
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">00/mm/yyyy</code> – Month and year known (e.g.,{" "}
                  <code className="bg-slate-100 px-1 rounded">00/05/1990</code>).
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">dd/00/yyyy</code> – Day and year known (e.g.,{" "}
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
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Drag & drop a .xlsx file here, or click to select</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Upload className="w-4 h-4 mr-2" />
            Process Batch
          </Button>
        </div>
      </div>
    </div>
  )
}
