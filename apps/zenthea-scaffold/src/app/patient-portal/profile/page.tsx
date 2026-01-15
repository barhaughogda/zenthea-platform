/**
 * READ-ONLY / NON-OPERATIONAL
 * Patient profile detail page for Phase AJ-03.
 * Execution remains blocked. Inspect-only view.
 */

import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, MapPin, FileText } from "lucide-react";

const MOCK_PATIENT = {
  id: "PAT-12345",
  name: "Jane Smith",
  status: "ACTIVE",
  demographics: {
    dateOfBirth: "March 15, 1985",
    age: "40 years",
    gender: "Female",
    language: "English",
    maritalStatus: "Married",
  },
  contact: {
    phone: "(555) 123-4567",
    email: "jane.smith@example.com",
    address: "123 Main Street, Apt 4B",
    city: "Springfield",
    state: "IL",
    zip: "62701",
  },
  emergency: {
    name: "Michael Smith",
    relationship: "Spouse",
    phone: "(555) 987-6543",
  },
  insurance: {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BCBS-123456789",
    groupNumber: "GRP-98765",
  },
  preferences: {
    appointmentReminders: "Email and SMS",
    communicationMethod: "Email preferred",
    timezone: "Central Time (CT)",
  },
};

export default function PatientProfilePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/patient-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patient Portal
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{MOCK_PATIENT.name}</h1>
            <p className="text-muted-foreground">
              Patient ID: {MOCK_PATIENT.id} | Inspect Mode
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
          {MOCK_PATIENT.status}
        </span>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Demographics
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Date of Birth</dt>
              <dd>{MOCK_PATIENT.demographics.dateOfBirth}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Age</dt>
              <dd>{MOCK_PATIENT.demographics.age}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Gender</dt>
              <dd>{MOCK_PATIENT.demographics.gender}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Language</dt>
              <dd>{MOCK_PATIENT.demographics.language}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Marital Status</dt>
              <dd>{MOCK_PATIENT.demographics.maritalStatus}</dd>
            </div>
          </dl>
        </div>

        {/* Contact Information */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Contact Information
          </h2>
          <dl className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Phone</dt>
                <dd>{MOCK_PATIENT.contact.phone}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd>{MOCK_PATIENT.contact.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Address</dt>
                <dd>
                  {MOCK_PATIENT.contact.address}
                  <br />
                  {MOCK_PATIENT.contact.city}, {MOCK_PATIENT.contact.state}{" "}
                  {MOCK_PATIENT.contact.zip}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Emergency Contact */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-500" />
            Emergency Contact
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd>{MOCK_PATIENT.emergency.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Relationship</dt>
              <dd>{MOCK_PATIENT.emergency.relationship}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd>{MOCK_PATIENT.emergency.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Insurance */}
        <div className="surface-card space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Insurance Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Provider</dt>
              <dd>{MOCK_PATIENT.insurance.provider}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Policy Number</dt>
              <dd>{MOCK_PATIENT.insurance.policyNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Group Number</dt>
              <dd>{MOCK_PATIENT.insurance.groupNumber}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Governance Notice */}
      <div className="governance-notice">
        <h3 className="font-bold mb-1">INSPECT MODE</h3>
        <p className="text-sm">
          This is a read-only inspection view. No modifications to this patient
          profile are possible. All data shown is static mock data for
          visualization purposes only. No real patient data is displayed.
        </p>
      </div>
    </div>
  );
}
