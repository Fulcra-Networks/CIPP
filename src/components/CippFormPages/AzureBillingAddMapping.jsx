import { Alert, InputAdornment, Typography, Button, SvgIcon } from "@mui/material";
import { Save } from "@mui/icons-material";
import CippFormComponent from "/src/components/CippComponents/CippFormComponent";
import { CippFormCondition } from "/src/components/CippComponents/CippFormCondition";
import { Grid } from "@mui/system";
import { ApiGetCall } from "../../api/ApiCall";
import { useSettings } from "../../hooks/use-settings";
import { useWatch, useFormState } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AzureBillingAddMapping = (props) => {
  const { formControl, userSettingsDefaults, formType = "add" } = props;
  const tenantDomain = useSettings().currentTenant;
  const router = useRouter();
  const { userId } = router.query;

  const custIDWatch = useWatch({ control: formControl.control, name: "psaCustId" });  

  useEffect(() => {
    // Only reset if there's a value in psaContractId
    if (formControl.getValues("psaContractId") && formControl.getValues("psaCustId")) {
      formControl.setValue("psaContractId", null); // or [] if multiple
      custContractCall.refetch();
    }
  }, [custIDWatch, formControl]);

  const custContractCall = ApiGetCall({
    url: "/api/ListPSACompanyContracts",
    waiting: !!custIDWatch,
    enabled: !!custIDWatch,
    queryKey: `GetCompanyContract-${custIDWatch?.value}`,
    data:{
      companyId: custIDWatch?.value
    },
    // onResult:(data)=>{console.log(data)}
  });

  return (
    <>
      <Typography variant="body2" paragraph style={{ marginTop: "1em" }}>
        ATTENTION: BILLING CODES ARE UNDER/MIS-USED. (Allocation code & Charge Name)
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ md: 6, xs: 12 }}>
          <CippFormComponent
            type="textField"
            fullWidth
            validators={{ required: "Azure Subscription ID is required" }}
            label="Subscription ID"
            name="azSubscriptionId"
            formControl={formControl}
          />
        </Grid>
        <Grid item size={{ md: 6, xs: 12 }}>
          <CippFormComponent
            type="textField"
            fullWidth
            validators={{ required: "Azure Resource group is required" }}
            label="Resource Group"
            name="azResourceGroup"
            formControl={formControl}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <CippFormComponent
            type="autoComplete"
            fullWidth
            label="PSA Customer"
            validators={{ required: "A Company must be selected" }}
            name="psaCustId"
            formControl={formControl}
            multiple={false}
            creatable={false}
            api={{
              url: "/api/ListPSACompanies",
              labelField: (option) =>
                `${option.companyName}`,
              valueField: "id",
              queryKey: `ListPSACompanies-${userSettingsDefaults?.currentTenant ?? undefined}`
            }}
          />
        </Grid>        
        <Grid item size={{ xs: 12 }}>
          <CippFormComponent
            type="autoComplete"
            fullWidth
            label="PSA Contract ID"
            placeholder="Microsoft Subscriptions"
            validators={{required: "A contract must be selected"}}
            name="psaContractId"      
            multiple={false}
            disabled={!custIDWatch}
            formControl={formControl}
            isFetching={custContractCall.isFetching}
            options={
              custContractCall?.data?.map((contract) => ({
                value: contract.id,
                label: contract.contractName,
              })) || []
            }
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
         <CippFormComponent
            type="autoComplete"
            fullWidth
            label="PSA Billing Code"
            validators={{ required: "A Billing Code must be selected" }}
            name="psaBillingCode"
            formControl={formControl}
            multiple={false}
            creatable={false}
            api={{
              url: "/api/ListPSABillingCodes",
              labelField: (option) =>
                `${option.name}`,
              valueField: "id",
              queryKey: `ListPSABillCodes-${userSettingsDefaults?.currentTenant ?? undefined}`
            }}
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
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            formControl={formControl}
            defaultValue={0}
          />
        </Grid>        
      </Grid>
    </>
  );
};

export default AzureBillingAddMapping;
