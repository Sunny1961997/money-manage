"use client"

import { ComingSoon } from "@/components/coming-soon"
import { BotIcon } from "lucide-react"

export default function AutomatedBotPage() {
    return (
        <ComingSoon
            title="Automated Intelligence Bot"
            description="Our upcoming AI assistant designed to handle regulatory queries, automate screening workflows, and provide instant compliance insights."
            icon={BotIcon}
            statusText="Training Neural Compliance Models..."
        />
    )
}
