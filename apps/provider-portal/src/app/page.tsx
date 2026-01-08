"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@starter/ui";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Portal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            MIG-03 Phase 1 scaffolding only. No legacy migration, no mocks.
          </p>
          <Button type="button">UI wiring check</Button>
        </CardContent>
      </Card>
    </main>
  );
}

