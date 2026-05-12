export function getWeekKey(offsetWeeks = 0): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff + offsetWeeks * 7)
  return d.toISOString().slice(0, 10)
}

export function getWeekLabel(offsetWeeks = 0): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff + offsetWeeks * 7)
  const end = new Date(d)
  end.setDate(end.getDate() + 6)
  const fmt = (dt: Date) =>
    dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(d)} – ${fmt(end)}`
}

export function getCurrentQuarter(): string {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q} ${now.getFullYear()}`
}
