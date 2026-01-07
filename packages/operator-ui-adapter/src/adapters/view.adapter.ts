import { ViewDto } from '@starter/tool-gateway';
import { ViewUiModel } from '../models/view-ui.model';

export function adaptViewDtoToUiModel(dto: ViewDto): ViewUiModel {
  return {
    id: dto.viewId,
    label: dto.name,
    summary: dto.description,
    parentPolicyId: dto.policyId,
    presentation: {
      iconName: dto.presentation.icon,
      layoutType: dto.presentation.layout || 'table',
      columnDefinitions: dto.presentation.columns || [],
      defaultSorting: dto.presentation.defaultSort,
      badges: dto.presentation.badges || [],
    },
  };
}
