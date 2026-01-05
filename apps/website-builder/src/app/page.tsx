'use client';

import React from 'react';
import WebsiteBuilder from '@/components/website-builder/WebsiteBuilder';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { tenantId?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page(props: PageProps) {
  return <WebsiteBuilder {...props} />;
}
