import { ControlProps, isDateTimeControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { FormControl } from "@mui/material";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const CustomDateTimeRenderer = ({
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
          <DateTimePicker
            onAccept={(date: any) => {
              handleChange(path, date?.toLocaleString());
            }}
            format="MM/dd/yyyy HH:mm a"
          />
        </LocalizationProvider>
      </div>
    </FormControl>
  );
};

const DateTimeRenderer = withJsonFormsControlProps(CustomDateTimeRenderer);
export default DateTimeRenderer;
export const dateTimeRendererTester = {
  tester: rankWith(4, isDateTimeControl),
  renderer: DateTimeRenderer,
};
