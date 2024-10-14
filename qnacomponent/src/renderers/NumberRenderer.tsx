import { ControlProps, isNumberControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { FormControl, TextField } from "@mui/material";
import { useCallback, useState } from "react";

const CustomNumberRenderer = ({
  data,
  handleChange,
  path,
  schema,
  visible,
  enabled,
  label,
}: ControlProps) => {
  const initialValue = !data ? null : Number(data);
  const [currentValue, setCurrentValue] = useState<number | null>(initialValue);

  // validate if schema is a number
  const getValidationError = useCallback(
    (data: number | null): string | null => {
      if (data === undefined || data === null) {
        return null;
      }

      // check if data is a number
      if (isNaN(data)) {
        return "Not a number";
      }

      if (schema.minimum === undefined) {
        return null;
      }

      if (data < schema.minimum) return "Minimum value is " + schema.minimum;

      return null;
    },
    [schema.minimum]
  );

  return (
    <FormControl
      component="fieldset"
      style={{ display: visible ? "block" : "none", marginTop: "32px" }}
    >
      <div>
        <label style={{ fontWeight: "bold" }}>{label}</label>
      </div>

      <div className="mt-2">
        <TextField
          type="number"
          value={currentValue ?? ""}
          error={getValidationError(currentValue) === null ? false : true}
          helperText={getValidationError(currentValue)}
          onChange={(event) => {
            setCurrentValue(Number(event.target.value));
          }}
          onBlur={(event) => {
            setCurrentValue(Number(event.target.value));
            if (getValidationError(Number(event.target.value)) === null) {
              handleChange(path, Number(event.target.value));
            }
          }}
          disabled={!enabled}
          style={{ width: "50%" }}
        />
      </div>
    </FormControl>
  );
};

const NumberRenderer = withJsonFormsControlProps(CustomNumberRenderer);
export default CustomNumberRenderer;
export const numberRendererTester = {
  tester: rankWith(3, isNumberControl),
  renderer: NumberRenderer,
};
