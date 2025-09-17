import { Autocomplete, TextField } from "@mui/material";

function CustomAutoComplete({
  defaultProps,
  formProps,
  variant,
  defaultValue,
  size,
  id,
  label,
  name,
  disabled,
  value,
  onChange,
  clearFields = [],
  type,
  ...props
}) {
  const valueAsNumber = Number(value);
  return (
    <>
      <Autocomplete
        {...defaultProps}
        id={id ?? name ?? ""}
        disabled={disabled ? true : false}
        name={name ?? ""}
        value={
          defaultProps?.options?.find(
            (option) => option?.id === valueAsNumber
          ) || null
        }
        onChange={(event, newValue) => {
          formProps.setFieldValue(name, newValue?.id ?? "");

          clearFields.forEach((field) => {
            formProps.setFieldValue(field, "");
          });
        }}
        defaultValue={defaultValue}
        getOptionLabel={(option) =>
          option?.name ||
          option?.so_code ||
          option?.jc_code ||
          option?.po_code ||
          option?.supply_code ||
          option?.invoice_number ||
          ""
        }
        isOptionEqualToValue={(option, value) => option.id === valueAsNumber}
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ?? ""}
            variant={variant ?? "outlined"}
            size={size ?? "small"}
            id={id ?? name ?? ""}
            name={name ?? ""}
            error={formProps?.touched[name] && Boolean(formProps?.errors[name])}
            helperText={formProps?.touched[name] && formProps?.errors[name]}
          />
        )}
      />
    </>
  );
}

export default CustomAutoComplete;