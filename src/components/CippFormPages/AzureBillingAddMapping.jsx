import { Alert, InputAdornment, Typography, Button, SvgIcon } from "@mui/material";
import { Save } from "@mui/icons-material";
import CippFormComponent from "/src/components/CippComponents/CippFormComponent";
import { CippFormCondition } from "/src/components/CippComponents/CippFormCondition";
import { Grid } from "@mui/system";
import { ApiGetCall } from "../../api/ApiCall";
import { useSettings } from "../../hooks/use-settings";
import { useWatch, useFormState } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AzureBillingAddMapping = (props) => {
  const { formControl, userSettingsDefaults, formType = "add" } = props;
  const tenantDomain = useSettings().currentTenant;
  const router = useRouter();
  const { userId } = router.query;
  //This will be null on "Create" but "Edit" it will have a value.
  const [currentCust, setCurrentCustId] = useState(formControl.getValues("psaCustId"));

  const custIDWatch = useWatch({ control: formControl.control, name: "psaCustId" });

  //Refetches appropriate contracts for the selected customer.
  useEffect(() => {
    if (formControl.getValues("psaCustId") != currentCust) {
      setCurrentCustId(formControl.getValues("psaCustId"));
      formControl.setValue("psaContractId", null); // or [] if multiple
      custContractCall.refetch();
    }
  }, [custIDWatch]);

  const custContractCall = ApiGetCall({
    url: "/api/ListPSACompanyContracts",
    waiting: !!custIDWatch,
    enabled: !!custIDWatch,
    queryKey: `GetCompanyContract-${custIDWatch?.value}`,
    data: {
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
            label="Subscription ID"
            type="autoComplete"
            fullWidth
            validators={{ required: "Azure Subscription ID is required" }}
            name="azSubscriptionId"
            formControl={formControl}
            multiple={false}
            api={{
              url: "/api/ListAzureBillingCompanies",
              labelField: (option) =>
                `${option.CompanyName} - ${option.Reference}`,
              valueField: "Reference",
              queryKey: `ListAzCompanies-${userSettingsDefaults?.currentTenant ?? undefined}`
            }}
          />
        </Grid>
        <Grid item size={{ md: 6, xs: 12 }}>
          <CippFormComponent
            label="Resource Group"
            type="textField"
            fullWidth
            validators={{ required: "Azure Resource group is required" }}
            name="azResourceGroup"
            formControl={formControl}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <CippFormComponent
            label="PSA Customer"
            type="autoComplete"
            fullWidth
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
            label="PSA Contract ID"
            type="autoComplete"
            fullWidth
            placeholder="Microsoft Subscriptions"
            validators={{ required: "A contract must be selected" }}
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
            label="PSA Billing Code"
            type="autoComplete"
            fullWidth
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
            label="Billable To Account"
            type="switch"
            name="psaBillableToAcct"
            formControl={formControl}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <CippFormComponent
            label="Append Group"
            type="switch"
            name="psaAppendGroup"
            formControl={formControl}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <CippFormComponent
            label="Sum Group"
            type="switch"
            name="psaSumGroup"
            formControl={formControl}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <CippFormComponent
            label="Markup Percent"
            type="number"
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
