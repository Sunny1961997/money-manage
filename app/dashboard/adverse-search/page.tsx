"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Newspaper } from "lucide-react"

export default function AdverseSearchPage() {
  return (
    <ComingSoon
      title="Adverse Media Search"
      description="Advanced AI-driven media monitoring to identify negative news and potential risks associated with entities in real-time."
      icon={Newspaper}
      statusText="Scanning Global Databases..."
    />
  )
}