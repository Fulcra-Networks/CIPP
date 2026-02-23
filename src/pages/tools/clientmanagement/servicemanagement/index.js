/** Concept
 * 1. Pulls assets from the PSA, and NAble integration (halo/ninja later?)
 *    Possibly pull Intune/Autopilot devices for 3-way correlation
 *    If showing Intune/Autopilot - We can then ensure loggedin user == assigned user
 * 2. Shows assets in PSA & RMM assets which are not related in another table
 * 3. Show configured "Managed PCs" groups (maybe count)
 *    (Widgets above the tables?)
 */

import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Card,
  Button,
  Container,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  CardContent,
  Chip,
  Skeleton
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import CippButtonCard from "../../../../components/CippCards/CippButtonCard";
import CippFormComponent from "../../../../components/CippComponents/CippFormComponent";
import { ApiGetCall } from "../../../../api/ApiCall";
import { useSettings } from "../../../../hooks/use-settings";
import { useRouter } from "next/router";
import { CippDataTable } from "../../../../components/CippTable/CippDataTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Grid } from "@mui/system";
import { CippInfoBar } from "../../../../components/CippCards/CippInfoBar";
import { getCippFormatting } from "../../../../utils/get-cipp-formatting";


const AssetManagement = () => {
  const currentTenant = useSettings().currentTenant;
  const [groupDataReady, setGroupDataReady] = useState(false);

  //This should contain the following data:
  // License Count, User Service Count*, PC count rmm/psa/intune
  const INFO_BAR_TEST = [
    { name: "test1", data: currentTenant },
    {
      name: "test2", data: (
        <Chip variant="outlined" label="Bad Test" size="small" color="warning" />
      )
    },
    {
      name: "test3", data: (
        <Chip variant="outlined" label="Bad Test" size="small" color="error" />
      )
    },
    {
      name: "test4", data: (
        <Chip variant="outlined" label="Good Test" size="small" color="success" />
      )
    }
  ];

  const TEST_GROUP_ID = "d3d34bf6-624f-44f6-9ead-26e3ed0bd965";

  // const matchedDevs = ApiGetCall({
  //   url: "/api/ServiceManagement",
  //   data: { tenantFilter: currentTenant }, //Data is {paramName: paramValue}
  //   queryKey: "ExecAssetManagement-Matched",
  // });

  const psaMapping = ApiGetCall({
    url: "/api/ExecExtensionMapping",
    data: {
      List: "Autotask",
    },
    queryKey: `ServiceManagement-${currentTenant}`,
  });


  //TODO: Add license group to PSA Mapping data
  //TODO: Get license group from table
  const groupInfo = ApiGetCall({
    url: `/api/ListGroups?groupID=${TEST_GROUP_ID}&tenantFilter=${currentTenant}&members=true&owners=true&groupType=Microsoft 365`,
    queryKey: `ListGroups-${TEST_GROUP_ID}`,
    waiting: groupDataReady,
  });

  useEffect(() => {
    if (psaMapping.isSuccess) {
      setGroupDataReady(true);
    }
  });


  const serviceColumns = [
    {
      accessorKey: 'customer',
      id: 'customer',
      header: 'Client'
    },
    {
      accessorKey: 'countPSAUser',
      id: 'countPSAUser',
      header: 'PSA User Count'
    },
    {
      accessorKey: 'countMSUser',
      id: 'countMSUser',
      header: 'MS Licensed Users',
    },
    {
      accessorKey: 'countPSADev',
      id: 'countPSADev',
      header: 'PSA PC Count'
    },
    {
      accessorKey: 'countRMMDev',
      id: 'countRMMDev',
      header: 'RMM PC Count'
    }
  ];

  //useEffect(() => {});
  return (
    <>
      <Head>Client Services</Head>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid size={{ md: 12, xs: 12 }}>
              <Card>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                  <p>Probably a banner bar.</p>
                  <Box sx={{ flex: 1 }}><p>Box in bar</p></Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ md: 12, xs: 12 }}>
              {groupInfo.isFetching ? <Skeleton width={"100%"} /> : (
                <CippInfoBar data={INFO_BAR_TEST} isFetching={false} />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

AssetManagement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AssetManagement;