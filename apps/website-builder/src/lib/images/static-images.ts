/**
 * Mock Static Image Manager
 */

export const StaticImageManager = {
  getOptimizedImage: (src: string, options: any) => src,
  getFallbackImage: (type: string) => '/placeholder.png',
  generateSrcSet: (src: string, breakpoints: number[], options: any) => undefined,
  getLazyImage: (src: string, options: any) => ({ blurDataURL: undefined }),
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
