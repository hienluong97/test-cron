import {useController } from "react-hook-form";
import { TextField } from "@mui/material";
import { InputFieldProps } from "@interfaces/index";


const InputField = ({ name, label, control }: InputFieldProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <TextField
      fullWidth
      label={label}
      margin="normal"
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      helperText={error?.message}
      name={name}
      onChange={onChange}
      value={value || ""}
      onBlur={onBlur}
      FormHelperTextProps={{ sx: { color: "red" } }}
    />
  );
};

export default InputField;