/* eslint-disable */
import React from 'react';

export const Avatar = ({ children, className }: any) => <div className={className}>{children}</div>;
export const AvatarImage = ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />;
export const AvatarFallback = ({ children, className }: any) => <div className={className}>{children}</div>;
