/** Concept
 * 1. Pulls assets from the PSA, and NAble integration (halo/ninja later?)
 *    Possibly pull Intune/Autopilot devices for 3-way correlation
 *    If showing Intune/Autopilot - We can then ensure loggedin user == assigned user
 * 2. Shows assets in PSA & RMM assets which are not related in another table
 * 3. Show configured "Managed PCs" groups (maybe count)
 *    (Widgets above the tables?)
 */

import { Container, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import CippButtonCard from "/src/components/CippCards/CippButtonCard";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";
import { ApiGetCall, ApiPostCall } from "/src/api/ApiCall";
import { useSettings } from "../../../hooks/use-settings";

const Page = () => {
  const { currentTenant } = useSettings();

  // const matchedDevs = ApiGetCall({
  //   url: "/api/ExecAssetManagement",
  //   data: { tenantFilter: currentTenant }, //Data is {paramName: paramValue}
  //   queryKey: "ExecAssetManagement-Matched",
  // });

  return (
    <Container sx={{ pt: 3 }} maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CippButtonCard
            title="Asset Management"
          ></CippButtonCard>
        </Grid>
        <Grid item xs={12}>
          {/*Note: The API call should return "Matched"*/}
          <CippDataTable
            noCard={false}
            title="PSA & RMM Matched Assets"
            data={[{
              PSA: "Test",
              RMM: "Test",
            }]}
            simple={false}
            simpleColumns={["PSA", "RMM"]}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {/*Note: The API call should return psa unmatched*/}
          <CippDataTable
            noCard={false}
            title="PSA Unmatched Assets"
            data={[{
              PSA: "Test",
              RMM: "Test",
            }]}
            simple={false}
            simpleColumns={["PSA", "RMM"]}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {/*Note: The API call should return rmm unmatched*/}
          <CippDataTable
            noCard={false}
            title="RMM Unmatched Assets"
            data={[{
              PSA: "Test",
              RMM: "Test",
            }]}
            simple={false}
            simpleColumns={["PSA", "RMM"]}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

Page.getLayout = (page) => <DashboardLayout allTenantsSupport={false}>{page}</DashboardLayout>;
export default Page;