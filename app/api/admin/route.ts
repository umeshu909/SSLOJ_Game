import { getPayload } from '@/payload/payloadClient'

export async function GET(request: Request) {
  const payload = await getPayload()
  return payload.handleRequest(request)
}

export async function POST(request: Request) {
  const payload = await getPayload()
  return payload.handleRequest(request)
}
