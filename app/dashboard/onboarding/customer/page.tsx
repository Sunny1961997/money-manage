"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  User,
  Building2,
  MapPin,
  Phone,
  Globe,
  Award as IdCard,
  Briefcase,
  DollarSign,
  FileText,
  Upload,
  UsersIcon,
  Plus,
  Trash2,
  FileCheck,
} from "lucide-react"

type CustomerType = "individual" | "corporate"

const countries = [
  { value: "india", label: "India" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
]

const countryCodes = [
  { value: "+91", label: "+91 (India)" },
  { value: "+971", label: "+971 (UAE)" },
  { value: "+1", label: "+1 (USA)" },
  { value: "+44", label: "+44 (UK)" },
]

const occupations = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self Employed" },
  { value: "business", label: "Business" },
  { value: "retired", label: "Retired" },
]

const idTypes = [
  { value: "passport", label: "Passport" },
  { value: "eid", label: "Emirates ID" },
  { value: "license", label: "Driving License" },
  { value: "national-id", label: "National ID" },
]

export default function CustomerOnboardingPage() {
  const [customerType, setCustomerType] = useState<CustomerType>("individual")

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="w-5 h-5" />
          <h1 className="text-2xl font-semibold">Customer Onboarding</h1>
        </div>
      </div>

      {/* Choose Customer Type */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center mb-2">Choose Customer Type</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Selected: {customerType === "individual" ? "Individual" : "Corporate"}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => setCustomerType("individual")}
            className={`p-6 rounded-lg border-2 transition-all ${
              customerType === "individual" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <User className="w-6 h-6 mb-2" />
            <div className="font-semibold">Individual</div>
            <div className="text-sm text-muted-foreground">For personal customers or sole proprietors.</div>
          </button>

          <button
            onClick={() => setCustomerType("corporate")}
            className={`p-6 rounded-lg border-2 transition-all ${
              customerType === "corporate" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Building2 className="w-6 h-6 mb-2" />
            <div className="font-semibold">Corporate</div>
            <div className="text-sm text-muted-foreground">For businesses, organizations, or entities.</div>
          </button>
        </div>
      </div>

      {/* Forms */}
      {customerType === "individual" ? (
        <IndividualForm countries={countries} countryCodes={countryCodes} occupations={occupations} idTypes={idTypes} />
      ) : (
        <CorporateForm countries={countries} countryCodes={countryCodes} occupations={occupations} idTypes={idTypes} />
      )}
    </div>
  )
}

function IndividualForm({
  countries,
  countryCodes,
  occupations,
  idTypes,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
}) {
  const [nationality, setNationality] = useState("")
  const [country, setCountry] = useState("")
  const [countryCode, setCountryCode] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Individual</span>
        <h3 className="text-lg font-semibold">New Individual Registration</h3>
      </div>

      {/* Personal Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Personal Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name *</Label>
            <Input placeholder="Enter first name" />
          </div>
          <div className="space-y-2">
            <Label>Last Name *</Label>
            <Input placeholder="Enter last name" />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
          <div className="space-y-2">
            <Label>Residential Status *</Label>
            <RadioGroup defaultValue="resident" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resident" id="resident" />
                <Label htmlFor="resident">Resident</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-resident" id="non-resident" />
                <Label htmlFor="non-resident">Non-Resident</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Address *</Label>
            <Input placeholder="Enter address" />
          </div>
          <div className="space-y-2">
            <Label>Nationality *</Label>
            <Combobox
              options={countries}
              value={nationality}
              onValueChange={setNationality}
              placeholder="Select a nationality"
              searchPlaceholder="Search nationality..."
            />
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Address Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Address *</Label>
            <Input placeholder="Enter address" />
          </div>
          <div className="space-y-2">
            <Label>City *</Label>
            <Input placeholder="Enter city" />
          </div>
          <div className="space-y-2">
            <Label>Country *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>Nationality *</Label>
            <Combobox
              options={countries}
              value={nationality}
              onValueChange={setNationality}
              placeholder="Select a nationality"
              searchPlaceholder="Search nationality..."
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Contact Information</h4>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Country Code *</Label>
            <Combobox
              options={countryCodes}
              value={countryCode}
              onValueChange={setCountryCode}
              placeholder="Select"
              searchPlaceholder="Search code..."
            />
          </div>
          <div className="space-y-2">
            <Label>Contact No *</Label>
            <Input placeholder="Enter contact number" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Additional Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Place of Birth *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>Country of Residence *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Dual Nationality *</Label>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="dual-yes" />
                <Label htmlFor="dual-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="dual-no" />
                <Label htmlFor="dual-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Is Customer Facing any adverse event? *</Label>
            <p className="text-xs text-blue-600 mb-2">We don't Check adverse news feed</p>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="adverse-yes" />
                <Label htmlFor="adverse-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="adverse-no" />
                <Label htmlFor="adverse-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Gender and PEP Status */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Gender and PEP Status</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gender *</Label>
            <RadioGroup defaultValue="male" className="flex flex-col gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Politically Exposed Person (PEP)? *</Label>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pep-yes" />
                <Label htmlFor="pep-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pep-no" />
                <Label htmlFor="pep-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Occupation and Income */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Occupation and Income</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Occupation *</Label>
            <Combobox
              options={occupations}
              value=""
              onValueChange={() => {}}
              placeholder="Select an occupation"
              searchPlaceholder="Search occupation..."
            />
          </div>
          <div className="space-y-2">
            <Label>Source of Income *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a source"
              searchPlaceholder="Search source..."
            />
          </div>
        </div>
      </Card>

      {/* Financial Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Financial Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Purpose *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a purpose"
              searchPlaceholder="Search purpose..."
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Mode *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a payment mode"
              searchPlaceholder="Search mode..."
            />
          </div>
        </div>
      </Card>

      {/* Transactions and ID Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Transactions and ID Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Type *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select product type"
              searchPlaceholder="Search type..."
            />
          </div>
          <div className="space-y-2">
            <Label>Mode of Approach *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Walk-In Customer"
              searchPlaceholder="Search approach..."
            />
          </div>
          <div className="space-y-2">
            <Label>Expected No of Transactions</Label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Expected Volume</Label>
            <Input type="number" placeholder="0" />
          </div>
        </div>
      </Card>

      {/* Identification Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <IdCard className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Identification Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ID Type *</Label>
            <Combobox
              options={idTypes}
              value=""
              onValueChange={() => {}}
              placeholder="Select an ID type"
              searchPlaceholder="Search type..."
            />
          </div>
          <div className="space-y-2">
            <Label>ID No *</Label>
            <Input placeholder="Enter ID number" />
          </div>
          <div className="space-y-2">
            <Label>ID Issued By *</Label>
            <Input placeholder="Enter issuing authority" />
          </div>
          <div className="space-y-2">
            <Label>ID Issued At *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>ID Issued Date *</Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
          <div className="space-y-2">
            <Label>ID Expiry Date *</Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
        </div>
      </Card>

      {/* Upload Documents */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Upload Documents</h4>
        </div>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-blue-600 mb-1">Add Documents</p>
          <p className="text-xs text-muted-foreground">Max 5 files, each up to 5MB (Images, PDFs, Docs)</p>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Additional Information</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Screening Fuzziness *</Label>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Level II"
              searchPlaceholder="Search fuzziness..."
            />
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Enter any remarks" rows={3} />
          </div>
        </div>
      </Card>

      <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit Registration</Button>
    </div>
  )
}

function CorporateForm({
  countries,
  countryCodes,
  occupations,
  idTypes,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
}) {
  const [ubos, setUbos] = useState([{ id: 1 }])

  const addUBO = () => {
    setUbos([...ubos, { id: ubos.length + 1 }])
  }

  const removeUBO = (id: number) => {
    setUbos(ubos.filter((ubo) => ubo.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Corporate</span>
        <h3 className="text-lg font-semibold">New Corporate Registration</h3>
      </div>

      {/* Company Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Company Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input placeholder="Enter the Company Name" />
          </div>
          <div className="space-y-2">
            <Label>Company Address *</Label>
            <Input placeholder="Enter the Company address" />
          </div>
          <div className="space-y-2">
            <Label>City *</Label>
            <Input placeholder="Enter the city" />
          </div>
          <div className="space-y-2">
            <Label>Country of Incorporation *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>PO Box No *</Label>
            <Input placeholder="Enter the PO Box No" />
          </div>
          <div className="space-y-2">
            <Label>Customer Type *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select Customer Type"
              searchPlaceholder="Search type..."
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Contact Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Country Code *</Label>
              <Combobox
                options={countryCodes}
                value=""
                onValueChange={() => {}}
                placeholder="Select"
                searchPlaceholder="Search code..."
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Office No</Label>
              <Input placeholder="Enter the Contact Office No" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Country Code *</Label>
              <Combobox
                options={countryCodes}
                value=""
                onValueChange={() => {}}
                placeholder="Select"
                searchPlaceholder="Search code..."
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Mobile No *</Label>
              <Input placeholder="Enter the Contact Mobile No" />
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email (abc@dom.com)" />
          </div>
        </div>
      </Card>

      {/* Identity Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <IdCard className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Identity Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Trade License/CR No *</Label>
            <Input placeholder="Enter Trade License/CR No" />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Issued At *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Issued By *</Label>
            <Input placeholder="Select issuing authority" />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Issued Date *</Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Expiry Date</Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
          <div className="space-y-2">
            <Label>VAT Registration Number</Label>
            <Input placeholder="Enter VAT Registration Number" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Tenancy Contract Expiry Date</Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
        </div>
      </Card>

      {/* Operations Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Operations Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Entity Type *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select entity type"
              searchPlaceholder="Search type..."
            />
          </div>
          <div className="space-y-2">
            <Label>Countries of Operation *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>Business Activity *</Label>
            <Input placeholder="Select business activity" />
          </div>
          <div className="space-y-2">
            <Label>Is entity dealing with Import/Export? *</Label>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="import-yes" />
                <Label htmlFor="import-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="import-no" />
                <Label htmlFor="import-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Any other major countries/region *</Label>
            <Input placeholder="Enter bank name (max 50 characters)" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Account Holding Bank Name *</Label>
            <Input placeholder="Enter bank name (max 50 characters)" />
          </div>
        </div>
      </Card>

      {/* Product Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Product Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Type *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select Product Type"
              searchPlaceholder="Search type..."
            />
          </div>
          <div className="space-y-2">
            <Label>Product Source *</Label>
            <Input placeholder="Select product source" />
          </div>
          <div className="space-y-2">
            <Label>Payment Mode *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select payment mode"
              searchPlaceholder="Search mode..."
            />
          </div>
          <div className="space-y-2">
            <Label>Delivery Channel *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Select delivery channel"
              searchPlaceholder="Search channel..."
            />
          </div>
          <div className="space-y-2">
            <Label>Expected No of Transactions</Label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Expected Volume</Label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Deal with Goods? *</Label>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="goods-yes" />
                <Label htmlFor="goods-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="goods-no" />
                <Label htmlFor="goods-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* AML Compliance Questionnaire */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">AML Compliance Questionnaire</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>KYC documents collected with form *</Label>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="kyc-yes" />
                <Label htmlFor="kyc-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="kyc-no" />
                <Label htmlFor="kyc-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Is entity registered in GOAML *</Label>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="goaml-yes" />
                <Label htmlFor="goaml-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="goaml-no" />
                <Label htmlFor="goaml-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Is Entity Having Material Match *</Label>
            <p className="text-xs text-blue-600 mb-2">We don't Check adverse news feed</p>
            <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="material-yes" />
                <Label htmlFor="material-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="material-no" />
                <Label htmlFor="material-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Partner/Representative/Authorized Person Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Partner/Representative/Authorized Person Details</h4>
        </div>
        {ubos.map((ubo, index) => (
          <div key={ubo.id} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                UBO {index + 1}
              </h5>
              {ubos.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeUBO(ubo.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <RadioGroup defaultValue="individual" className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id={`type-individual-${ubo.id}`} />
                    <Label htmlFor={`type-individual-${ubo.id}`}>Individual</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input placeholder="Enter Name" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Previously Exposed Person (PEP)? *</Label>
                <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`pep-yes-${ubo.id}`} />
                    <Label htmlFor={`pep-yes-${ubo.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`pep-no-${ubo.id}`} />
                    <Label htmlFor={`pep-no-${ubo.id}`}>No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>ID Type *</Label>
                <Combobox
                  options={idTypes}
                  value=""
                  onValueChange={() => {}}
                  placeholder="Passport"
                  searchPlaceholder="Search type..."
                />
              </div>
              <div className="space-y-2">
                <Label>ID No *</Label>
                <Input placeholder="Enter ID License No" />
              </div>
              <div className="space-y-2">
                <Label>ID Issued By *</Label>
                <Combobox
                  options={countries}
                  value=""
                  onValueChange={() => {}}
                  placeholder="Select Country"
                  searchPlaceholder="Search country..."
                />
              </div>
              <div className="space-y-2">
                <Label>ID Issued At *</Label>
                <Input placeholder="Enter ID Issued No" />
              </div>
              <div className="space-y-2">
                <Label>ID Expiry Date *</Label>
                <Input type="date" placeholder="mm/dd/yyyy" />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" placeholder="mm/dd/yyyy" />
              </div>
              <div className="space-y-2">
                <Label>Share *</Label>
                <Combobox
                  options={countries}
                  value=""
                  onValueChange={() => {}}
                  placeholder="UBO"
                  searchPlaceholder="Search share..."
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage of Share *</Label>
                <Input placeholder="Enter Percentage (0-100)" />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addUBO} className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Representative
        </Button>
      </Card>

      {/* Upload Documents */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Upload Documents</h4>
        </div>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-blue-600 mb-1">Add Documents</p>
          <p className="text-xs text-muted-foreground">Max 5 files, each up to 5MB (Images, PDFs, Docs)</p>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Additional Information</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Screening Fuzziness *</Label>
            <Combobox
              options={countries}
              value=""
              onValueChange={() => {}}
              placeholder="Level II"
              searchPlaceholder="Search fuzziness..."
            />
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Enter any remarks" rows={3} />
          </div>
        </div>
      </Card>

      <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit Registration</Button>
    </div>
  )
}
