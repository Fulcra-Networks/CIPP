import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippTablePage } from "/src/components/CippComponents/CippTablePage.jsx";
import { CopyAll, Delete, PlayArrow, AddBox, Edit, ContentCopy } from "@mui/icons-material";



/**
 * GET returns list of mappings with the following properties:
 * {
 *  key=PartitionKey+RowKey of the mapping
 *  cust=Customer the mapping applies to
 *  contr=Contract the mapping uses
 *  billTo=T/F billable to account
 *  markup=% markup
 *  rgName=Resource group the mapping applies to
 * }
 * @returns 
 */

const Page = () => {

  const tblSimpleCols = [
    "Customer",
    "Billable",
    "Resource Group",
    "Contract",
    "Markup"
  ];

  const actions = [
    {
      label: "Edit",
      icon: <Edit />,
      link: "/tools/azurebilling/managemapping/update?mappingId=[key]"
    },
    {
      label: "Disable Mapping",
      type: "GET",
      url: "/api/ExecDisableMapping",
      icon: <Delete />,
      data: {
        TemplateId: "GUID",
      },
      confirmText: "Are you sure you want to disable this mapping?",
      multiPost: false,
    },
  ];

  return (
    <>
      <CippTablePage
        tenantInTitle={false}
        title={"Azure Billing Mappings"}
        actions={actions}
        apiUrl="/api/ListAzureBillingMappings"
        simpleColumns={tblSimpleCols}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;