import { Alert, InputAdornment, Typography } from "@mui/material";
import CippFormComponent from "/src/components/CippComponents/CippFormComponent";
import { CippFormCondition } from "/src/components/CippComponents/CippFormCondition";
import { CippFormDomainSelector } from "/src/components/CippComponents/CippFormDomainSelector";
import { Grid } from "@mui/system";
import { ApiGetCall } from "../../api/ApiCall";
import { useSettings } from "../../hooks/use-settings";
import { useWatch } from "react-hook-form";
import { use, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

const AzureBillingAddMapping = (props) => {
  const { formControl, userSettingsDefaults, formType = "add" } = props;
  const tenantDomain = useSettings().currentTenant;
  const router = useRouter();
  const { userId } = router.query;
  const integrationSettings = ApiGetCall({
    url: "/api/ListExtensionsConfig",
    queryKey: "ListExtensionsConfig",
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Get all groups the is the user is a member of
  // const userGroups = ApiGetCall({
  //   url: `/api/ListUserGroups?userId=${userId}&tenantFilter=${tenantDomain}`,
  //   queryKey: `User-${userId}-Groups-${tenantDomain}`,
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   waiting: !!userId,
  // });

  // // Get all groups for the tenant
  // const tenantGroups = ApiGetCall({
  //   url: `/api/ListGroups?tenantFilter=${tenantDomain}`,
  //   queryKey: `ListGroups-${tenantDomain}`,
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   waiting: !!userId,
  // });

  // Make new list of groups by removing userGroups from tenantGroups
  // const filteredTenantGroups = useMemo(() => {
  //   if (tenantGroups.isSuccess && userGroups.isSuccess) {
  //     const tenantGroupsList = tenantGroups?.data || [];

  //     return tenantGroupsList.filter(
  //       (tenantGroup) => !userGroups?.data?.some((userGroup) => userGroup.id === tenantGroup.id)
  //     );
  //   }
  //   return [];
  // }, [tenantGroups.isSuccess, userGroups.isSuccess, tenantGroups.data, userGroups.data]);

  const watcher = useWatch({ control: formControl.control });
  // useEffect(() => {
  //   //if watch.firstname changes, and watch.lastname changes, set displayname to firstname + lastname
  //   if (watcher.givenName && watcher.surname && formType === "add") {
  //     formControl.setValue("displayName", `${watcher.givenName} ${watcher.surname}`);
  //   }
  // }, [watcher.givenName, watcher.surname]);

  return (
    <Grid container spacing={2}>
      <Grid item size={{ md: 6, xs: 12 }}>
        <CippFormComponent
          type="number"
          fullWidth
          label="Subscription ID"
          name="azSubscriptionId"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ md: 6, xs: 12 }}>
        <CippFormComponent
          type="textField"
          fullWidth
          label="Resource Group"
          name="azResourceGroup"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ xs: 12 }}>
        <CippFormComponent
          type="number"
          fullWidth
          label="PSA Customer ID"
          name="psaCustId"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ md: 6, xs: 12 }}>
        <CippFormComponent
          type="number"
          fullWidth
          label="PSA Allocation Code ID"
          InputProps={{
            endAdornment: <InputAdornment position="end">@</InputAdornment>,
          }}
          name="psaAllocId"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ md: 6, xs: 12 }}>
        <CippFormComponent
          type="textField"
          fullWidth
          label="PSA Charge Name"
          name="psaChargeName"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ xs: 12 }}>
        <CippFormComponent
          type="number"
          fullWidth
          label="PSA Contract ID"
          placeholder="123456"
          name="psaContractId"
          formControl={formControl}
        />
      </Grid>

      <Grid item size={{ xs: 12 }}>
        <Typography variant="h6">Settings</Typography>
      </Grid>
      <Grid item size={{ xs: 6 }}>
        <CippFormComponent
          type="switch"
          label="Billable To Account"
          name="psaBillableToAcct"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ xs: 6 }}>
        <CippFormComponent
          type="switch"
          label="Append Group"
          name="psaAppendGroup"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ xs: 6 }}>
        <CippFormComponent
          type="switch"
          label="Sum Group"
          name="psaSumGroup"
          formControl={formControl}
        />
      </Grid>
      <Grid item size={{ xs: 6}}>
        <CippFormComponent
          type="number"
          label="Markup Percent"
          name="psaMarkupPct"
          placeholder="0.1"
          formControl={formControl}
          defaultValue={0}
        />
      </Grid>
    </Grid>
  );
};

export default AzureBillingAddMapping;
