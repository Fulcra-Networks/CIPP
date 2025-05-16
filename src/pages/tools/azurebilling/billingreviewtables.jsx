import { CippFormComponent } from "/src/components/CippComponents/CippFormComponent";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import { CippWizardStepButtons } from "/src/components/CippWizard/CippWizardStepButtons";
import { PropertyList } from "/src/components/property-list";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";
import { PropertyListItem } from "/src/components/property-list-item";

//const apiUrl = "/api/ExecGetAzureBillingCharges"

function toCurrency(numberString) {
  let number = parseFloat(numberString);
  return number.toFixed(2).toLocaleString('USD');
}


const testMapped = [
  {
    "cost": 74.0212822,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "BACKUP-365",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 82.9370132,
    "vendor": "Arrow",
    "join": "XSP2025281 - BACKUP-365"
  },
  {
    "cost": 412.9840019,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "TNS-AGILERX-DEV",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 462.7271715,
    "vendor": "Arrow",
    "join": "XSP2025281 - TNS-AGILERX-DEV"
  },
  {
    "cost": 1521.0924267,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "INTERNAL",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 1704.3052468,
    "vendor": "Arrow",
    "join": "XSP2025281 - INTERNAL"
  },
  {
    "cost": 196.3602962,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "BUILDBOXES",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 220.011512,
    "vendor": "Arrow",
    "join": "XSP2025281 - BUILDBOXES"
  },
  {
    "cost": 0.5364522,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "CLOUD-SHELL-STORAGE-EASTUS",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 0.6010663,
    "vendor": "Arrow",
    "join": "XSP2025281 - CLOUD-SHELL-STORAGE-EASTUS"
  },
  {
    "cost": 3.3141493,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "AWS-MIGRATION",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 3.7133342,
    "vendor": "Arrow",
    "join": "XSP2025281 - AWS-MIGRATION"
  },
  {
    "cost": 0.508753,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "IOTC",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 0.5700314,
    "vendor": "Arrow",
    "join": "XSP2025281 - IOTC"
  },
  {
    "cost": 383.775,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "MARKETPLACE-B2FF25A7DDDD474AB5288CD79F59CFDB",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 430,
    "vendor": "Arrow",
    "join": "XSP2025281 - MARKETPLACE-B2FF25A7DDDD474AB5288CD79F59CFDB"
  },
  {
    "cost": 0,
    "subscriptionId": "XSP2025281",
    "customerId": "XSP257363",
    "Resource Group": "NETWORKWATCHERRG",
    "chargeDate": "03/28/2025",
    "customer": "TENSENTRIC INC.",
    "price": 0,
    "vendor": "Arrow",
    "join": "XSP2025281 - NETWORKWATCHERRG"
  },
  {
    "cost": 62.0382454,
    "subscriptionId": "XSP4389672",
    "customerId": "XSP257369",
    "Resource Group": "TESTRESULTS",
    "chargeDate": "03/28/2025",
    "customer": "Cylinder Testing Solutions",
    "price": 69.5106442,
    "vendor": "Arrow",
    "join": "XSP4389672 - TESTRESULTS"
  },
  {
    "cost": 0,
    "subscriptionId": "XSP4389672",
    "customerId": "XSP257369",
    "Resource Group": "IMPORTTRIGGER",
    "chargeDate": "03/28/2025",
    "customer": "Cylinder Testing Solutions",
    "price": 0,
    "vendor": "Arrow",
    "join": "XSP4389672 - IMPORTTRIGGER"
  },
  {
    "cost": 429.7216766,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "LIBRA",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 481.4808759,
    "vendor": "Arrow",
    "join": "XSP4389692 - LIBRA"
  },
  {
    "cost": 120.3128627,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "STORAGE",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 134.8043335,
    "vendor": "Arrow",
    "join": "XSP4389692 - STORAGE"
  },
  {
    "cost": 168.0537577,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "PORTAL",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 188.295527,
    "vendor": "Arrow",
    "join": "XSP4389692 - PORTAL"
  },
  {
    "cost": 0.0126539,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "INFRASTRUCTURE",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 0.0141792,
    "vendor": "Arrow",
    "join": "XSP4389692 - INFRASTRUCTURE"
  },
  {
    "cost": 228.9899563,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "SQL",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 256.5713821,
    "vendor": "Arrow",
    "join": "XSP4389692 - SQL"
  },
  {
    "cost": 0.3867909,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "365BACKUP",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 0.433379,
    "vendor": "Arrow",
    "join": "XSP4389692 - 365BACKUP"
  },
  {
    "cost": 0.5913219,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "NEBULA",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 0.6625452,
    "vendor": "Arrow",
    "join": "XSP4389692 - NEBULA"
  },
  {
    "cost": 481.0575,
    "subscriptionId": "XSP4389692",
    "customerId": "XSP257375",
    "Resource Group": "MARKETPLACE-F0D23CF6FF6940B4A6A2E9C8A41EC4D1",
    "chargeDate": "03/28/2025",
    "customer": "Greysand Finance, LLC",
    "price": 539,
    "vendor": "Arrow",
    "join": "XSP4389692 - MARKETPLACE-F0D23CF6FF6940B4A6A2E9C8A41EC4D1"
  },
  {
    "cost": 403.4267321,
    "subscriptionId": "XSP4389688",
    "customerId": "XSP313277",
    "Resource Group": "BIOTRACKHOSTING",
    "chargeDate": "03/28/2025",
    "customer": "The Happy Camper, LLC",
    "price": 452.0187452,
    "vendor": "Arrow",
    "join": "XSP4389688 - BIOTRACKHOSTING"
  },
  {
    "cost": 157.351147,
    "subscriptionId": "XSP4389688",
    "customerId": "XSP313277",
    "Resource Group": "CBB",
    "chargeDate": "03/28/2025",
    "customer": "The Happy Camper, LLC",
    "price": 176.3038068,
    "vendor": "Arrow",
    "join": "XSP4389688 - CBB"
  },
  {
    "cost": 47.2983165,
    "subscriptionId": "XSP4389696",
    "customerId": "XSP313532",
    "Resource Group": "CBB",
    "chargeDate": "03/28/2025",
    "customer": "Williams and Company, LLC",
    "price": 52.9953151,
    "vendor": "Arrow",
    "join": "XSP4389696 - CBB"
  },
  {
    "cost": 5.2421752,
    "subscriptionId": "XSP4389668",
    "customerId": "XSP372867",
    "Resource Group": "CBB",
    "chargeDate": "03/28/2025",
    "customer": "Affleck & Co., P.C.",
    "price": 5.8735868,
    "vendor": "Arrow",
    "join": "XSP4389668 - CBB"
  }
]


