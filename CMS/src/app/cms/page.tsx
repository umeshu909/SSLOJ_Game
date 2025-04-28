import { getPayloadClient } from '@/payload/payloadClient';

export default async function CMSPage() {
  const payload = await getPayloadClient();

  return payload.admin.render();
}
