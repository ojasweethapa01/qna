import { ControlProps, isStringControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { FormControl, TextField } from "@mui/material";
import { useCallback, useState } from "react";

const CustomStringRenderer = ({
  data,
  handleChange,
  path,
  schema,
  visible,
  enabled,
  label,
}: ControlProps) => {
  const [currentData, setCurrentData] = useState<string | null>(data ?? null);

  const getValidationError = useCallback(
    (data: string | null): string | null => {
      if ((data === undefined || data === null) && schema.minimum) {
        return "Minimum length is " + schema.minimum;
      }

      if (data === undefined || data === null) {
        return null;
      }

      if (schema.minimum === undefined) {
        return null;
      }

      if (data.trim().length < schema.minimum)
        return "Minimum length is " + schema.minimum;

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
        <label style={{ fontWeight: "bold", marginBottom: "8px" }}>
          {label}
        </label>
      </div>

      <div className="mt-2">
        <TextField
          value={currentData ?? ""}
          onChange={(event) => {
            setCurrentData(event.target.value);
          }}
          onBlur={(event) => {
            setCurrentData(event.target.value);

            if (getValidationError(event.target.value) === null) {
              handleChange(path, event.target.value);
            }
          }}
          disabled={!enabled}
          error={getValidationError(currentData) === null ? false : true}
          helperText={getValidationError(currentData)}
          style={{ width: "50%" }}
        />
      </div>
    </FormControl>
  );
};

const StringRenderer = withJsonFormsControlProps(CustomStringRenderer);
export default CustomStringRenderer;
export const stringRendererTester = {
  tester: rankWith(3, isStringControl),
  renderer: StringRenderer,
};
