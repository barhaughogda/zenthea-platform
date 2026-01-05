
export const TenantBranding = (props: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => {
  const { size, className } = props;
  return (
    <div className={className}>
      <span className={`font-bold ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
        Zenthea Patient Portal
      </span>
    </div>
  );
};
