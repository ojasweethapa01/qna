import { ControlProps, isEnumControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

const CustomEnumRenderer = ({
  data,
  handleChange,
  path,
  schema,
  uischema,
  visible,
  enabled,
  label,
}: ControlProps) => {
  if (!schema.enum) {
    return null;
  }

  return (
    <FormControl
      component="fieldset"
      style={{ display: visible ? "block" : "none", marginTop: "32px" }}
    >
      <label className="font-bold">{label}</label>

      <div className="mt-2">
        {uischema.options?.format && uischema.options?.format === "picklist" ? (
          <Select
            value={data ?? ""}
            onChange={(event) => {
              handleChange(path, event.target.value);
            }}
            disabled={!enabled}
            style={{ width: "50%" }}
          >
            {schema?.enum.map((option: string, index: number) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <RadioGroup
            value={data ?? ""}
            onChange={(event) => handleChange(path, event.target.value)}
          >
            {schema.enum.map((option: string, index: number) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                disabled={!enabled}
              />
            ))}
          </RadioGroup>
        )}
      </div>
    </FormControl>
  );
};

const EnumRenderer = withJsonFormsControlProps(CustomEnumRenderer);
export default EnumRenderer;
export const enumRendererTester = {
  tester: rankWith(4, isEnumControl),
  renderer: EnumRenderer,
};
