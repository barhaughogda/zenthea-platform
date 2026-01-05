'use client';

import React, { useEffect, useState } from 'react';
import { useConsents } from '@/hooks/useConsents';
import { ConsentInfo } from '@/lib/contracts/consent';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Loader2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

/**
 * PatientAccessManager Component
 * 
 * Displays and manages patient consent and access permissions.
 * Integrated with the Consent Agent service.
 * 
 * Migration Phase Slice 02B - Step 4.1
 */
export const PatientAccessManager = (_props: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => {
  const { consentService, patientId } = useConsents();
  const [consents, setConsents] = useState<ConsentInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchConsents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await consentService.getConsents(patientId);
        setConsents(data);
      } catch (err) {
        setError('Failed to load access permissions. Please try again later.');
        console.error('[PatientAccessManager] Error fetching consents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsents();
  }, [consentService, patientId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-zenthea-teal" />
        <span className="ml-2 text-sm text-text-secondary">Loading permissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-status-error bg-status-error/10 rounded-lg">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!consents || consents.length === 0) {
    return (
      <div className="text-center p-8 bg-surface-elevated rounded-lg border border-dashed border-border-primary">
        <Shield className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
        <p className="text-sm text-text-secondary">No active access permissions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {consents.map((consent) => (
        <Card key={consent.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getStatusBgColor(consent.status)}`}>
                  {getStatusIcon(consent.status)}
                </div>
                <div>
                  <h5 className="font-medium text-text-primary capitalize">
                    {consent.purpose.toLowerCase()} Access
                  </h5>
                  <p className="text-sm text-text-secondary mt-1">
                    {consent.explanation || 'No description available.'}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                      <Clock className="h-3.5 w-3.5" />
                      Granted: {new Date(consent.grantedAt).toLocaleDateString()}
                    </div>
                    {consent.expiresAt && (
                      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                        <Clock className="h-3.5 w-3.5" />
                        Expires: {new Date(consent.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(consent.status)}>
                {consent.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper functions for UI states

function getStatusIcon(status: ConsentInfo['status']) {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="h-5 w-5 text-status-success" />;
    case 'revoked':
      return <AlertCircle className="h-5 w-5 text-status-error" />;
    case 'expired':
      return <Clock className="h-5 w-5 text-text-tertiary" />;
    case 'pending':
      return <Loader2 className="h-5 w-5 animate-spin text-zenthea-teal" />;
  }
}

function getStatusBgColor(status: ConsentInfo['status']) {
  switch (status) {
    case 'active':
      return 'bg-status-success/10';
    case 'revoked':
      return 'bg-status-error/10';
    case 'expired':
      return 'bg-surface-elevated';
    case 'pending':
      return 'bg-zenthea-teal/10';
  }
}

function getStatusBadgeVariant(status: ConsentInfo['status']): 'default' | 'destructive' | 'secondary' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'revoked':
      return 'destructive';
    case 'expired':
      return 'secondary';
    case 'pending':
      return 'outline';
    default:
      return 'secondary';
  }
}
