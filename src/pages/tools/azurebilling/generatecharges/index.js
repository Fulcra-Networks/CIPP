import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippWizardConfirmation } from "../../../../components/CippWizard/CippWizardConfirmation";
import CippWizardPage from "../../../../components/CippWizard/CippWizardPage.jsx";
import { DateSelect } from "../../../../components/azBillingDateSelect.jsx";
import { BillingReviewMapped, BillingReviewUnmapped } from "../../../../components/billingreviewtables"
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
