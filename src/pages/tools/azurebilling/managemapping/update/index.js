import { Box } from "@mui/material";
import CippFormPage from "../../../../../components/CippFormPages/CippFormPage";
import { Layout as DashboardLayout } from "../../../../../layouts/index.js";
import { useForm, useWatch } from "react-hook-form";
import { useSettings } from "../../../../../hooks/use-settings";
import { useEffect } from "react";
import { ApiGetCall } from "../../../../../api/ApiCall";
import { useRouter } from "next/router";

import AzureBillingAddMapping from "../../../../../components/CippFormPages/AzureBillingAddMapping";

const Page = () => {
  const router = useRouter();
  const { mappingId } = router.query;
  const mapSettingsDefaults = useSettings();

  const formControl = useForm({
    mode: "onBlur",
    defaultValues: {
      tenantFilter: mapSettingsDefaults.currentTenant,
    },
  });


  const billingMappingCall = ApiGetCall({
    url: `/api/GetAzureBillingMapping`,
    data: {
      mappingId: mappingId
    },
    queryKey: `GetMapping-${mappingId}`
  });


  useEffect(() => {
    if (billingMappingCall.isSuccess && billingMappingCall.data) {      
      formControl.setValue("azSubscriptionId", billingMappingCall.data.Subscription);
      formControl.setValue("psaBillingCode", billingMappingCall.data.billingcode);
      formControl.setValue("psaAppendGroup", billingMappingCall.data.appendGroup);
      formControl.setValue("psaCustId", billingMappingCall.data.company);
      formControl.setValue("psaSumGroup", billingMappingCall.data.sumGroup);
      formControl.setValue("psaBillableToAcct", billingMappingCall.data.billable);
      formControl.setValue("chargeName", billingMappingCall.data.chargeName);
      formControl.setValue("psaContractId", billingMappingCall.data.contract);
      formControl.setValue("azResourceGroup", billingMappingCall.data.ResourceGroup);
      formControl.setValue("psaMarkupPct", billingMappingCall.data.markup);
      formControl.setValue("mappingKey", mappingId);
    }
  }, [billingMappingCall.isSuccess, billingMappingCall.data])

  const formValues = useWatch({ control: formControl.control, name: "mapProperties" });

  // useEffect(() => {
  //   if (formValues) {
  //     const { userPrincipalName, usageLocation, ...restFields } = formValues.addedFields || {};
  //     let newFields = { ...restFields };

  //     newFields.tenantFilter = mapSettingsDefaults.currentTenant;

  //     formControl.reset(newFields);
  //   }
  // }, [formValues]);

  return (
    <>
      <CippFormPage
        queryKey={`Billing-${mapSettingsDefaults.currentTenant}`}
        formControl={formControl}
        title="Azure Billing Map"
        backButtonTitle="Billing Overview"
        postUrl="/api/AddBillingMapping"
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
