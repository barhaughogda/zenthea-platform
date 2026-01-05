/**
 * Mock Static Image Manager
 */

export const StaticImageManager = {
  getOptimizedImage: (src: string, _options: Record<string, unknown>) => src,
  getFallbackImage: (_type: string) => '/placeholder.png',
  generateSrcSet: (_src: string, _breakpoints: number[], _options: Record<string, unknown>) => undefined,
  getLazyImage: (_src: string, _options: Record<string, unknown>) => ({ blurDataURL: undefined }),
};

export const ImageUtils = {
  getBestFormat: () => 'webp',
};

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: string;
  position?: string;
  placeholder?: boolean;
}
