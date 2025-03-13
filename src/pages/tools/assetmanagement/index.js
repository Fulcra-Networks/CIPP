/** Concept
 * 1. Pulls assets from the PSA, and NAble integration (halo/ninja later?)
 *    Possibly pull Intune/Autopilot devices for 3-way correlation
 *    If showing Intune/Autopilot - We can then ensure loggedin user == assigned user
 * 2. Shows assets in PSA & RMM assets which are not related in another table
 * 3. Show configured "Managed PCs" groups (maybe count)
 *    (Widgets above the tables?)
 */

import React, { useEffect, useState } from "react";
import { Grid, Container } from "@mui/material";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import CippButtonCard from "/src/components/CippCards/CippButtonCard";
import { ApiGetCall  } from "/src/api/ApiCall";
import { useSettings } from "/src/hooks/use-settings";
import { useRouter } from "next/router";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";


const AssetManagement = () => {
  const router = useRouter();
  const currentTenant = useSettings().currentTenant;
  const [tableDataMatch, setTableDataMatch] = useState([]);
  const [tableDataPSA,   setTableDataPSA] = useState([]);
  const [tableDataRMM,   setTableDataRMM] = useState([]);
  const columns = [
    'Name',
    'Contract',
    'SerialNumber',
    'PSAId',
    'RMMId',
    'RMMName'
  ]

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
  }, [router.query, currentTenant, matchedDevs.isSuccess]);

  return (
    <Container>
      <CippButtonCard title="Asset Management"/>

      <CippDataTable
        title="PSA & RMM Matched Assets"
        data={tableDataMatch}
        simpleColumns={columns}
        isFetching={matchedDevs.isFetching}
      />
      
      <Grid item xs={12} md={6} lg={6}>
        <CippDataTable
          noCard={false}
          title="PSA Unmatched Assets"
          data={tableDataPSA}
          simpleColumns={columns}
          isFetching={matchedDevs.isFetching}
        />
                  
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <CippDataTable
          noCard={false}
          title="RMM Unmatched Assets"
          data={tableDataRMM}
          simpleColumns={columns}
          isFetching={matchedDevs.isFetching}
        />
      </Grid>
    </Container>
  );
};

AssetManagement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AssetManagement;