export const BillingReviewMapped = (props) => {
  const {
    formControl,
    onPreviousStep,
    onNextStep,
    currentStep
  } = props;

  const colMappedCharges = [
    {
      accessorKey:'customer',
      id:'customer',
      header:'customer',
    },
    {
      accessorKey: 'price',
      id: 'price',
      header: 'price',
      aggregationFn: 'sum',
      AggregatedCell: ({cell})=> <div>Total Price: ${toCurrency(cell.getValue())}</div>,
      Cell: ({ cell }) => (
        <span>${toCurrency(cell.getValue())}</span>
      ),

    },
    {
      accessorKey: 'Resource Group',
      id: 'Resource Group',
      header: 'Resource Group',
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
      accessorKey:'chargeDate',
      id:'chargeDate',
      header:'chargeDate',
    },
    {
      accessorKey:'customerId',
      id:'customerId',
      header:'customerId',
    },
    
    {
      accessorKey: 'subscriptionId',
      id: 'subscriptionId',
      header: 'subscriptionId',
    },
    {
      header: 'Vendor',
      id: 'vendor',
      accessorKey: 'vendor'
    }
  ];

  const entries=Object.entries(formControl.getValues());
  const selectedDate = entries.find(([key])=>key==="datetime")[1];
  const billingMonth = new Date(selectedDate * 1000).toISOString().split("T")[0].replace(/-/g, "")
  const rerunJob = entries.find(([key])=>key==="rerunJob")[1];

  return (
    <Stack spacing={2}>
      <CippDataTable
        width={"100%"}
        title={"Mapped Charges"}
        simple={false}
        defaultSorting={['customer']}
        //data={testMapped}
        columns={colMappedCharges}
        useGrouping={true}
        useGroupedColumns={['customer']}
        api={{
          url: `/api/ExecGetAzureBillingCharges?date=${billingMonth}&rerunJob=${rerunJob}`,
        }}
      />         
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

  const colUnmappedCharges = [
    'chargeDate',
    'customerId',
    'customer',
    'subscriptionId',
    'Resource Group',
    'price',
    'cost'
  ];

  const entries=Object.entries(formControl.getValues());
  const selectedDate = entries.find(([key])=>key==="datetime")[1];
  const billingMonth = new Date(selectedDate * 1000).toISOString().split("T")[0].replace(/-/g, "")

  return (
    <Stack spacing={2}>          
      <CippDataTable
        title={"Unmapped Charges"}
        simpleColumns={colUnmappedCharges}
        api={{
          url: `/api/ExecGetAzureUnmappedCharges?date=${billingMonth}`,
        }}
      />
      <CippWizardStepButtons
        formControl={formControl}
        currentStep={currentStep}
        onPreviousStep={onPreviousStep}
        onNextStep={onNextStep}
      />
    </Stack>
  );
}