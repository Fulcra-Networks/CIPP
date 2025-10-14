import { CippFormComponent } from "/src/components/CippComponents/CippFormComponent";
import { useForm } from "react-hook-form";
import { Stack, Skeleton, Typography } from "@mui/material";
import { CippWizardStepButtons } from "/src/components/CippWizard/CippWizardStepButtons";
import { PropertyList } from "/src/components/property-list";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";
import { PropertyListItem } from "/src/components/property-list-item";
import { useMemo, useState, useEffect, use } from "react";
import { ApiGetCall } from "../api/ApiCall";


function toCurrency(numberString) {
  let number = parseFloat(numberString);
  return number.toFixed(2).toLocaleString('USD');
}

export const BillingReviewMapped = (props) => {
  const [columnsReady, setColumnsReady] = useState(false);
  const [mappedColumns, setMappedColumns] = useState([]);

  const {
    formControl,
    onPreviousStep,
    onNextStep,
    currentStep
  } = props;

  const entries = Object.entries(formControl.getValues());
  const selectedDate = entries.find(([key]) => key === "billMonth")[1];
  const billingMonth = new Date(selectedDate * 1000).toISOString().split("T")[0].replace(/-/g, "")
  const rerunJob = entries.find(([key]) => key === "rerunJob")[1];

  const billingMappedCall = ApiGetCall({
    url: `/api/ExecGetAzureBillingCharges?billMonth=${billingMonth}&rerunJob=${rerunJob}`,
    queryKey: `ListMapped-${billingMonth}`
  });

  useEffect(() => {
    if (billingMappedCall.isSuccess && !columnsReady) {
      const price = billingMappedCall.data.rows.reduce((acc, row) => acc + row.price, 0);
      formControl.setValue("billingMonth", `${new Date(selectedDate * 1000).toISOString('yyyy-MM')}`);
      formControl.setValue("totalToBill", `$${toCurrency(price)}`);

      setMappedColumns([
        {
          accessorKey: 'customer',
          id: 'customer',
          header: 'Customer'
        },
        {
          accessorKey: 'price',
          id: 'price',
          header: 'Price',
          Footer: () => <div>Total: ${toCurrency(price)}</div>,
          aggregationFn: 'sum',
          AggregatedCell: ({ cell }) => <div>Total Price: ${toCurrency(cell.getValue())}</div>,
          Cell: ({ cell }) => (
            <span>${toCurrency(cell.getValue())}</span>
          )
        },
        {
          accessorKey: 'Resource Group',
          id: 'Resource Group',
          header: 'Resource Group'
        },
        {
          accessorKey: 'cost',
          id: 'cost',
          header: 'Cost',
          Cell: ({ cell }) => (
            <span>${toCurrency(cell.getValue())}</span>
          )
        },
        {
          accessorKey: 'chargeDate',
          id: 'chargeDate',
          header: 'Charge Date'
        },
        {
          accessorKey: 'customerId',
          id: 'customerId',
          header: 'Customer ID'
        },
        {
          accessorKey: 'subscriptionId',
          id: 'subscriptionId',
          header: 'Subscription ID'
        },
        {
          header: 'Vendor',
          id: 'vendor',
          accessorKey: 'vendor'
        },
        {
          header: 'atCustId',
          id: 'atCustId',
          accessorKey: 'atCustId'
        }
      ])
      setColumnsReady(true);
    }
  }, [billingMappedCall.isSuccess, billingMappedCall.data]);

  return (
    <Stack spacing={2}>
      {billingMappedCall.isSuccess && columnsReady ? (
        <>
          <Typography>
            Invoiced amount for previous month:<br/>
            ${ billingMappedCall.data.previousMonth }
          </Typography>
          <CippDataTable
            width={"100%"}
            title={"Mapped Charges"}
            data={billingMappedCall.data.rows}
            columns={mappedColumns}
            useGrouping={true}
            useStickyFooter={true}
            defaultSorting={['customer']}
            useGroupedColumns={['customer']}
            refreshFunction={() => billingMappedCall.refetch()}
          />
        </>
      ) : (
        <Skeleton variant="rectangular" width="100%" height={200} />
      )}

      <CippWizardStepButtons
        formControl={formControl}
        currentStep={currentStep}
        onPreviousStep={onPreviousStep}
        onNextStep={onNextStep}
      />
    </Stack>
  );
}

export const BillingReviewUnmapped = (props) => {
  const {
    formControl,
    onPreviousStep,
    onNextStep,
    currentStep
  } = props;

  const entries = Object.entries(formControl.getValues());
  const selectedDate = entries.find(([key]) => key === "billMonth")[1];
  const billingMonth = new Date(selectedDate * 1000).toISOString().split("T")[0].replace(/-/g, "")

  const [unmappedColumns, setColumns] = useState([]);
  const [columnsReady, setColumnsReady] = useState(false);

  const unmappedChargesCall = ApiGetCall({
    url: `/api/ExecGetAzureUnmappedCharges?billMonth=${billingMonth}`,
    queryKey: `ListUnMapped-${billingMonth}`
  });

  useEffect(() => {
    if (unmappedChargesCall.isSuccess && !columnsReady) {
      const aggPrice = unmappedChargesCall.data.reduce((acc, row) => acc + row.price, 0);
      console.log("Setting columns with " + aggPrice);
      setColumns([
        {
          accessorKey: 'customer',
          id: 'customer',
          header: 'Customer Name'
        },
        {
          accessorKey: 'price',
          id: 'price',
          header: 'Price',
          Footer: () => <div>Total: ${toCurrency(aggPrice)}</div>,
          aggregationFn: 'sum',
          AggregatedCell: ({ cell }) => <div>Total Price: ${toCurrency(cell.getValue())}</div>,
          Cell: ({ cell }) => (
            <span>${toCurrency(cell.getValue())}</span>
          ),
        },
        {
          accessorKey: 'Resource Group',
          id: 'Resource Group',
          header: 'Resource Group'
        },
        {
          accessorKey: 'cost',
          id: 'cost',
          header: 'Cost',
          Cell: ({ cell }) => (
            <span>${toCurrency(cell.getValue())}</span>
          ),
        },
        {
          accessorKey: 'chargeDate',
          id: 'chargeDate',
          header: 'Charge Date'
        },
        {
          accessorKey: 'customerId',
          id: 'customerId',
          header: 'Customer ID'
        },
        {
          accessorKey: 'subscriptionId',
          id: 'subscriptionId',
          header: 'Subscription Id'
        }
      ]);
      setColumnsReady(true);
      formControl.setValue("totalUnmapped", `$${toCurrency(aggPrice)}`);
    }
  });

  return (
    <Stack spacing={2}>
      {unmappedChargesCall.isSuccess && columnsReady ? (
        <>
          <CippDataTable
            title={"Unmapped Charges"}
            simple={false}
            defaultSorting={['customer']}
            data={unmappedChargesCall.data}
            columns={unmappedColumns}
            useGrouping={true}
            useStickyFooter={true}
            useGroupedColumns={['customer']}
            refreshFunction={() => unmappedChargesCall.refetch()}
          />
        </>
      ) : (
        <Skeleton variant="rectangular" width="100%" height={200} />

      )}
      <CippWizardStepButtons
        formControl={formControl}
        currentStep={currentStep}
        onPreviousStep={onPreviousStep}
        onNextStep={onNextStep}
      />
    </Stack>
  );
}