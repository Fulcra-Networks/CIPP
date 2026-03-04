import { Button, Card, Divider, Stack, Typography } from "@mui/material";
import { CippApiResults } from "./CippComponents/CippApiResults";
import { ApiPostCall } from "../api/ApiCall";
import { PropertyList } from "./property-list";
import { PropertyListItem } from "./property-list-item";

export const BillingConfirmation = (props) => {
  const {
    postUrl,
    lastStep,
    formControl,
    onPreviousStep,
    onNextStep,
    currentStep,
  } = props;

  const sendForm = ApiPostCall({});
  const formValues = formControl.getValues();

  const handleSubmit = () => {
    const values = formControl.getValues();
    sendForm.mutate({ url: postUrl, data: values });
  };

  const submitted = sendForm.isSuccess;

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <Stack p={3}>
          <Typography variant="h6">
            {submitted
              ? "Your charges have been submitted successfully."
              : "You've completed the steps in this wizard. Hit submit to send your charges."}
          </Typography>
        </Stack>
        <Divider />
        <PropertyList>
          <PropertyListItem label="Billing Month" value={formValues.billingMonth} />
          <PropertyListItem label="Mapped Charges" value={formValues.totalToBill} />
          <PropertyListItem label="Unmapped Charges" value={formValues.totalUnmapped} />
          <PropertyListItem label="Rerun Job" value={formValues.rerunJob ? "Yes" : "No"} />
        </PropertyList>
      </Card>

      <CippApiResults apiObject={sendForm} />

      <Stack
        alignItems="center"
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mt: 3 }}
      >
        {!submitted && (
          <>
            <Button color="inherit" onClick={onPreviousStep} size="large" type="button">
              Back
            </Button>
            <Button
              size="large"
              variant="contained"
              disabled={sendForm.isPending}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  );
};
