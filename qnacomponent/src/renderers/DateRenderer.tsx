import { ControlProps, rankWith, isDateControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { FormControl } from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const CustomDateRenderer = ({
  data,
  handleChange,
  path,
  schema,
  uischema,
  visible,
  enabled,
  label,
}: ControlProps) => {
  return (
    <FormControl
      component="fieldset"
      style={{ display: visible ? "block" : "none", marginTop: "32px" }}
    >
      <label className="mb-2 font-bold">{label}</label>

      <div className="mt-2">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            onAccept={(date: Date | null) => {
              handleChange(path, date?.toLocaleDateString());
            }}
            format="MM/dd/yyyy"
          />
        </LocalizationProvider>
      </div>
    </FormControl>
  );
};

const DateRenderer = withJsonFormsControlProps(CustomDateRenderer);
export default DateRenderer;
export const dateRendererTester = {
  tester: rankWith(4, isDateControl),
  renderer: DateRenderer,
};
