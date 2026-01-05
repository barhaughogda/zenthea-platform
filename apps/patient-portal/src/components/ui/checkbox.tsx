
export const Checkbox = ({ checked, onCheckedChange, className }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => (
  <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className={className} />
);
