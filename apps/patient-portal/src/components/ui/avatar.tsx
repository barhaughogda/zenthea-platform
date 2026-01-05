
export const Avatar = ({ children, className }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => <div className={className}>{children}</div>;
export const AvatarImage = ({ src, alt, className }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => <img src={src} alt={alt} className={className} />;
export const AvatarFallback = ({ children, className }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => <div className={className}>{children}</div>;
