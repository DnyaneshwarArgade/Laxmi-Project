import React from "react";
import TextField from "@mui/material/TextField";
function CustomTextField({
  formProps,
  variant,
  size, 
  id,
  label,
  name,
  disabled,
  value,
  onChange,
  type, 
  ...props
}) {
  return (
    <TextField
      fullWidth
      variant={variant ?? "filled"}
      size={size ?? "small"}
      id={id ?? name ?? ""}
      label={label ?? ""}
      disabled={disabled ?? false}
      autoComplete="off"
      name={name ?? ""}
      type={type ?? "text"}
      value={value ?? formProps?.values[name]}
      onChange={onChange ?? formProps?.handleChange}
      error={formProps?.touched[name] && Boolean(formProps?.errors[name])}
      helperText={formProps?.touched[name] && formProps?.errors[name]}
      {...props} 
    />
  );
}

export default CustomTextField;