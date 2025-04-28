import payload from 'payload'

let initialized = false

async function initPayload() {
  if (!initialized) {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET!,
      local: true, // Pour Next.js (sinon Payload tente de démarrer un serveur Express)
    })
    initialized = true
  }
}

export async function getPayload() {
  await initPayload()
  return payload
}
