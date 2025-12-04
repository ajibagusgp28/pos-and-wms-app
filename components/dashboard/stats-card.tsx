import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {trend && <p className="text-xs text-accent mt-2">{trend}</p>}
        </div>
        <div className="text-primary">{icon}</div>
      </div>
    </div>
  )
}
