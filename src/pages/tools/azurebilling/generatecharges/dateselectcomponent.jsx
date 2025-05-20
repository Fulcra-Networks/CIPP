import { CippFormComponent } from "/src/components/CippComponents/CippFormComponent";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import { CippWizardStepButtons } from "/src/components/CippWizard/CippWizardStepButtons";


export const DateComponent = (props) => {  
  const {
    formControl = useForm({
      defaultValues: {
        startDate: null,
        toggleSwitch: false
      }
    }),
    currentStep,
    onNextStep,
    onPreviousStep
  } = props;

  return (
    <Stack spacing={2}>
      <label>Select the month to execute billing for. Only the month and year will be used, so just select the first.</label>
      <CippFormComponent
        type="datePicker"
        name="datetime"
        label="Select Date"
        dateTimeType="date"
        formControl={formControl}
        validators={{
          required: { value: true, message: "You must set a billing date." },
        }}
      />
      <CippFormComponent
        type="switch"
        name="rerunJob"
        label="Refetch and refresh billing data. THIS WILL DELETE EXISTING ROWS AND ADD FRESH ONES FROM API."
        formControl={formControl}
      />
      <CippWizardStepButtons
        currentStep={currentStep}
        onPreviousStep={onPreviousStep}
        onNextStep={onNextStep}
        formControl={formControl}
      />
    </Stack>
  ) 
}