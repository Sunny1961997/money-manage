"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from "lucide-react"
export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch("/api/admin/packages", { credentials: "include" })
                const data = await res.json()
                console.log("Fetched packages:", data)
                setPackages(data?.data || [])
            } catch (err) {
                console.error("Failed to fetch packages:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPackages();
    }, [])

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Packages</h1>
                <Link href="/dashboard/admin/packages/add">
                    <Button>Add Package</Button>
                </Link>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-12">Loading packages...</div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-sm">ID</th>
                                        <th className="text-left p-4 font-medium text-sm">Name</th>
                                        <th className="text-left p-4 font-medium text-sm">Price</th>
                                        <th className="text-left p-4 font-medium text-sm">Currency</th>
                                        <th className="text-left p-4 font-medium text-sm">Default</th>
                                        <th className="text-left p-4 font-medium text-sm">Trial Days</th>
                                        <th className="text-left p-4 font-medium text-sm">Screening Limit</th>
                                        <th className="text-left p-4 font-medium text-sm">KYC Limit</th>
                                        <th className="text-left p-4 font-medium text-sm">Duration</th>
                                        <th className="text-left p-4 font-medium text-sm">Description</th>
                                        <th className="text-left p-4 font-medium text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.length === 0 ? (
                                        <tr>
                                            <td className="p-4 text-sm text-muted-foreground text-center" colSpan={11}>
                                                No packages found.
                                            </td>
                                        </tr>
                                    ) : (
                                        packages.map((pkg: any) => (
                                            <tr key={pkg.id} className="border-b last:border-b-0 hover:bg-slate-50">
                                                <td className="p-4">{pkg.id}</td>
                                                <td className="p-4">{pkg.name}</td>
                                                <td className="p-4">{pkg.price}</td>
                                                <td className="p-4">{pkg.currency}</td>
                                                <td className="p-4">{pkg.is_default ? "Yes" : "No"}</td>
                                                <td className="p-4">{pkg.trial_days}</td>
                                                <td className="p-4">{pkg.screening_limit}</td>
                                                <td className="p-4">{pkg.kyc_limit}</td>
                                                <td className="p-4">{pkg.duration}</td>
                                                <td className="p-4">{pkg.description}</td>
                                                <td className="p-4">
                                                    <Link href={`/dashboard/admin/packages/${pkg.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => router.push(`/dashboard/admin/packages/${pkg.id}`)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
