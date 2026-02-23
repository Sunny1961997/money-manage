"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
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

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const FIELD_LABEL_CLASS = "block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_GROUP_CLASS = "space-y-2"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const SELECT_TRIGGER_CLASS =
  "!h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const TABS_BAR_CLASS =
  "sticky top-0 z-20 mb-4 rounded-2xl border border-border/50 bg-background/80 px-2 py-3 backdrop-blur-md"
const TABS_LIST_CLASS = "grid h-auto w-full grid-cols-1 gap-1 bg-transparent p-0 sm:grid-cols-3"
const TABS_TRIGGER_CLASS =
  "h-10 w-full justify-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

const ConfidenceInput = React.memo(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const numValue = value === "" ? 10 : Number(value)
  const safeValue = Number.isFinite(numValue) ? Math.min(100, Math.max(10, numValue)) : 10
  
  const percentage = ((safeValue - 10) / 90) * 100

  return (
    <div className={FIELD_GROUP_CLASS}>
      <div className="flex items-center justify-between">
        <Label className={FIELD_LABEL_CLASS}>Confidence rating</Label>
        <div className="text-sm text-muted-foreground tabular-nums">{safeValue}%</div>
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="number"
          min={10}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="10 - 100"
          className={`${FIELD_CLASS} w-28`}
        />
        <div className="flex-1">
          <input
            aria-label="Confidence rating"
            type="range"
            min={10}
            max={100}
            step={1}
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary"
            style={{
              background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
          />
        </div>
      </div>
    </div>
  )
})
ConfidenceInput.displayName = "ConfidenceInput"

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
    try {
      const params = buildQuery()
      const res = await fetch(`/api/sanction-entities?${params.toString()}`, { method: "GET", credentials: "include" })
      const payload = await res.json().catch(async () => ({ message: await res.text() }))

      if (!res.ok) {
        const msg = payload?.message || payload?.error || "Search failed"
        // throw new Error(msg)
        toast({ title: "Search failed", description: msg})
      }
      if(payload?.status == false) {
        const msg = payload?.message || "Search failed"
        toast({ title: "Search failed", description: msg})
        return
      }
      console.log("Search payload:", payload);

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
      onValueChange={(v) => typeof v === "string" && onChange(v)} 
      placeholder={countriesLoading ? "Loading..." : placeholder}
      searchPlaceholder="Search country..."
      className={FIELD_CLASS}
      matchTriggerWidth
      // disabled={countriesLoading}
    />
  )

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Quick Screening</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Screen individuals, corporates, or vessels against sanctions data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="p-5 sm:p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
            <div className="mb-6 border-b border-border/50 pb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Search Criteria</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a subject type and provide available details to improve screening accuracy.
              </p>
            </div>

            <div className={TABS_BAR_CLASS}>
              <TabsList className={TABS_LIST_CLASS}>
                <TabsTrigger value="individual" className={TABS_TRIGGER_CLASS}>
                  <Users className="h-4 w-4" />
                  Individual
                </TabsTrigger>
                <TabsTrigger value="entity" className={TABS_TRIGGER_CLASS}>
                  <Building2 className="h-4 w-4" />
                  Corporate
                </TabsTrigger>
                <TabsTrigger value="vessel" className={TABS_TRIGGER_CLASS}>
                  <Ship className="h-4 w-4" />
                  Vessel
                </TabsTrigger>
              </TabsList>
            </div>

            <form className="space-y-6" onSubmit={onSubmit} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
              <TabsContent value="individual" className="mt-0 space-y-4">
                <div className={FIELD_GROUP_CLASS}>
                  <Label className={`${FIELD_LABEL_CLASS} flex items-center gap-2`}>
                    <Users className="w-4 h-4" />
                    Name
                  </Label>
                  <Input className={FIELD_CLASS} value={iName} onChange={(e) => setIName(e.target.value)} placeholder="Enter name" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={FIELD_GROUP_CLASS}>
                    <Label className={`${FIELD_LABEL_CLASS} flex items-center gap-2`}>
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </Label>
                    <Input className={FIELD_CLASS} type="date" value={iDob} onChange={(e) => setIDob(e.target.value)} />
                  </div>

                  <div className={FIELD_GROUP_CLASS}>
                    <Label className={FIELD_LABEL_CLASS}>Gender</Label>
                    <Select value={iGender} onValueChange={setIGender}>
                      <SelectTrigger className={SELECT_TRIGGER_CLASS}>
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

                <div className={FIELD_GROUP_CLASS}>
                  <Label className={`${FIELD_LABEL_CLASS} flex items-center gap-2`}>
                    <Globe className="w-4 h-4" />
                    Nationality
                  </Label>
                  <CountrySelect value={iNationality} onChange={setINationality} placeholder="Select nationality" />
                </div>

                <ConfidenceInput value={iConfidence} onChange={setIConfidence} />
              </TabsContent>

              <TabsContent value="entity" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={`${FIELD_GROUP_CLASS} md:col-span-2`}>
                    <Label className={`${FIELD_LABEL_CLASS} flex items-center gap-2`}>
                      <Building2 className="w-4 h-4" />
                      Name
                    </Label>
                    <Input className={FIELD_CLASS} value={eName} onChange={(e) => setEName(e.target.value)} placeholder="Enter name" />
                  </div>

                  <div className={FIELD_GROUP_CLASS}>
                    <Label className={FIELD_LABEL_CLASS}>Country of Incorporation</Label>
                    <CountrySelect value={eCountry} onChange={setECountry} placeholder="Select country" />
                  </div>

                  <div className={FIELD_GROUP_CLASS}>
                    <Label className={FIELD_LABEL_CLASS}>Address</Label>
                    <Input className={FIELD_CLASS} value={eAddress} onChange={(e) => setEAddress(e.target.value)} placeholder="Enter address" />
                  </div>
                </div>

                <ConfidenceInput value={eConfidence} onChange={setEConfidence} />
              </TabsContent>

              <TabsContent value="vessel" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={FIELD_GROUP_CLASS}>
                    <Label className={`${FIELD_LABEL_CLASS} flex items-center gap-2`}>
                      <Ship className="w-4 h-4" />
                      Name
                    </Label>
                    <Input className={FIELD_CLASS} value={vName} onChange={(e) => setVName(e.target.value)} placeholder="Enter name" />
                  </div>

                  <div className={FIELD_GROUP_CLASS}>
                    <Label className={FIELD_LABEL_CLASS}>IMO Number</Label>
                    <Input className={FIELD_CLASS} value={vImo} onChange={(e) => setVImo(e.target.value)} placeholder="Enter IMO number" />
                  </div>

                  <div className={`${FIELD_GROUP_CLASS} md:col-span-2`}>
                    <Label className={FIELD_LABEL_CLASS}>Country</Label>
                    <CountrySelect value={vCountry} onChange={setVCountry} placeholder="Select country" />
                  </div>
                </div>

                <ConfidenceInput value={vConfidence} onChange={setVConfidence} />
              </TabsContent>

              <div className="sticky bottom-0 z-10 mt-6 border-t border-border/60 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="flex justify-end">
                  <Button className="h-12 min-w-[180px] rounded-xl px-6 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl" type="submit" disabled={searching}>
                    <Search className="mr-2 h-4 w-4" />
                    {searching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
