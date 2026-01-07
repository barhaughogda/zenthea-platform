import { PolicyDto, RiskTier } from '@starter/tool-gateway';
import { PolicyUiModel, RiskSeverity } from '../models/policy-ui.model';

export function adaptPolicyDtoToUiModel(dto: PolicyDto): PolicyUiModel {
  const riskMapping: Record<RiskTier, { label: string; color: 'info' | 'warning' | 'error' }> = {
    low: { label: 'Low Risk', color: 'info' },
    medium: { label: 'Medium Risk', color: 'warning' },
    high: { label: 'High Risk', color: 'error' },
  };

  const risk = riskMapping[dto.riskTier];

  return {
    id: dto.policyId,
    label: dto.name,
    summary: dto.description,
    categoryLabel: dto.category,
    risk: {
      tier: dto.riskTier as RiskSeverity,
      label: risk.label,
      colorHint: risk.color,
    },
    presentation: {
      iconName: dto.presentation.icon,
      layoutType: dto.presentation.layout || 'table',
      columnDefinitions: dto.presentation.columns || [],
      defaultSorting: dto.presentation.defaultSort,
      badges: dto.presentation.badges || [],
    },
    parameterSchema: dto.inputs?.map(input => ({
      id: input.name,
      label: input.name,
      dataType: input.type,
      hint: input.description,
    })),
    outputSchema: dto.outputs?.map(output => ({
      id: output.name,
      label: output.name,
      dataType: output.type,
      hint: output.description,
    })),
    externalLinks: dto.links?.map(link => ({
      title: link.label,
      href: link.url,
    })) || [],
  };
}
