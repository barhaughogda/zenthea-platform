
export const Progress = ({ value, className }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => {
  return (
    <div className={`h-2 w-full bg-secondary ${className}`}>
      <div 
        className="h-full bg-primary transition-all" 
        style={{ width: `${value || 0}%` }}
      />
    </div>
  );
};
