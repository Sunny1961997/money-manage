"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Users, Upload, Download, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type EntryType = "single" | "batch"

export default function QuickOnboardingPage() {
  const [entryType, setEntryType] = useState<EntryType>("single")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xl font-semibold mb-1">
          <User className="w-5 h-5" />
          Quick Onboarding
        </div>
      </div>

      {/* Choose Entry Type */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Choose Entry Type</h2>
          <p className="text-sm text-blue-600">
            Selected: <span className="font-medium">{entryType === "single" ? "Single" : "Batch"}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => setEntryType("single")}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left hover:border-blue-300",
              entryType === "single" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-full", entryType === "single" ? "bg-blue-500" : "bg-gray-300")}>
                <User className={cn("w-5 h-5", entryType === "single" ? "text-white" : "text-gray-600")} />
              </div>
              <div>
                <div className="font-semibold text-base mb-1">Individual Single Entry</div>
                <div className="text-sm text-muted-foreground">Onboard single customer or sole proprietor entries.</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setEntryType("batch")}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left hover:border-blue-300",
              entryType === "batch" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-full", entryType === "batch" ? "bg-blue-500" : "bg-gray-300")}>
                <Users className={cn("w-5 h-5", entryType === "batch" ? "text-white" : "text-gray-600")} />
              </div>
              <div>
                <div className="font-semibold text-base mb-1">Individual Batch Entry</div>
                <div className="text-sm text-muted-foreground">Onboard batch entries of customers or entities.</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Single Entry Form */}
      {entryType === "single" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Individual</span>
              <h3 className="text-lg font-semibold">New Individual Registration</h3>
            </div>

            {/* Onboard with ID card */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <button className="flex items-center justify-between w-full text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                  </div>
                  Onboard with ID card
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-sm">Personal Information</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="firstName" placeholder="Enter first name" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="lastName" placeholder="Enter last name" className="mt-1.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="dob">
                    Date of Birth<span className="text-red-500">*</span>
                  </Label>
                  <Input id="dob" type="date" className="mt-1.5" />
                </div>
                <div>
                  <Label>
                    Residential Status<span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup defaultValue="resident" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resident" id="resident" />
                      <Label htmlFor="resident" className="font-normal cursor-pointer">
                        Resident
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-resident" id="non-resident" />
                      <Label htmlFor="non-resident" className="font-normal cursor-pointer">
                        Non-Resident
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input id="address" placeholder="Enter address" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="nationality">
                    Nationality<span className="text-red-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="uae">United Arab Emirates</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="countryCode">
                    Country Code <span className="text-red-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      <SelectItem value="+971">+971 (UAE)</SelectItem>
                      <SelectItem value="+1">+1 (USA)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactNo">
                    Contact No <span className="text-red-500">*</span>
                  </Label>
                  <Input id="contactNo" placeholder="Enter contact number" className="mt-1.5" />
                </div>
              </div>
            </div>

            {/* Identification Details */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-purple-50 rounded-lg">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                <h4 className="font-semibold text-sm">Identification Details</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idType">
                    ID Type <span className="text-red-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select an ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving-license">Driving License</SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="eid">Emirates ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="idNo">
                    ID No <span className="text-red-500">*</span>
                  </Label>
                  <Input id="idNo" placeholder="Enter ID number" className="mt-1.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="idIssued">
                    ID Issued Date<span className="text-red-500">*</span>
                  </Label>
                  <Input id="idIssued" type="date" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="idExpiry">
                    ID Expiry Date<span className="text-red-500">*</span>
                  </Label>
                  <Input id="idExpiry" type="date" className="mt-1.5" />
                </div>
              </div>
            </div>

            {/* Upload Documents */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-teal-50 rounded-lg">
                <Upload className="w-4 h-4 text-teal-600" />
                <h4 className="font-semibold text-sm">Upload Documents</h4>
              </div>

              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/30"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-blue-700">Add Documents</p>
                  <p className="text-xs text-muted-foreground">Drag & drop a .xlsx file here, or click to select</p>
                </div>
                <input type="file" className="hidden" id="fileUpload" onChange={handleFileChange} />
              </div>
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                <Info className="w-3 h-3" />
                Max 5 files, each up to 5MB (Images, PDFs, Docs)
              </p>
            </div>

            {/* Screening Settings */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 rounded-lg">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="font-semibold text-sm">Screening Settings</h4>
              </div>

              <div>
                <Label htmlFor="fuzziness" className="flex items-center gap-2">
                  Screening Fuzziness<span className="text-red-500">*</span>
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Label>
                <Select defaultValue="off">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">OFF</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Quick Onboard
            </Button>
          </div>
        </div>
      )}

      {/* Batch Entry Form */}
      {entryType === "batch" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Batch Onboarding</h3>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 mb-6">
              <Download className="w-4 h-4 mr-2" />
              Download Excel Template
            </Button>

            {/* Instructions */}
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm">Instructions</h4>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>First Name:</strong> Required, text (e.g., John).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Last Name:</strong> Required, text (e.g., Doe).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Date of Birth:</strong> Required, format: yyyy-mm-dd (e.g., 1990-01-01).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Residential Status:</strong> Required, must be "Resident" or "Non-Resident".
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Address:</strong> Required, text (e.g., 123 Main St, City).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Nationality:</strong> Required, valid country name (e.g., India).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Country Code:</strong> Required, valid phone country code (e.g., +91).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Contact Number:</strong> Required, numeric only (e.g., 1234567890).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Type:</strong> Required, valid ID type (e.g., Passport, EID).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Number:</strong> Required, text. For EID, use xxx-xxxx-xxxxxxx-x or digits only (e.g.,
                    123456789012345).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Issued Date:</strong> Required, format: yyyy-mm-dd (e.g., 2023-01-01).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Expiry Date:</strong> Required, format: yyyy-mm-dd (e.g., 2033-01-01).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Fuzzy Level:</strong> Required, must be 0, 1, or 2.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    Rows with missing Customer Type or Name will be <strong className="text-red-600">skipped</strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <p className="text-sm text-gray-600">
                Drag & drop a .xlsx file here, or{" "}
                <label htmlFor="batchFileUpload" className="text-blue-600 cursor-pointer hover:underline">
                  click to select
                </label>
              </p>
              <input type="file" className="hidden" id="batchFileUpload" accept=".xlsx" onChange={handleFileChange} />
              {selectedFile && <p className="mt-3 text-sm text-green-600">Selected: {selectedFile.name}</p>}
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Process Batch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
