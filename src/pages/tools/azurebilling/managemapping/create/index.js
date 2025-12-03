import { Box } from "@mui/material";
import CippFormPage from "/src/components/CippFormPages/CippFormPage";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { useForm, useWatch } from "react-hook-form";
import { useSettings } from "/src/hooks/use-settings";
import { useEffect } from "react";

import AzureBillingAddMapping from "/src/components/CippFormPages/AzureBillingAddMapping";

const Page = () => {
  const mapSettingsDefaults = useSettings();

  const formControl = useForm({
    mode: "onBlur",
    defaultValues: {
      tenantFilter: mapSettingsDefaults.currentTenant,
    },
  });

  const formValues = useWatch({ control: formControl.control, name: "mapProperties" });
  useEffect(() => {
    if (formValues) {
      const { userPrincipalName, usageLocation, ...restFields } = formValues.addedFields || {};
      let newFields = { ...restFields };
      
      newFields.tenantFilter = mapSettingsDefaults.currentTenant;

      formControl.reset(newFields);
    }
  }, [formValues]);
  
  return (
    <>
      <CippFormPage
        queryKey={`Billing-${mapSettingsDefaults.currentTenant}`}
        formControl={formControl}
        title="Azure Billing Map"
        backButtonTitle="Billing Overview"
        postUrl="/api/AddUpdateAzureBillingMapping"
      >
        <Box sx={{ my: 2 }}>
          <AzureBillingAddMapping formControl={formControl} mapSettingsDefaults={mapSettingsDefaults} />
        </Box>
      </CippFormPage>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
