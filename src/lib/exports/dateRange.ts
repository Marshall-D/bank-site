function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function getDefaultExportDateRange() {
  const to = new Date()
  const from = new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000)

  return {
    from: formatDateInput(from),
    to: formatDateInput(to),
  }
}
