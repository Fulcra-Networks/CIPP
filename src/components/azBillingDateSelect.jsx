import { CippFormComponent } from "/src/components/CippComponents/CippFormComponent";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import { CippWizardStepButtons } from "/src/components/CippWizard/CippWizardStepButtons";


export const DateSelect = (props) => {  
  const {
    formControl = useForm({
      defaultValues: {
        billMonth: '',
        billingMonth: '',
        toggleSwitch: false,
        totalToBill: '',
        totalUnmapped: ''
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
        name="billMonth"
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
        defaultValue={false}
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