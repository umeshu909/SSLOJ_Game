'use client';

import { getPayloadClient } from '@/payload/payloadClient'; // À adapter selon ton chemin exact

export default async function CMSPage() {
  const payload = await getPayloadClient();

  return payload.admin.render();
}
