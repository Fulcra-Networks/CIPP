import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippWizardConfirmation } from "/src/components/CippWizard/CippWizardConfirmation";
import CippWizardPage from "/src/components/CippWizard/CippWizardPage.jsx";
import { DateSelect } from "/src/components/azBillingDateSelect.jsx";
import { BillingReviewMapped, BillingReviewUnmapped } from "/src/components/billingreviewtables"
// import { useSettings } from "../../../../hooks/use-settings";

const Page = () => {
  // const initialState = useSettings();
  const steps = [
    {
      title: "Step 1",
      description: "Date Selection",
      component: DateSelect,
    },
    {
      title: "Step 2",
      description: "Review Billing",
      component: BillingReviewMapped,
    },
    {
      title: "Step 3",
      description: "Review Unmapped Charges",
      component: BillingReviewUnmapped,
    },
    {
      title: "Step 4",
      description: "Confirmation",
      component: CippWizardConfirmation,
    }
  ];

  return (
    <>
      <CippWizardPage
        steps={steps}
        postUrl="/api/ExecSendAzureCharges"
        wizardTitle="Azure Billing"
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
