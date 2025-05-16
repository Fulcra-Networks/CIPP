import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippWizardConfirmation } from "/src/components/CippWizard/CippWizardConfirmation";
import CippWizardPage from "/src/components/CippWizard/CippWizardPage.jsx";
import { CippTenantStep } from "/src/components/CippWizard/CippTenantStep.jsx";
import { CippWizardCSVImport } from "/src/components/CippWizard/CippWizardCSVImport";
import { CippWizardAutopilotOptions } from "/src/components/CippWizard/CippWizardAutopilotOptions";
import { DateComponent } from "./dateselectcomponent";
import { BillingReviewMapped, BillingReviewUnmapped } from "./billingreviewtables"

const Page = () => {
  const steps = [
    {
      title: "Step 1",
      description: "Date Selection",
      component: DateComponent,
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
        postUrl="/api/"
        wizardTitle="Azure Billing"
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
