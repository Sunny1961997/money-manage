"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Combobox } from "@/components/ui/combobox"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { User, Users, Upload, Download, Info, Loader2, ScanLine } from "lucide-react"
import { cn, formatContactNumber } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import Tesseract from "tesseract.js"

type EntryType = "single" | "batch"

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"
const FIELD_LABEL_CLASS = "mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"


const idTypes = [
  { value: "Passport", label: "Passport" },
  { value: "EID", label: "EID" },
  { value: "GCC ID", label: "GCC ID" },
  { value: "Govt. Issued ID", label: "Govt. Issued ID" },
  { value: "Commercial License", label: "Commercial License" },
]

const screeningFuzziness = [
  { value: "OFF", label: "OFF" },
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
]

const occupations = [
  { value: "Accounting", label: "Accounting" },
  { value: "Accounting/Auditing Firm", label: "Accounting/Auditing Firm" },
  { value: "Advertising, Marketing and PR", label: "Advertising, Marketing and PR" },
  { value: "Air Couriers and Cargo Services", label: "Air Couriers and Cargo Services" },
  { value: "Bank/Financial Institute", label: "Bank/Financial Institute" },
  { value: "Banking/Financial Institutions", label: "Banking/Financial Institutions" },
  { value: "Business Services Other", label: "Business Services Other" },
  { value: "CSP", label: "CSP" },
  { value: "Charitable Organizations and Foundations", label: "Charitable Organizations and Foundations" },
  { value: "Consulting/Freelancer", label: "Consulting/Freelancer" },
  { value: "DPMS - Bullion Wholesale", label: "DPMS - Bullion Wholesale" },
  { value: "DPMS - Factory, Workshop, Goldsmith", label: "DPMS - Factory, Workshop, Goldsmith" },
  { value: "DPMS - Mining, Refining", label: "DPMS - Mining, Refining" },
  { value: "DPMS - Retail Store", label: "DPMS - Retail Store" },
  { value: "Data Analytics, Management and Internet", label: "Data Analytics, Management and Internet" },
  { value: "Defense", label: "Defense" },
  { value: "Education", label: "Education" },
  { value: "Facilities Management and Maintenance", label: "Facilities Management and Maintenance" },
  { value: "General Trading", label: "General Trading" },
  { value: "Gold Bullion Trading", label: "Gold Bullion Trading" },
  { value: "Government Service", label: "Government Service" },
  { value: "HR and Recruiting Services", label: "HR and Recruiting Services" },
  { value: "HealthCare", label: "HealthCare" },
  { value: "IT and Network Services and Support", label: "IT and Network Services and Support" },
  { value: "Jewellery Trading", label: "Jewellery Trading" },
  { value: "Law Firm", label: "Law Firm" },
  { value: "Law Firms / Notary Public", label: "Law Firms / Notary Public" },
  { value: "Outside UAE", label: "Outside UAE" },
  { value: "Owner/Partner/Director", label: "Owner/Partner/Director" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Real Estate Sales", label: "Real Estate Sales" },
  { value: "Sale and Services", label: "Sale and Services" },
  { value: "Self Employed", label: "Self Employed" },
  { value: "Hawala and Exchange", label: "Hawala and Exchange" },
  { value: "Others", label: "Others" },
]

const sourceOfIncome = [
  { value: "Salary", label: "Salary" },
  { value: "Perosonal Savings", label: "Perosonal Savings" },
  { value: "Bank - Cash Withdrawal Slip", label: "Bank - Cash Withdrawal Slip" },
  { value: "Funds from Dividend Payouts", label: "Funds from Dividend Payouts" },
  { value: "End of Services Funds", label: "End of Services Funds" },
  { value: "Business Proceeds", label: "Business Proceeds" },
  { value: "Other sources", label: "Other sources" },
  { value: "Gift", label: "Gift" },
  { value: "Loan from Friends and Family", label: "Loan from Friends and Family" },
  { value: "Loans from Bank", label: "Loans from Bank" },
  { value: "Loan from Financial Institutions", label: "Loan from Financial Institutions" },
  { value: "Lottery/Raffles", label: "Lottery/Raffles" },
]

const OCR_ARABIC_PHRASE_MAP: Array<[string, string]> = [
  ["الشارقة-صناعية رقم 1", "Sharjah - Industrial Area No. 1"],
  ["صناعية رقم 1", "Industrial Area No. 1"],
  ["شارع الوحدة", "Al Wahda Street"],
  ["محل رقم", "Shop No."],
  ["صندوق البريد", "PO Box"],
  ["الهاتف المتحرك", "Mobile"],
  ["البريد الالكتروني", "Email"],
  ["البريد الإلكتروني", "Email"],
  ["أنشطة الرخصة", "License Activities"],
  ["صياغة الذهب", "Goldsmithing"],
  ["أطراف الرخصة", "License Members"],
  ["رقم الهوية / الجواز", "ID / Passport No"],
  ["اسم المستثمر", "Investor Name"],
  ["رقم المستثمر", "Investor No"],
  ["الجنسية", "Nationality"],
  ["الصفة", "Type"],
  ["الحصص", "Shares"],
  ["وكيل خدمات", "Service Agent"],
  ["وكيل خدمات محلي", "Local Service Agent"],
  ["المالك", "Owner"],
  ["الإمارات", "UAE"],
  ["اليمن", "Yemen"],
  ["الشارقة", "Sharjah"],
  ["دبي", "Dubai"],
  ["أبو ظبي", "Abu Dhabi"],
  ["مكتب", "Office"],
  ["شارع", "Street"],
  ["طريق", "Road"],
  ["مبنى", "Building"],
  ["برج", "Tower"],
  ["مركز", "Center"],
  ["تجاري", "Commercial"],
  ["العقارية", "Real Estate"],
  ["مؤسسة", "Foundation"],
  ["ملك", "Owned by"],
  ["رقم", "No."],
]

const OCR_COUNTRY_MAP: Record<string, string> = {
  "الإمارات": "UAE",
  "الامارات": "UAE",
  "اليمن": "Yemen",
  "لبنان": "Lebanon",
  "السعودية": "Saudi Arabia",
  "مصر": "Egypt",
  "الأردن": "Jordan",
  "الاردن": "Jordan",
}

const OCR_COUNTRY_REGEX = /\b(UAE|United Arab Emirates|Yemen|Lebanon|Saudi Arabia|Egypt|Jordan|Kuwait|Qatar|Bahrain|Oman|India|Bangladesh|Pakistan|Philippines|Indonesia)\b/i

export default function QuickOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [entryType, setEntryType] = useState<EntryType>("single")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isIdCardExpanded, setIsIdCardExpanded] = useState(false)
  const [idCardFile, setIdCardFile] = useState<File | null>(null)

  // OCR states
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)

  // Meta data
  const [countries, setCountries] = useState<Array<{ value: string; label: string; code?: string; phoneCode?: string }>>([])
  const [countryCodes, setCountryCodes] = useState<Array<{ value: string; label: string }>>([])
  const [loading, setLoading] = useState(true)

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState("")
  const [residentialStatus, setResidentialStatus] = useState("resident")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [nationality, setNationality] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [occupation, setOccupation] = useState("")
  const [sourceIncome, setSourceIncome] = useState("")
  const [idType, setIdType] = useState("")
  const [idNo, setIdNo] = useState("")
  const [idIssueDate, setIdIssueDate] = useState("")
  const [idExpiryDate, setIdExpiryDate] = useState("")
  // const [fuzziness, setFuzziness] = useState("OFF")

  const [submitting, setSubmitting] = useState(false)

  // Handler for batch upload
  const [batchSubmitting, setBatchSubmitting] = useState(false)
  const handleBatchUpload = async () => {
    if (!selectedFile || !selectedFile.name.endsWith('.xlsx')) {
      toast({
        title: "No file selected",
        description: "Please select a valid .xlsx file to process batch onboarding.",
      })
      return
    }
    setBatchSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      const res = await fetch("/api/onboarding/bulk-quick-upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(async () => ({ message: await res.text() }))
      if (res.ok) {
        toast({ title: "Batch upload successful", description: data?.message || "Batch onboarding submitted." })
        router.push("/dashboard/customers")
      } else {
        toast({
          title: "Batch upload failed",
          description: data?.message || data?.error || "Unknown error",
        })
      }
    } catch (err: any) {
      toast({
        title: "Batch upload failed",
        description: err?.message || "Network error",
      })
    } finally {
      setBatchSubmitting(false)
    }
  }

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/api/onboarding/meta", { credentials: "include" })
        const json = await res.json()
        const countryList = json.data.countries.countries.map((c: any) => ({
          value: c.name,
          label: c.name,
          code: c.sortname,
          phoneCode: c.phoneCode,
        }))
        setCountries(countryList)
        setCountryCodes(
          countryList
            .filter((c: any) => c.phoneCode && c.phoneCode !== "+0")
            .map((c: any) => ({
              value: `${c.phoneCode}`,
              label: `${c.phoneCode} (${c.label})`
            }))
        )
      } catch (e) {
        console.error("Failed to fetch meta:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchMeta()
  }, [])
  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/Quick Onboarding.xlsx"
    link.download = "Quick Onboarding.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

  const handleIdCardDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIdCardFile(e.dataTransfer.files[0])
    }
  }

  // Convert PDF to images
  const convertPdfToImages = async (file: File): Promise<string[]> => {
    // Dynamically import pdfjs-dist to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    
    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`
    
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const images: string[] = []

    // Process each page of the PDF
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR

      // Create canvas
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      if (context) {
        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise

        // Convert canvas to data URL
        images.push(canvas.toDataURL('image/png'))
      }
    }

    return images
  }

  // OCR Processing Function
  const processOCR = async (file: File) => {
    setOcrProcessing(true)
    setOcrProgress(0)

    try {
      let imagesToProcess: (File | string)[] = [file]
      
      // Check if file is PDF
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Converting PDF",
          description: "Converting PDF to images for OCR processing...",
        })
        
        // Convert PDF to images
        const pdfImages = await convertPdfToImages(file)
        imagesToProcess = pdfImages
      }

      let allText = ''
      
      // Process all images (either original image or converted PDF pages)
      for (let i = 0; i < imagesToProcess.length; i++) {
        const image = imagesToProcess[i]
        
        const result = await Tesseract.recognize(
          image,
          'eng+ara',
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                const overallProgress = ((i / imagesToProcess.length) + (m.progress / imagesToProcess.length)) * 100
                setOcrProgress(Math.round(overallProgress))
              }
            }
          }
        )

        allText += result.data.text + '\n'
      }
      
      console.log('OCR Result:', allText)
      
      // Parse and extract information from OCR text
      await extractDataFromOCR(allText)
      
      toast({
        title: "OCR Completed",
        description: "Information extracted and populated in the form. Please verify the data.",
      })
    } catch (error: any) {
      console.error('OCR Error:', error)
      toast({
        title: "OCR Failed",
        description: error?.message || "Failed to process the image. Please try again.",
      })
    } finally {
      setOcrProcessing(false)
      setOcrProgress(0)
    }
  }

  // Helper function to translate Arabic text to English using translation API
  const translateArabicToEnglish = async (text: string): Promise<string> => {
    const source = String(text || "")
    if (!/[\u0600-\u06FF]/.test(source)) return source

    let translatedText = source
    for (const [arabic, english] of OCR_ARABIC_PHRASE_MAP.sort((a, b) => b[0].length - a[0].length)) {
      translatedText = translatedText.replace(new RegExp(arabic, 'g'), english)
    }

    return translatedText
  }

  // Helper function to clean and extract English text from bilingual text
  const extractEnglishText = (text: string): string => {
    // Keep only useful English content from bilingual OCR lines.
    return String(text || "")
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
      .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, " ")
      .replace(/[،؛]/g, ",")
      .replace(/\//g, " ")
      .replace(/\s*,\s*/g, ", ")
      .replace(/(?:,\s*){2,}/g, ", ")
      .replace(/(^[,\s]+|[,\s]+$)/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  const cleanOcrLine = (text: string): string => {
    return String(text || "")
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
      .replace(/[|]+/g, " ")
      .replace(/[•·]+/g, " ")
      .replace(/[_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  const looksLikeAddressLine = (line: string): boolean => {
    const value = cleanOcrLine(line)
    if (!value || value.length < 6) return false

    return /[\u0600-\u06FF]/.test(value)
      || /(office|building|tower|center|centre|shop|floor|street|road|po box|p\.?o\.? box|parcel|block|deira|bur dubai|dubai|sharjah|abu dhabi|ajman|uae|emirates|maktab|commercial|real estate)/i.test(value)
      || /(مكتب|مبنى|برج|مركز|تجاري|شارع|طريق|العقارية|دبي|الشارقة|أبو ظبي|الإمارات)/i.test(value)
      || /\d{1,5}[\/-]\d{1,5}/.test(value)
  }

  const cleanupTranslatedAddress = (text: string): string => {
    return String(text || "")
      .replace(/\s*\/\s*/g, ", ")
      .replace(/\s*,\s*/g, ", ")
      .replace(/,{2,}/g, ",")
      .replace(/\bNo\s*\.\s*/gi, "No. ")
      .replace(/\bP\.?\s*O\.?\s*Box\b/gi, "PO Box")
      .replace(/\bU\.?A\.?E\.?\b/gi, "UAE")
      .replace(/\s+/g, " ")
      .replace(/(^[,:\-\s]+|[,:\-\s]+$)/g, "")
      .trim()
  }

  const normalizeExtractedAddress = (text: string): string => {
    return String(text || "")
      .replace(/\r/g, " ")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  const translateAddressToEnglish = async (text: string): Promise<string> => {
    const source = cleanOcrLine(text)
    if (!source) return ""

    let result = source
    if (/[\u0600-\u06FF]/.test(source)) {
      result = await translateArabicToEnglish(source)
    }

    const englishOnly = extractEnglishText(result)
    return cleanupTranslatedAddress(englishOnly || result)
  }

  const getEnglishCountry = (value: string): string => {
    const text = cleanOcrLine(value)
    if (!text) return ""
    if (OCR_COUNTRY_MAP[text]) return OCR_COUNTRY_MAP[text]

    const translated = extractEnglishText(text)
    if (/\bUAE\b/i.test(translated)) return "UAE"
    if (/\bYemen\b/i.test(translated)) return "Yemen"
    if (/\bLebanon\b/i.test(translated)) return "Lebanon"
    return translated || text
  }

  const looksLikeEnglishFullName = (value: string): boolean => {
    const cleaned = cleanOcrLine(value)
    if (!cleaned) return false
    if (/(service agent|owner|manager|investor|nationality|shares|type|passport|license)/i.test(cleaned)) return false
    if (!/[A-Z]/.test(cleaned)) return false

    const words = cleaned.split(/\s+/).filter(Boolean)
    return words.length >= 3 && words.every((word) => /^[A-Z][A-Z'-]*$/i.test(word))
  }

  const extractOwnerRowData = (lines: string[]) => {
    const ownerIndex = lines.findIndex((line) => /(^|\b)(owner|المالك)(\b|$)/i.test(line))
    if (ownerIndex === -1) return { ownerName: "", ownerNationality: "" }

    const windowLines = lines.slice(Math.max(0, ownerIndex - 6), Math.min(lines.length, ownerIndex + 8))

    const ownerName = windowLines
      .map((line) => extractEnglishText(line))
      .find((line) => looksLikeEnglishFullName(line)) || ""

    const ownerNationality = windowLines
      .map((line) => getEnglishCountry(line))
      .find((line) => /^(UAE|Yemen|Lebanon|Saudi Arabia|Egypt|Jordan)$/i.test(line)) || ""

    return { ownerName: cleanOcrLine(ownerName), ownerNationality: ownerNationality.trim() }
  }

  const extractTopBlockAddress = async (lines: string[]) => {
    const topLines = lines.slice(0, Math.min(lines.length, 25))
    const candidates = topLines.filter((line) => {
      const value = cleanOcrLine(line)
      if (!looksLikeAddressLine(value)) return false
      if (/@/.test(value)) return false
      if (/^\d[\d\s-]{6,}$/.test(value.replace(/\s+/g, ""))) return false
      if (/(license activities|license members|email|mobile|po box|investor|owner|service agent)/i.test(extractEnglishText(value))) return false
      return true
    })

    const best = candidates.sort((a, b) => b.length - a.length)[0]
    return best ? normalizeExtractedAddress(best) : ""
  }

  const extractAddressBelowEmail = async (lines: string[]) => {
    const emailIndex = lines.findIndex((line) => /@[\w.-]+\.[A-Za-z]{2,}/i.test(line))
    if (emailIndex === -1) return ""

    const collected: string[] = []
    for (let i = emailIndex + 1; i < Math.min(emailIndex + 6, lines.length); i++) {
      const line = cleanOcrLine(lines[i])
      if (!line) continue
      if (/(remarks|ملاحظات|phone|mobile|tel|contact|هاتف|po\s*box|p\.?o\.?\s*box|صندوق البريد)/i.test(line)) break

      const isLabelOnly = /^(address|العنوان)$/i.test(line)
      if (!isLabelOnly && looksLikeAddressLine(line)) {
        collected.push(line)
      } else if (collected.length > 0) {
        break
      }
    }

    if (collected.length === 0) return ""
    return normalizeExtractedAddress(collected.join(", "))
  }

  const isLikelyPersonNameEnglish = (value: string): boolean => {
    const cleaned = cleanOcrLine(extractEnglishText(value))
    if (!cleaned) return false
    if (/(owner|owners|manager|managers|shareholder|nationality|passport|license|members|service|agent|shares|investor|address|email|mobile)/i.test(cleaned)) return false

    const words = cleaned.split(/\s+/).filter(Boolean)
    if (words.length < 2 || words.length > 8) return false
    return words.every((word) => /^[A-Za-z][A-Za-z'-]*$/.test(word))
  }

  const splitNameParts = (fullName: string) => {
    const words = cleanOcrLine(fullName).split(/\s+/).filter(Boolean)
    if (words.length === 0) return { first: "", last: "" }
    if (words.length === 1) return { first: words[0], last: "" }
    return { first: words[0], last: words.slice(1).join(" ") }
  }

  const extractPreferredNameFromOCR = (lines: string[], fullText: string) => {
    const candidates: Array<{ value: string; priority: number }> = []

    const addCandidate = (value: string, priority: number) => {
      let cleaned = cleanOcrLine(extractEnglishText(value))

      // Remove leading country token if OCR row is like: "Owner Yemen NAMRAN ..."
      cleaned = cleaned.replace(/^(UAE|United Arab Emirates|Yemen|Lebanon|Saudi Arabia|Egypt|Jordan)\s+/i, "")

      if (isLikelyPersonNameEnglish(cleaned)) {
        candidates.push({ value: cleaned, priority })
      }
    }

    // Pattern: OWNER(S) MADHAV SHARMA
    const ownerInline = fullText.match(/owner\(s\)\s*[:\-]?\s*([A-Z][A-Za-z'\-\s]{2,})/i)
    if (ownerInline?.[1]) {
      addCandidate(ownerInline[1], 100)
    }

    for (let i = 0; i < lines.length; i++) {
      const line = cleanOcrLine(lines[i])
      const english = cleanOcrLine(extractEnglishText(line))

      // Owners first, then managers fallback
      if (/(^|\b)(owners?|المالك|المالكون)(\b|$)/i.test(line)) {
        addCandidate(english.replace(/\bowners?\b/i, ""), 95)
        addCandidate(lines[i + 1] || "", 92)
        addCandidate(lines[i + 2] || "", 90)
      }

      if (/(^|\b)(managers?|المديرون)(\b|$)/i.test(line)) {
        addCandidate(english.replace(/\bmanagers?\b/i, ""), 85)
        addCandidate(lines[i + 1] || "", 83)
        addCandidate(lines[i + 2] || "", 80)
      }

      // License members rows: prefer Owner, fallback Service Agent Local
      if (/\bowner\b/i.test(english)) {
        const ownerInlineName = english.match(/\bowner\b\s*(?:UAE|United Arab Emirates|Yemen|Lebanon|Saudi Arabia|Egypt|Jordan)?\s*([A-Z][A-Za-z'\-\s]{4,})$/i)
        if (ownerInlineName?.[1]) {
          addCandidate(ownerInlineName[1], 96)
        }
        addCandidate(lines[i + 1] || "", 88)
        addCandidate(lines[i + 2] || "", 86)
      }
      if (/service\s*agent(\s*local)?/i.test(english)) {
        const serviceInlineName = english.match(/service\s*agent(?:\s*local)?\s*(?:UAE|United Arab Emirates|Yemen|Lebanon|Saudi Arabia|Egypt|Jordan)?\s*([A-Z][A-Za-z'\-\s]{4,})$/i)
        if (serviceInlineName?.[1]) {
          addCandidate(serviceInlineName[1], 84)
        }
        addCandidate(lines[i + 1] || "", 78)
        addCandidate(lines[i + 2] || "", 76)
      }

      // Shareholder row: Name 100 % Nationality Passport
      const shareholderRow = english.match(/^([A-Za-z][A-Za-z'\-\s]{3,})\s+\d{1,3}(?:\.\d+)?\s*%\s+([A-Za-z][A-Za-z\s]{2,})\s+([A-Z0-9\-]{5,})$/i)
      if (shareholderRow?.[1]) {
        addCandidate(shareholderRow[1], 89)
      }

      // Generic upper-case full-name line, often appears after owner row
      if (isLikelyPersonNameEnglish(english) && /^[A-Z\s'\-]+$/.test(english)) {
        const prevContext = cleanOcrLine(extractEnglishText(lines[i - 1] || ""))
        if (/(owner|license members|shareholder|manager|service agent)/i.test(prevContext)) {
          addCandidate(english, 84)
        }
      }
    }

    if (candidates.length === 0) return ""
    return candidates.sort((a, b) => b.priority - a.priority)[0].value
  }

  const extractNationalityAndIdFromOCR = (lines: string[], fullText: string) => {
    let nationalityValue = ""
    let idValue = ""

    // Shareholder row pattern: Name 100 % Bangladesh EJ0726841
    const shareholderMatch = fullText.match(/([A-Z][A-Za-z'\-\s]{2,})\s+\d{1,3}(?:\.\d+)?\s*%\s+([A-Za-z][A-Za-z\s]{2,})\s+([A-Z0-9\-]{5,})/i)
    if (shareholderMatch) {
      nationalityValue = shareholderMatch[2]
      idValue = shareholderMatch[3]
    }

    for (const rawLine of lines) {
      const line = cleanOcrLine(rawLine)
      const english = cleanOcrLine(extractEnglishText(line))

      if (!nationalityValue) {
        const natInline = english.match(/\bnationality\b\s*[:\-]?\s*([A-Za-z\s]{2,})/i)
        if (natInline?.[1]) nationalityValue = natInline[1].trim()

        if (!nationalityValue && /(owner|service\s*agent|shareholder)/i.test(english)) {
          const country = english.match(OCR_COUNTRY_REGEX)
          if (country?.[1]) nationalityValue = country[1]
        }
      }

      if (!idValue) {
        const idMatches = line.match(/\b([A-Z]{1,2}\d{6,}|\d{7,18})\b/g)
        if (idMatches && idMatches.length > 0 && /(passport|id|owner|shareholder|service\s*agent|investor)/i.test(english)) {
          idValue = idMatches[idMatches.length - 1]
        }
      }
    }

    return {
      nationalityValue: getEnglishCountry(nationalityValue),
      idValue: cleanOcrLine(idValue),
    }
  }

  const extractRoleBasedNationality = (lines: string[]) => {
    let ownerNationality = ""
    let serviceNationality = ""
    let managerNationality = ""
    const countryWord = "(UAE|United Arab Emirates|Yemen|Lebanon|Saudi Arabia|Egypt|Jordan|Kuwait|Qatar|Bahrain|Oman|India|Bangladesh|Pakistan|Philippines|Indonesia)"

    for (const rawLine of lines) {
      const english = cleanOcrLine(extractEnglishText(rawLine))
      if (!english) continue

      if (!ownerNationality && /\bowner\b/i.test(english)) {
        const ownerMatch = english.match(new RegExp(`\\bowner\\b\\s*${countryWord}\\b`, "i"))
          || english.match(new RegExp(`\\b${countryWord}\\b\\s*\\bowner\\b`, "i"))
        if (ownerMatch?.[1]) {
          ownerNationality = getEnglishCountry(ownerMatch[1])
          continue
        }
      }

      if (!serviceNationality && /service\s*agent/i.test(english)) {
        const serviceMatch = english.match(new RegExp(`service\\s*agent(?:\\s*local)?\\s*${countryWord}\\b`, "i"))
          || english.match(new RegExp(`\\b${countryWord}\\b\\s*service\\s*agent`, "i"))
        if (serviceMatch?.[1]) {
          serviceNationality = getEnglishCountry(serviceMatch[1])
          continue
        }
      }

      if (!managerNationality && /\bmanager\b/i.test(english)) {
        const managerMatch = english.match(new RegExp(`\\bmanager\\b\\s*${countryWord}\\b`, "i"))
          || english.match(new RegExp(`\\b${countryWord}\\b\\s*\\bmanager\\b`, "i"))
        if (managerMatch?.[1]) {
          managerNationality = getEnglishCountry(managerMatch[1])
        }
      }
    }

    return ownerNationality || serviceNationality || managerNationality || ""
  }

  const extractAddressFromAddressLabel = (lines: string[]) => {
    // Structured address fields pattern
    const getValueAfterLabel = (regex: RegExp) => {
      const line = lines.find((l) => regex.test(l))
      if (!line) return ""
      const cleaned = cleanOcrLine(line)
      const value = cleaned.replace(regex, "").replace(/^[:\-\s]+/, "").trim()
      return extractEnglishText(value) || value
    }

    const premises = getValueAfterLabel(/.*premises\s*number\s*/i)
    const building = getValueAfterLabel(/.*building\s*name\s*/i)
    const district = getValueAfterLabel(/.*business\s*district\s*/i)
    const makani = getValueAfterLabel(/.*makani\s*no\.?\s*/i)

    const structured = [premises, building, district, makani].filter(Boolean)
    if (structured.length > 0) {
      return normalizeExtractedAddress(structured.join(", "))
    }

    const idx = lines.findIndex((line) => /(address|العنوان)/i.test(line))
    if (idx === -1) return ""

    const englishParts: string[] = []
    const fallbackParts: string[] = []

    for (let i = idx; i < Math.min(idx + 8, lines.length); i++) {
      let line = cleanOcrLine(lines[i])
      if (!line) continue
      if (/(mobile|phone|tel|email|البريد\s*الإلكتروني|الهاتف|remarks|ملاحظات|issue\s*date|expiry\s*date|managers?|owners?|license\s*members|license\s*activities|المديرون|المالك|المالكون|تاريخ\s*الإصدار|تاريخ\s*الانتهاء)/i.test(line) && i > idx) break

      line = line.replace(/\baddress\b/gi, "").replace(/العنوان/gi, "").replace(/^[:\-\s]+/, "").trim()
      if (!line) continue

      const english = cleanOcrLine(extractEnglishText(line))
      if (english && /[A-Za-z]{2,}/.test(english)) {
        englishParts.push(english)
      } else {
        fallbackParts.push(line)
      }
    }

    const normalizeAddressOutput = (value: string) => {
      const filtered = value
        .split(",")
        .map((segment) => cleanOcrLine(segment))
        .filter(Boolean)
        .filter((segment) => /[A-Za-z0-9\u0600-\u06FF]/.test(segment))
        .filter((segment) => !/^(issue\s*date|expiry\s*date|managers?|owners?|license\s*members|license\s*activities)$/i.test(segment))
        .join(", ")

      return normalizeExtractedAddress(filtered)
    }

    if (englishParts.length > 0) {
      return normalizeAddressOutput(englishParts.join(", "))
    }
    if (fallbackParts.length > 0) {
      return normalizeAddressOutput(fallbackParts.join(", "))
    }
    return ""
  }

  // Extract data from OCR text
  const extractDataFromOCR = async (text: string) => {
    // Split text into lines for easier processing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    console.log('Extracted lines:', lines)
    
    // Track if country code was set from mobile (to prevent nationality from overwriting)
    let countryCodeSetFromMobile = false
    
    const { ownerName, ownerNationality } = extractOwnerRowData(lines)
    const preferredName = extractPreferredNameFromOCR(lines, text)
    const { nationalityValue, idValue } = extractNationalityAndIdFromOCR(lines, text)
    const roleNationality = extractRoleBasedNationality(lines)

    // Extract Name - Enhanced to handle commercial licenses and share owner info
    // Look for patterns like "KHALED KHODER AL AYCH" in Share/Owner section
    let nameFound = false
    if (preferredName) {
      const parts = splitNameParts(preferredName)
      if (parts.first) {
        setFirstName(parts.first)
        setLastName(parts.last)
        nameFound = true
      }
    }

    if (!nameFound && ownerName) {
      const nameParts = ownerName.split(/\s+/)
      if (nameParts.length >= 2) {
        setFirstName(nameParts[0])
        setLastName(nameParts.slice(1).join(' '))
        nameFound = true
      }
    }
    const shareSectionLines = lines.filter((line) => /(shares?\s*owner|manager|مالك\s*حصص|مدير|nationality|الجنسية|role|صفة)/i.test(line))
    
    // Try to find name in Share/Owner section - specifically target the Name column
    // Pattern: Look for uppercase English names after "Shares Owner" or similar headers
    const shareSection = text.match(/(?:shares?\s*owner|manager|مالك\s*حصص|مدير)[\s\S]*?$/i)
    if (!nameFound && shareSection) {
      // Look for sequences of capitalized English words (names are usually in CAPS)
      const capitalizedNames = shareSection[0].match(/\b[A-Z][A-Z]+(?:\s+[A-Z]+)+\b/g)
      if (capitalizedNames && capitalizedNames.length > 0) {
        // Get the first capitalized name sequence (likely the person's name)
        let fullName = capitalizedNames[0].trim().replace(/\s+/g, ' ')
        
        // Filter out common non-name words
        const excludeWords = ['SHARES', 'OWNER', 'MANAGER', 'NATIONALITY', 'ROLE', 'SHARE', 'NAME', 'LICENSE', 'LLC', 'COMPANY']
        fullName = fullName.split(' ').filter(word => !excludeWords.includes(word)).join(' ')
        
        if (fullName) {
          const nameParts = fullName.split(/\s+/)
          if (nameParts.length >= 2) {
            setFirstName(nameParts[0])
            setLastName(nameParts.slice(1).join(' '))
            nameFound = true
          } else if (nameParts.length === 1) {
            setFirstName(nameParts[0])
            nameFound = true
          }
        }
      }
    }

    if (!nameFound) {
      const candidateLine = shareSectionLines.find((line) => {
        const cleaned = cleanOcrLine(extractEnglishText(line))
        if (!cleaned) return false
        if (/(shares?|owner|manager|nationality|role|license|company|llc|name)/i.test(cleaned)) return false

        const words = cleaned.split(/\s+/).filter(Boolean)
        return words.length >= 2 && words.every((word) => /^[A-Z][A-Za-z'-]*$/.test(word))
      })

      if (candidateLine) {
        const fullName = cleanOcrLine(extractEnglishText(candidateLine))
        const nameParts = fullName.split(/\s+/)
        if (nameParts.length >= 2) {
          setFirstName(nameParts[0])
          setLastName(nameParts.slice(1).join(' '))
          nameFound = true
        }
      }
    }
    
    // Fallback: look for general name patterns
    if (!nameFound) {
      const namePattern = /(?:name|holder|cardholder|الاسم)[:\s\/]+([A-Z][A-Za-z\s]+)/i
      const nameMatch = text.match(namePattern)
      if (nameMatch && nameMatch[1]) {
        let fullName = extractEnglishText(nameMatch[1]).trim().replace(/\s+/g, ' ')
        const nameParts = fullName.split(/\s+/)
        if (nameParts.length >= 2) {
          setFirstName(nameParts[0])
          setLastName(nameParts.slice(1).join(' '))
          nameFound = true
        } else if (nameParts.length === 1) {
          setFirstName(fullName)
          nameFound = true
        }
      }
    }

    // Extract Email
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
    const emailMatch = text.match(emailPattern)
    if (emailMatch) {
      setEmail(emailMatch[1])
    }

    // Extract Mobile Number - Enhanced for international formats
    // Look for patterns like "971-52-5394394" or "+971 52 5394394"
    let mobileFound = false

    for (const rawLine of lines) {
      const line = cleanOcrLine(rawLine)

      // Pattern where number appears before Arabic label: "0504202821 الهاتف المتحرك"
      const leadingNumberMobile = line.match(/(\d[\d\s\-()]{7,}\d)\s*(?:الهاتف\s*المتحرك|هاتف\s*متحرك|mobile\s*no|mobile|phone|tel|contact)/i)
      if (leadingNumberMobile?.[1]) {
        const mobile = leadingNumberMobile[1].replace(/[^\d+]/g, "")
        if (mobile.length >= 9) {
          if (mobile.startsWith("+")) {
            const parts = mobile.match(/(\+\d{1,4})(\d+)/)
            if (parts) {
              setCountryCode(parts[1])
              setContactNo(parts[2])
              countryCodeSetFromMobile = true
              mobileFound = true
              break
            }
          } else if (mobile.startsWith("971") || mobile.startsWith("966") || mobile.startsWith("965")) {
            setCountryCode("+" + mobile.substring(0, 3))
            setContactNo(mobile.substring(3))
            countryCodeSetFromMobile = true
            mobileFound = true
            break
          } else {
            setContactNo(mobile)
            mobileFound = true
            break
          }
        }
      }

      const labeledMobile = line.match(/(?:الهاتف\s*المتحرك|mobile\s*no|mobile|phone|tel|contact)\s*[:\-]?\s*([+]?\d[\d\s\-()]{7,}\d)/i)
      if (labeledMobile?.[1]) {
        const mobile = labeledMobile[1].replace(/[^\d+]/g, "")
        if (mobile.length >= 9) {
          if (mobile.startsWith("+")) {
            const parts = mobile.match(/(\+\d{1,4})(\d+)/)
            if (parts) {
              setCountryCode(parts[1])
              setContactNo(parts[2])
              countryCodeSetFromMobile = true
              mobileFound = true
              break
            }
          } else if (mobile.startsWith("971") || mobile.startsWith("966") || mobile.startsWith("965")) {
            setCountryCode("+" + mobile.substring(0, 3))
            setContactNo(mobile.substring(3))
            countryCodeSetFromMobile = true
            mobileFound = true
            break
          } else {
            setContactNo(mobile)
            mobileFound = true
            break
          }
        }
      }
    }
    
    // First try to find mobile with label
    const mobilePattern = /(?:mobile[\s]+no|mobile|phone|tel|contact|هاتف\s*متحرك)[:\s]*([+]?[\d\s()-]+)/i
    const mobileMatch = text.match(mobilePattern)
    if (mobileMatch && mobileMatch[1]) {
      const mobile = mobileMatch[1].replace(/[^\d+]/g, '')
      if (mobile.length >= 9) { // Ensure we have a reasonable phone number
        // Extract country code if present
        if (mobile.startsWith('+')) {
          const parts = mobile.match(/(\+\d{1,4})(\d+)/)
          if (parts) {
            setCountryCode(parts[1])
            setContactNo(parts[2]) // Don't format yet, keep full number
            countryCodeSetFromMobile = true
            mobileFound = true
          }
        } else if (mobile.startsWith('971') || mobile.startsWith('966') || mobile.startsWith('965')) {
          // Handle common Gulf country codes without +
          setCountryCode('+' + mobile.substring(0, 3))
          setContactNo(mobile.substring(3)) // Keep full number without formatting
          countryCodeSetFromMobile = true
          mobileFound = true
        } else {
          setContactNo(mobile)
          mobileFound = true
        }
      }
    }
    
    // If not found, try to find any phone number pattern (international format)
    if (!mobileFound) {
      const phonePattern = /(\d{3}[-\s]?\d{2}[-\s]?\d{7,8}|\+?\d{1,4}[\s-]?\d{2}[\s-]?\d{7,8})/
      const phoneMatch = text.match(phonePattern)
      if (phoneMatch) {
        const phone = phoneMatch[0].replace(/[^\d+]/g, '')
        const digitCount = phone.replace(/\D/g, '').length
        // Avoid picking long ID/passport numbers as phone fallback.
        if (digitCount > 12) {
          // Skip invalid generic fallback numbers.
        } else if (phone.length >= 9) {
          if (phone.startsWith('+')) {
            const parts = phone.match(/(\+\d{1,4})(\d+)/)
            if (parts) {
              setCountryCode(parts[1])
              setContactNo(parts[2])
              countryCodeSetFromMobile = true
              mobileFound = true
            }
          } else if (phone.startsWith('971') || phone.startsWith('966') || phone.startsWith('965')) {
            setCountryCode('+' + phone.substring(0, 3))
            setContactNo(phone.substring(3))
            countryCodeSetFromMobile = true
            mobileFound = true
          } else {
            setContactNo(phone)
            mobileFound = true
          }
        }
      }
    }

    // If number was extracted without explicit code, default to UAE as requested.
    if (mobileFound && !countryCodeSetFromMobile && !String(countryCode || "").trim()) {
      setCountryCode("+971")
    }

    // Extract Address - Keep Arabic text as-is
    // Primary target: line right below email and before remarks section.
    let addressFound = false

    const addressFromLabel = extractAddressFromAddressLabel(lines)
    if (addressFromLabel) {
      setAddress(addressFromLabel)
      addressFound = true
    }

    const addressBelowEmail = !addressFound ? await extractAddressBelowEmail(lines) : ""
    if (addressBelowEmail) {
      setAddress(addressBelowEmail)
      addressFound = true
    }

    const sectionText = text.replace(/\r/g, '')
    const emailSectionMatch = !addressFound ? sectionText.match(/(?:email|البريد\s*الإلكتروني)[\s\S]{0,120}?@[\w.-]+\.[A-Za-z]{2,}[\s\S]{0,220}/i) : null
    if (emailSectionMatch) {
      const emailSection = emailSectionMatch[0]
      const sectionLines = emailSection
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const candidate = sectionLines.find((line) => {
        const isEmailLine = /@[\w.-]+\.[A-Za-z]{2,}/i.test(line)
        const isLabel = /^(email|البريد\s*الإلكتروني|address|العنوان|parcel\s*id|p\.?o\.?\s*box)$/i.test(line)
        const isRemarks = /(remarks|ملاحظات)/i.test(line)
        const hasAddressSignal = looksLikeAddressLine(line)
        return !isEmailLine && !isLabel && !isRemarks && hasAddressSignal
      })

      if (candidate) {
        setAddress(normalizeExtractedAddress(candidate))
        addressFound = true
      }
    }

    if (!addressFound) {
      const topBlockAddress = await extractTopBlockAddress(lines)
      if (topBlockAddress) {
        setAddress(topBlockAddress)
        addressFound = true
      }
    }

    // Fallback 1: line immediately after any email line
    if (!addressFound) {
      const emailIndex = lines.findIndex((line) => /@[\w.-]+\.[A-Za-z]{2,}/i.test(line))
      if (emailIndex !== -1) {
        for (let i = emailIndex + 1; i < Math.min(emailIndex + 6, lines.length); i++) {
          const line = lines[i]
          if (/(remarks|ملاحظات)/i.test(line)) break
          if (line.length < 4) continue

          const isLabelOnly = /^(address|العنوان|parcel\s*id|p\.?o\.?\s*box)$/i.test(line)
          const hasAddressSignal = looksLikeAddressLine(line)
          if (!isLabelOnly && hasAddressSignal) {
            setAddress(normalizeExtractedAddress(line.trim()))
            addressFound = true
            break
          }
        }
      }
    }

    // Fallback 2: explicit address label extraction
    if (!addressFound) {
      const addressPattern = /(?:address|addr|العنوان)[:\s\/]+([\w\s,.-\u0600-\u06FF]+?)(?=\n(?:phone|mobile|email|p\.o|fax|remarks|ملاحظات)|$)/i
      const addressMatch = text.match(addressPattern)
      if (addressMatch && addressMatch[1]) {
        const addr = addressMatch[1].trim()
        if (addr) {
          setAddress(normalizeExtractedAddress(addr))
          addressFound = true
        }
      }
    }

    // Fallback 3: standalone address-like line
    if (!addressFound) {
      const addressLinePattern = /[\d-]+[\u0600-\u06FF\w\s,.-]*(?:مكتب|ملك|مؤسسة|مبنى|برج|مركز|تجاري|العقارية)[\u0600-\u06FF\w\s,.-]*/i
      const foundLine = lines.find((line) => addressLinePattern.test(line))
      if (foundLine) {
        setAddress(normalizeExtractedAddress(foundLine.trim()))
        addressFound = true
      }
    }

    if (!addressFound) {
      const licenseAddressLine = lines.find((line) => /(address|العنوان)/i.test(line) && looksLikeAddressLine(line))
      if (licenseAddressLine) {
        setAddress(normalizeExtractedAddress(licenseAddressLine))
        addressFound = true
      }
    }
    
    // Don't auto-populate city - let user enter manually
    // City extraction removed as per user request
    
    // Don't auto-populate state - let user enter manually
    // State extraction removed as per user request
    
    // Don't auto-populate country - let user enter manually  
    // Country extraction removed as per user request

    // Extract Nationality - Enhanced for bilingual documents with translation
    // Multiple patterns to handle different formats
    let nationalityFound = false
    if (roleNationality) {
      nationalityFound = true
      setNationality(roleNationality)
    }

    if (!nationalityFound && nationalityValue) {
      nationalityFound = true
      setNationality(nationalityValue)
    }

    if (idValue) {
      setIdNo(idValue)
      if (!idType) {
        setIdType("Passport")
      }
    }

    if (!nationalityFound && ownerNationality) {
      nationalityFound = true
      setNationality(ownerNationality)

      const matchingCountry = countries.find(c => 
        c.value.toLowerCase() === ownerNationality.toLowerCase() || 
        c.label.toLowerCase() === ownerNationality.toLowerCase()
      )
      if (matchingCountry && matchingCountry.phoneCode && !countryCodeSetFromMobile) {
        setCountryCode(matchingCountry.phoneCode)
      }
    }
    
    // Pattern 1: Direct nationality label
    const nationalityPattern1 = /(?:nationality|citizen|الجنسية)[:\s\/]+([\w\s\u0600-\u06FF]+?)(?=\n|\s{2,}|role|صفة|shares|owner|name|no\.|$)/i
    const nationalityMatch1 = text.match(nationalityPattern1)
    
    // Pattern 2: Look in table format (common in commercial licenses)
    const nationalityPattern2 = /([\w\s]+)\s*\/\s*[\u0600-\u06FF]+\s+(?:shares|owner|manager|100\.00%)/i
    const nationalityMatch2 = text.match(nationalityPattern2)
    
    // Pattern 3: Look for country names directly (Lebanon, UAE, etc.)
    const countryPattern = /\b(Lebanon|United Arab Emirates|UAE|Saudi Arabia|Egypt|Jordan|Kuwait|Qatar|Bahrain|Oman|Syria|Iraq|Yemen|Palestine|Morocco|Algeria|Tunisia|Libya|Sudan|India|Pakistan|Bangladesh|Philippines|Indonesia)\b/i
    const countryMatch = text.match(countryPattern)
    
    let nat = ''
    
    if (nationalityMatch1 && nationalityMatch1[1]) {
      nat = nationalityMatch1[1].trim()
      nationalityFound = true
    } else if (nationalityMatch2 && nationalityMatch2[1]) {
      nat = nationalityMatch2[1].trim()
      nationalityFound = true
    } else if (countryMatch && countryMatch[1]) {
      nat = countryMatch[1].trim()
      nationalityFound = true
    }
    
    if (nat && !nationalityFound) {
      // Translate if Arabic
      nat = await translateArabicToEnglish(nat)
      
      // Clean up common patterns (remove Arabic text after /)
      nat = getEnglishCountry(nat).trim()
      
      if (nat) {
        setNationality(nat)
        
        // Auto-set country code based on nationality ONLY if not already set from mobile number
        // This prevents overwriting the country code extracted from the phone number
        const matchingCountry = countries.find(c => 
          c.value.toLowerCase() === nat.toLowerCase() || 
          c.label.toLowerCase() === nat.toLowerCase() ||
          c.value.toLowerCase().includes(nat.toLowerCase()) ||
          nat.toLowerCase().includes(c.value.toLowerCase())
        )
        // Only set country code if it wasn't already set from mobile extraction
        if (matchingCountry && matchingCountry.phoneCode && !countryCodeSetFromMobile) {
          setCountryCode(matchingCountry.phoneCode)
        }
      }
    }

    // Don't extract ID details from OCR - removed as per user request
    // Users should manually enter ID Type, ID No, ID Issue Date, and ID Expiry Date
  }

  const handleIdCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIdCardFile(file)
      processOCR(file)
    }
  }

  const handleSingleSelect = (setter: (v: string) => void) => (value: string | string[]) => {
    if (typeof value === "string") setter(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Validation
    const requiredFields = {
      'First Name': firstName,
      'Last Name': lastName,
      'Email': email,
      'Date of Birth': dob,
      'Address': address,
      'City': city,
      'State': state,
      'Country': country,
      'Nationality': nationality,
      'Country Code': countryCode,
      'Contact No': contactNo,
      'Occupation': occupation,
      'Source of Income': sourceIncome,
      'ID Type': idType,
      'ID No': idNo,
      'ID Issue Date': idIssueDate,
      'ID Expiry Date': idExpiryDate,
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field)

    if (emptyFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in: ${emptyFields.join(', ')}`,
      })
      setSubmitting(false)
      return
    }

    const payload = {
      customer_type: "individual",
      onboarding_type: "quick_single",
      screening_fuzziness: "OFF",
      individual_details: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        dob,
        residential_status: residentialStatus,
        address,
        city,
        state,
        country,
        nationality,
        country_code: countryCode,
        contact_no: contactNo,
        occupation,
        source_of_income: sourceIncome,
        id_type: idType,
        id_no: idNo,
        id_issue_date: idIssueDate,
        id_expiry_date: idExpiryDate,
      },
    }

    try {
      const formData = new FormData()
      formData.append("data", JSON.stringify(payload))
      if (selectedFile) {
        formData.append("documents[]", selectedFile)
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json().catch(async () => ({ message: await res.text() }))
      console.log("[Quick Onboarding] API response:", { status: res.status, data })

      if (res.ok) {
        const msg = data?.message || "Quick onboarding submitted successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        const details = data?.errors
          ? Object.values(data.errors as Record<string, string[]>)
            .flat()
            .join("; ")
          : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({
          title: "Onboarding failed",
          description: errText,
        })
      }
    } catch (err: any) {
      toast({
        title: "Onboarding failed",
        description: err?.message || "Network error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
          </div>
          <p className="absolute top-full mt-4 text-sm text-muted-foreground animate-pulse whitespace-nowrap">Loading form data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      {/* Choose Entry Type */}
      <Card className={cn(CARD_STYLE, "mb-8")}>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2 text-foreground">Choose Entry Type</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Select <span className="font-semibold text-foreground">Single</span> for individual onboarding or <span className="font-semibold text-foreground">Batch</span> to start a bulk operation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => setEntryType("single")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden bg-background/50",
                entryType === "single"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-border/50 hover:border-primary/30 hover:bg-white/50"
              )}
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors",
                  entryType === "single" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-base mb-1 text-foreground">Individual Single Entry</div>
                  <div className="text-sm text-muted-foreground">Onboard single customer or sole proprietor entries.</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setEntryType("batch")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden bg-background/50",
                entryType === "batch"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-border/50 hover:border-primary/30 hover:bg-white/50",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              )}
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors",
                  entryType === "batch" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-base mb-1 text-foreground">Individual Batch Entry (Coming Soon)</div>
                  <div className="text-sm text-muted-foreground">Onboard batch entries of customers or entities.</div>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Single Entry Form */}
      {entryType === "single" && (
        <div className="space-y-6">
          {/* OCR Upload Section */}
          <Card className={CARD_STYLE}>
            <CardContent className="p-8">
              <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ScanLine className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-semibold tracking-tight text-foreground">Smart ID Card Scanner (OCR)</h4>
              </div>

              <div className="mb-4 p-4 border border-primary/20 rounded-xl bg-primary/5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Upload your ID card for automatic data extraction</p>
                    <p>Our OCR technology will automatically extract your personal information and populate the form below. Please verify the extracted data for accuracy.</p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center",
                  ocrProcessing 
                    ? "border-primary/50 bg-primary/10 cursor-not-allowed" 
                    : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (!ocrProcessing) {
                    handleIdCardDrop(e)
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processOCR(e.dataTransfer.files[0])
                    }
                  }
                }}
                onClick={() => {
                  if (!ocrProcessing) {
                    document.getElementById("idCardUpload")?.click()
                  }
                }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:scale-105">
                  {ocrProcessing ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                    <ScanLine className="h-8 w-8 text-primary" />
                  )}
                </div>
                
                {ocrProcessing ? (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-foreground">Processing ID Card...</h5>
                    <div className="max-w-xs mx-auto">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300 rounded-full"
                          style={{ width: `${ocrProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{ocrProgress}% Complete</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h5 className="mb-1 font-semibold text-foreground">Click to Upload ID Card</h5>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, PDF (Max 10MB)</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {idCardFile ? `Selected: ${idCardFile.name}` : "Drag & drop your ID card here, or click to select"}
                    </p>
                  </>
                )}

                <input
                  type="file"
                  className="hidden"
                  id="idCardUpload"
                  accept="image/*,.pdf"
                  onChange={handleIdCardFileChange}
                  disabled={ocrProcessing}
                />
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className={CARD_STYLE}>
              <CardContent className="space-y-10 p-8">
                <section>
                  <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">Personal Information</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="firstName" text="First Name" className={FIELD_LABEL_CLASS} />
                      <input
                        id="firstName"
                        placeholder="Enter first name"
                        className={FIELD_CLASS}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="lastName" text="Last Name" className={FIELD_LABEL_CLASS} />
                      <input
                        id="lastName"
                        placeholder="Enter last name"
                        className={FIELD_CLASS}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="email" text="Email" className={FIELD_LABEL_CLASS} />
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        className={FIELD_CLASS}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="dob" text="Date of Birth" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="dob"
                        type="date"
                        className={FIELD_CLASS}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel text="Residential Status" className={FIELD_LABEL_CLASS} />
                      <div className="mt-2 flex items-center gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="residentialStatus"
                            value="resident"
                            checked={residentialStatus === "resident"}
                            onChange={() => setResidentialStatus("resident")}
                            className="accent-primary"
                          />
                          <span className="text-sm font-medium">Resident</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="residentialStatus"
                            value="non-resident"
                            checked={residentialStatus === "non-resident"}
                            onChange={() => setResidentialStatus("non-resident")}
                            className="accent-primary"
                          />
                          <span className="text-sm font-medium">Non-Resident</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="address" text="Address" className={FIELD_LABEL_CLASS} />
                      <input
                        id="address"
                        placeholder="Enter address"
                        className={FIELD_CLASS}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="city" text="City" className={FIELD_LABEL_CLASS} />
                      <input
                        id="city"
                        placeholder="Enter city"
                        className={FIELD_CLASS}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="state" text="State" className={FIELD_LABEL_CLASS} />
                      <input
                        id="state"
                        placeholder="Enter state/emirate"
                        className={FIELD_CLASS}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="country" text="Country" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={countries}
                        value={country}
                        onValueChange={handleSingleSelect(setCountry)}
                        placeholder="Select a country"
                        searchPlaceholder="Search country..."
                        className={FIELD_CLASS}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="nationality" text="Nationality" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={countries}
                        value={nationality}
                        onValueChange={handleSingleSelect(setNationality)}
                        placeholder="Select a nationality"
                        searchPlaceholder="Search nationality..."
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="countryCode" text="Country Code" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={countryCodes}
                        value={countryCode}
                        onValueChange={handleSingleSelect(setCountryCode)}
                        placeholder="Select"
                        searchPlaceholder="Search code..."
                        className={FIELD_CLASS}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="contactNo" text="Contact No" className={FIELD_LABEL_CLASS} />
                      <input
                        id="contactNo"
                        placeholder="Enter contact number"
                        className={FIELD_CLASS}
                        value={contactNo}
                        onChange={(e) => setContactNo(formatContactNumber(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="occupation" text="Occupation" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={occupations}
                        value={occupation}
                        onValueChange={handleSingleSelect(setOccupation)}
                        placeholder="Select an occupation"
                        searchPlaceholder="Search occupation..."
                        className={FIELD_CLASS}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="sourceIncome" text="Source of Income" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={sourceOfIncome}
                        value={sourceIncome}
                        onValueChange={handleSingleSelect(setSourceIncome)}
                        placeholder="Select a source"
                        searchPlaceholder="Search source..."
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-border/50 pt-10">
                  <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">Identification Details</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idType" text="ID Type" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={idTypes}
                        value={idType}
                        onValueChange={handleSingleSelect(setIdType)}
                        placeholder="Select an ID type"
                        searchPlaceholder="Search type..."
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idNo" text="ID No" className={FIELD_LABEL_CLASS} />
                      <input
                        id="idNo"
                        placeholder="Enter ID number"
                        className={FIELD_CLASS}
                        value={idNo}
                        onChange={(e) => setIdNo(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idIssued" text="ID Issued Date" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="idIssued"
                        type="date"
                        className={FIELD_CLASS}
                        value={idIssueDate}
                        onChange={(e) => setIdIssueDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idExpiry" text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="idExpiry"
                        type="date"
                        className={FIELD_CLASS}
                        value={idExpiryDate}
                        onChange={(e) => setIdExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-border/50 pt-10">
                  <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Upload className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">Upload Documents</h4>
                  </div>

                  <div
                    className="group cursor-pointer rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-10 text-center transition-colors hover:bg-primary/10"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileUpload")?.click()}
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:scale-105">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h5 className="mb-1 font-semibold text-foreground">Click to Upload Documents</h5>
                    <p className="text-sm text-muted-foreground">Max 5 files, each up to 5MB (Images, PDFs, Docs)</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Drag & drop files here, or click to select"}
                    </p>

                    <input
                      type="file"
                      className="hidden"
                      id="fileUpload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                    />
                  </div>
                </section>
              </CardContent>
            </Card>

            <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-6 z-10 flex justify-end">
              <Button
                className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div >
      )
      }

      {/* Batch Entry Form */}
      {entryType === "batch" && (
        <div className="space-y-6">
          <Card className={CARD_STYLE}>
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-lg text-foreground tracking-tight">Batch Onboarding</h3>
              </div>
              <Button variant="outline" className="mb-8 border-primary/20 hover:bg-primary/5 text-primary hover:text-primary bg-transparent h-10 px-4" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Excel Template
              </Button>

              {/* Instructions */}
              <div className="mb-8 p-6 border border-border/50 rounded-2xl bg-primary/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-foreground tracking-tight">Instructions</h4>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">First Name:</strong> Required, text (e.g., John).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Last Name:</strong> Required, text (e.g., Doe).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Email:</strong> Required, text (e.g., john@example.com).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Date of Birth:</strong> Required, format: yyyy-mm-dd.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Residential Status:</strong> "Resident" or "Non-Resident".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Address:</strong> Required, text.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Nationality:</strong> Required, valid country name.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Country Code:</strong> Required, valid phone country code.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Contact Number:</strong> Required, numeric only.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">ID Type:</strong> Required, valid ID type.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">ID Number:</strong> Required, text format matching type.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">ID Issued/Expiry:</strong> Required, format: yyyy-mm-dd.</span>
                  </li>
                </ul>
              </div>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-12 text-center cursor-pointer group mb-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("batchFileUpload")?.click()}
              >
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h5 className="font-semibold text-foreground mb-1">Click to Upload Batch File</h5>
                <p className="text-sm text-muted-foreground">Drag & drop a .xlsx file here, or click to select</p>
                <input type="file" className="hidden" id="batchFileUpload" accept=".xlsx" onChange={handleFileChange} />
                {selectedFile && <p className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">Selected: {selectedFile.name}</p>}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button
                  className="sm:w-auto min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  type="button"
                  onClick={handleBatchUpload}
                  disabled={batchSubmitting}
                >
                  {batchSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
