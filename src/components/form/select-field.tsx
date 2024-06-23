import { Control, useController } from "react-hook-form";
import Box from "@mui/material/Box";
import { RadioGroup, Radio, FormControlLabel, FormLabel } from "@mui/material";

export interface SeclectFieldProps {
  name: string;
  label?: string;
  control: Control<any>;
  option: any;
}
const SeclectField = ({ name, label, control, option }: SeclectFieldProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });
  return (
    <>
      {/* <FormLabel>{label}</FormLabel> */}
      <RadioGroup
        row
        aria-label={name}
        name={name}
        onChange={onChange}
        value={value || null}
      >
        {option.map((item: any) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio size="small" />}
            label={item.name}
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default SeclectField;
