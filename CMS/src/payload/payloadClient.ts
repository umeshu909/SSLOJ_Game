import payload from 'payload';

export async function getPayloadClient() {
  if (!payload.__isInitialized) {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    });
  }

  return payload;
}
