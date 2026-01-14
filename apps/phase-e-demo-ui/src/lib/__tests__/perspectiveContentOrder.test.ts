import { describe, it, expect } from "vitest";
import { getSectionOrder, PERSPECTIVE_SECTION_ORDER } from "../perspectiveContentOrder";
import { DemoPerspective } from "../demoPerspectiveContext";

describe("perspectiveContentOrder", () => {
  const perspectives: DemoPerspective[] = ["patient", "clinician", "operator"];

  it("should return different orders for different perspectives", () => {
    const patientOrder = getSectionOrder("patient");
    const clinicianOrder = getSectionOrder("clinician");
    const operatorOrder = getSectionOrder("operator");

    expect(patientOrder).not.toEqual(clinicianOrder);
    expect(clinicianOrder).not.toEqual(operatorOrder);
    expect(patientOrder).not.toEqual(operatorOrder);
  });

  it("should contain the same content IDs across all perspectives", () => {
    const patientOrder = [...getSectionOrder("patient")].sort();
    const clinicianOrder = [...getSectionOrder("clinician")].sort();
    const operatorOrder = [...getSectionOrder("operator")].sort();

    expect(patientOrder).toEqual(clinicianOrder);
    expect(clinicianOrder).toEqual(operatorOrder);
  });

  it("should not have duplicated or dropped content IDs", () => {
    perspectives.forEach(p => {
      const order = getSectionOrder(p);
      const uniqueOrder = Array.from(new Set(order));
      
      expect(order.length).toBe(8); // Total number of PanelIds we are ordering
      expect(order.length).toBe(uniqueOrder.length);
    });
  });

  it("should match the specific ordering requirements for Patient", () => {
    const order = getSectionOrder("patient");
    expect(order[0]).toBe("synthesis"); // Plain-language summary
    expect(order[1]).toBe("relevance"); // Evidence attribution
    expect(order[2]).toBe("confidence"); // Boundary/Reassurance
  });

  it("should match the specific ordering requirements for Clinician", () => {
    const order = getSectionOrder("clinician");
    expect(order[0]).toBe("comparative"); // Clinical facts and dates
    expect(order[1]).toBe("relevance");   // Timeline-referenced
    expect(order[2]).toBe("synthesis");   // Summary
  });

  it("should match the specific ordering requirements for Operator", () => {
    const order = getSectionOrder("operator");
    expect(order[0]).toBe("audit");       // Audit/Accountability
    expect(order[1]).toBe("readiness");   // Policy/Readiness
    expect(order[2]).toBe("execution");   // Execution preview
  });
});
