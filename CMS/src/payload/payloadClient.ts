import { getPayload } from '@payloadcms/next';


export async function getPayloadClient() {
  if (!payload.__isInitialized) {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    });
  }

  return payload;
}
