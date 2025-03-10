/** Concept
 * 1. Pulls assets from the PSA, and NAble integration (halo/ninja later?)
 *    Possibly pull Intune/Autopilot devices for 3-way correlation
 *    If showing Intune/Autopilot - We can then ensure loggedin user == assigned user
 * 2. Shows assets in PSA & RMM assets which are not related in another table
 * 3. Show configured "Managed PCs" groups (maybe count)
 *    (Widgets above the tables?)
 */

import { Container, Grid, Box, Skeleton } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import CippButtonCard from "/src/components/CippCards/CippButtonCard";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";
import { ApiGetCall, ApiPostCall } from "/src/api/ApiCall";
import { useSettings } from "../../../hooks/use-settings";


const Page = () => {
  const { currentTenant } = useSettings();
  const [tableDataMatch, setTableDataMatch] = useState([]);
  const [tableDataPSA,   setTableDataPSA] = useState([]);
  const [tableDataRMM,   setTableDataRMM] = useState([]);

  const matchedDevs = ApiGetCall({
    url: "/api/ExecAssetManagement",
    data: { tenantFilter: currentTenant }, //Data is {paramName: paramValue}
    queryKey: "ExecAssetManagement-Matched",
  });

  useEffect(() => {
    if (matchedDevs.isSuccess) {
      setTableDataMatch(matchedDevs.data.MatchedDevices ?? []);
      setTableDataPSA(matchedDevs.data.UnmatchedPSADevices ?? []);
      setTableDataRMM(matchedDevs.data.UnmatchedRMMDevices ?? []);
    }
  }, [matchedDevs.isSuccess]);

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
          {matchedDevs.isSuccess ? ( 
          <CippDataTable
            noCard={false}
            title="PSA & RMM Matched Assets"
            data={tableDataMatch}
            simple={false}
            refreshFunction={() => matchedDevs.refetch()}
          />
        ) : ( 
          <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={300} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
        )}
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {/*Note: The API call should return psa unmatched*/}
          {matchedDevs.isSuccess ? (
          <CippDataTable
            noCard={false}
            title="PSA Unmatched Assets"
            data={tableDataPSA}
            simple={false}
            refreshFunction={() => matchedDevs.refetch()}
          />
          ): (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={300} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {/*Note: The API call should return rmm unmatched*/}
          {matchedDevs.isSuccess ? (
          <CippDataTable
            noCard={false}
            title="RMM Unmatched Assets"
            data={tableDataRMM}
            simple={false}
            refreshFunction={() => matchedDevs.refetch()}
          />
          ) : ( 
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Skeleton variant="rectangular" height={300} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

Page.getLayout = (page) => <DashboardLayout allTenantsSupport={false}>{page}</DashboardLayout>;
export default Page;