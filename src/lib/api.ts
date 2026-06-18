export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export type HealthResponse = {
  service: string
  status: string
  database: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`)
  }

  return response.json()
}
