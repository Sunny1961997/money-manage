"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, Users, Building2, Globe, Calendar, Ship } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Combobox } from "@/components/ui/combobox"

type TabKey = "individual" | "entity" | "vessel"
type Country = { id: number; name: string; sortname?: string; phoneCode?: string; currency?: string }
type ComboboxOption = { value: string; label: string }
function toMessage(e: unknown) {
  if (e instanceof Error) return e.message
  return typeof e === "string" ? e : "Unknown error"
}

function clampPercent(value: string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return ""
  return String(Math.min(100, Math.max(10, n)))
}

export default function QuickScreeningPage() {
  const { toast } = useToast()

  const [tab, setTab] = React.useState<TabKey>("individual")
  const [countries, setCountries] = React.useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = React.useState(false)

  // Individual
  const [iName, setIName] = React.useState("")
  const [iDob, setIDob] = React.useState("")
  const [iGender, setIGender] = React.useState("")
  const [iNationality, setINationality] = React.useState("")
  const [iConfidence, setIConfidence] = React.useState("")

  // Non-individual (entity)
  const [eName, setEName] = React.useState("")
  const [eCountry, setECountry] = React.useState("")
  const [eAddress, setEAddress] = React.useState("")
  const [eConfidence, setEConfidence] = React.useState("")

  // Vessel
  const [vName, setVName] = React.useState("")
  const [vImo, setVImo] = React.useState("")
  const [vCountry, setVCountry] = React.useState("")
  const [vConfidence, setVConfidence] = React.useState("")

  const [searching, setSearching] = React.useState(false)
  const [results, setResults] = React.useState<any>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      setCountriesLoading(true)
      try {
        const res = await fetch("/api/countries", { method: "GET", credentials: "include" })
        const payload = await res.json().catch(async () => ({ message: await res.text() }))
        if (!res.ok) throw new Error(payload?.message || "Failed to load countries")

        const list: Country[] = payload?.data?.countries || []
        if (!cancelled) setCountries(list)
      } catch (e) {
        toast({ title: "Countries load failed", description: toMessage(e)})
      } finally {
        if (!cancelled) setCountriesLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [toast])

  const buildQuery = () => {
    const params = new URLSearchParams()
    params.set("offset", "1")
    params.set("limit", "10")

    if (tab === "individual") {
      params.set("subject_type", "individual")
      if (iName) params.set("search", iName)
      if (iGender) params.set("gender", iGender)
      if (iDob) params.set("birth_date", iDob)
      if (iNationality) params.set("nationality", iNationality)
      if (iConfidence) params.set("confidence_rating", iConfidence)
    }

    if (tab === "entity") {
      params.set("subject_type", "entity")
      if (eName) params.set("search", eName)
      if (eCountry) params.set("nationality", eCountry)
      if (eAddress) params.set("address", eAddress)
      if (eConfidence) params.set("confidence_rating", eConfidence)
    }

    if (tab === "vessel") {
      params.set("subject_type", "vessel")
      if (vName) params.set("search", vName)
      if (vImo) params.set("imo", vImo)
      if (vCountry) params.set("nationality", vCountry)
      if (vConfidence) params.set("confidence_rating", vConfidence)
    }

    return params
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setResults(null)
    try {
      const params = buildQuery()
      const res = await fetch(`/api/sanction-entities?${params.toString()}`, { method: "GET", credentials: "include" })
      const payload = await res.json().catch(async () => ({ message: await res.text() }))

      if (!res.ok) {
        const msg = payload?.message || payload?.error || "Search failed"
        throw new Error(msg)
      }

      sessionStorage.setItem("screening_results", JSON.stringify(payload))
      window.location.href = "/dashboard/screening/quick/results"
    } catch (err) {
      toast({ title: "Search failed", description: toMessage(err)})
    } finally {
      setSearching(false)
    }
  }
  const countryOptions: ComboboxOption[] = React.useMemo(
    () => countries.map((c) => ({ value: c.name, label: c.name })),
    [countries]
  )

  // Searchable country dropdown using Combobox
  const CountrySelect = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string
    onChange: (v: string) => void
    placeholder: string
  }) => (
    <Combobox
      options={countryOptions}
      value={value}
      onValueChange={(v) => typeof v === "string" && onChange(v)} // <-- Combobox uses onValueChange
      placeholder={countriesLoading ? "Loading..." : placeholder}
      searchPlaceholder="Search country..."
      // disabled={countriesLoading}
    />
  )

  const ConfidenceInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
    const v = value === "" ? 10 : Number(value)
    const safe = Number.isFinite(v) ? Math.min(100, Math.max(10, v)) : 10

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Confidence rating</Label>
          <div className="text-sm text-muted-foreground tabular-nums">{value ? `${safe}%` : "-"}</div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={10}
            max={100}
            step={1}
            value={value}
            onChange={(e) => onChange(clampPercent(e.target.value))}
            placeholder="10 - 100"
            className="w-28"
          />
          <div className="flex-1">
            <input
              aria-label="Confidence rating"
              type="range"
              min={10}
              max={100}
              step={1}
              value={safe}
              onChange={(e) => onChange(clampPercent(String(e.target.value)))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Search className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Screening</h1>
      </div>

      <Card>
        <CardHeader className="bg-blue-50/50 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-medium">Quick Screening</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 px-2">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
            <TabsList className="w-full grid grid-cols-3 gap-0 p-0 bg-gradient-to-b from-slate-50 to-slate-100 border rounded-xl overflow-hidden">
              <TabsTrigger
                value="individual"
                className="h-14 rounded-none text-base font-semibold px-6 gap-2
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600
                  data-[state=active]:text-white data-[state=active]:shadow-inner
                  data-[state=inactive]:text-slate-700 data-[state=inactive]:bg-transparent
                  transition-all duration-300"
              >
                <Users className="w-4 h-4" />
                Individual
              </TabsTrigger>

              <TabsTrigger
                value="entity"
                className="h-14 rounded-none text-base font-semibold px-6 gap-2 border-x
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600
                  data-[state=active]:text-white data-[state=active]:shadow-inner
                  data-[state=inactive]:text-slate-700 data-[state=inactive]:bg-transparent
                  transition-all duration-300"
              >
                <Building2 className="w-4 h-8" />
                Corporate
              </TabsTrigger>

              <TabsTrigger
                value="vessel"
                className="h-14 rounded-none text-base font-semibold px-6 gap-2
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600
                  data-[state=active]:text-white data-[state=active]:shadow-inner
                  data-[state=inactive]:text-slate-700 data-[state=inactive]:bg-transparent
                  transition-all duration-300"
              >
                <Ship className="w-4 h-4" />
                Vessel
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
            <form className="space-y-6" onSubmit={onSubmit} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
              <TabsContent value="individual" className="mt-0 space-y-4 transition-all duration-300 data-[state=inactive]:hidden">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Name
                  </Label>
                  <Input value={iName} onChange={(e) => setIName(e.target.value)} placeholder="Enter name" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </Label>
                    <Input type="date" value={iDob} onChange={(e) => setIDob(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={iGender} onValueChange={setIGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Nationality
                  </Label>
                  <CountrySelect value={iNationality} onChange={setINationality} placeholder="Select nationality" />
                </div>

                <ConfidenceInput value={iConfidence} onChange={setIConfidence} />
              </TabsContent>

              <TabsContent value="entity" className="mt-0 space-y-4 transition-all duration-300 data-[state=inactive]:hidden">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Name
                  </Label>
                  <Input value={eName} onChange={(e) => setEName(e.target.value)} placeholder="Enter name" />
                </div>

                <div className="space-y-2">
                  <Label>Country of Incorporation</Label>
                  <CountrySelect value={eCountry} onChange={setECountry} placeholder="Select country" />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={eAddress} onChange={(e) => setEAddress(e.target.value)} placeholder="Enter address" />
                </div>

                <ConfidenceInput value={eConfidence} onChange={setEConfidence} />
              </TabsContent>

              <TabsContent value="vessel" className="mt-0 space-y-4 transition-all duration-300 data-[state=inactive]:hidden">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Ship className="w-4 h-4" />
                    Name
                  </Label>
                  <Input value={vName} onChange={(e) => setVName(e.target.value)} placeholder="Enter name" />
                </div>

                <div className="space-y-2">
                  <Label>IMO Number</Label>
                  <Input value={vImo} onChange={(e) => setVImo(e.target.value)} placeholder="Enter IMO number" />
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <CountrySelect value={vCountry} onChange={setVCountry} placeholder="Select country" />
                </div>

                <ConfidenceInput value={vConfidence} onChange={setVConfidence} />
              </TabsContent>

              <Button className="w-full" size="lg" type="submit" disabled={searching}>
                <Search className="w-4 h-4 mr-2" />
                {searching ? "Searching..." : "Search"}
              </Button>
            </form>
          </Tabs>

          {results ? (
            <div className="border rounded-md p-4">
              <div className="font-medium mb-2">Results</div>
              <pre className="text-xs overflow-auto max-h-80">{JSON.stringify(results, null, 2)}</pre>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
