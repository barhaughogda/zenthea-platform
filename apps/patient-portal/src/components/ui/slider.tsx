
export const Slider = ({ value, onValueChange, min, max, step, className }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => (
  <input type="range" min={min} max={max} step={step} value={value?.[0]} onChange={(e) => onValueChange([parseFloat(e.target.value)])} className={className} />
);
