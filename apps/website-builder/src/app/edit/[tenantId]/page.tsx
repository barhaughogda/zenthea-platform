'use client';

import React, { use } from 'react';
import WebsiteBuilder from '@/components/website-builder/WebsiteBuilder';

export default function TenantEditorPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);

  // In the real app, we would ensure the user has permission to edit this tenant
  // and pass the tenantId down to the main builder component.
  
  return <WebsiteBuilder tenantId={tenantId} params={{ tenantId }} searchParams={{}} />;
}
