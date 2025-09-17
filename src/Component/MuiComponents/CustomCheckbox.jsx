import { Checkbox, FormControlLabel } from "@mui/material";

function CustomCheckbox({
  formProps,
  variant,
  fontSize,
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
    <>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
            disabled={disabled ? true : false}
            sx={{
              "& .MuiSvgIcon-root": { fontSize: fontSize ?? 25 },
            }}
            id={id ?? name ?? ""}
            name={name ?? ""}
            checked={value ?? formProps.values[name] == 1 ? true : false}
            onChange={(event) => {
              formProps.setFieldValue(`${name}`, event.target.value);
            }}
            value={formProps.values[name] == 1 ? 0 : 1}
            error={formProps?.touched[name] && Boolean(formProps?.errors[name])}
            helperText={formProps?.touched[name] && formProps?.errors[name]}
          />
        }
        label={label ?? ""}
      />
    </>
  );
}

export default CustomCheckbox;