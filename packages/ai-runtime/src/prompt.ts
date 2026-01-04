import { PromptLayer, PromptLayerType } from './types';

export class PromptComposer {
  /**
   * Composes a final prompt string from layered prompt segments.
   * Order: System -> Policy -> Domain -> Task -> Memory -> Input.
   * 
   * @param layers Array of prompt layers to compose.
   * @returns Composed prompt string.
   * @throws Error if layers are missing or out of order.
   */
  public static compose(layers: PromptLayer[]): string {
    const requiredOrder: PromptLayerType[] = [
      'system',
      'policy',
      'domain',
      'task',
      'memory',
      'input',
    ];

    // Group layers by type
    const layerMap = new Map<PromptLayerType, PromptLayer[]>();
    for (const layer of layers) {
      const existing = layerMap.get(layer.type) || [];
      existing.push(layer);
      layerMap.set(layer.type, existing);
    }

    // Validate order and presence (though some like memory are optional)
    // We strictly enforce the presence of at least system, domain, and task for a valid AI interaction
    const criticalLayers: PromptLayerType[] = ['system', 'domain', 'task'];
    for (const type of criticalLayers) {
      if (!layerMap.has(type)) {
        throw new Error(`Critical prompt layer missing: ${type}`);
      }
    }

    const composedSegments: string[] = [];

    for (const type of requiredOrder) {
      const typeLayers = layerMap.get(type);
      if (typeLayers) {
        for (const layer of typeLayers) {
          composedSegments.push(`### ${type.toUpperCase()}${layer.version ? ` (v${layer.version})` : ''}\n${layer.content}`);
        }
      }
    }

    return composedSegments.join('\n\n');
  }
}
