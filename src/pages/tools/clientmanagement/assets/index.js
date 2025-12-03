/** Concept
 * 1. Pulls assets from the PSA, and NAble integration (halo/ninja later?)
 *    Possibly pull Intune/Autopilot devices for 3-way correlation
 *    If showing Intune/Autopilot - We can then ensure loggedin user == assigned user
 * 2. Shows assets in PSA & RMM assets which are not related in another table
 * 3. Show configured "Managed PCs" groups (maybe count)
 *    (Widgets above the tables?)
 */

import React, { useEffect, useState } from "react";
import { 
  Grid,
  Button, 
  Container,
  Stack, 
  Tooltip, 
  IconButton,
  Typography  
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import CippButtonCard from "/src/components/CippCards/CippButtonCard";
import CippFormComponent from "/src/components/CippComponents/CippFormComponent";
import { ApiGetCall  } from "/src/api/ApiCall";
import { useSettings } from "/src/hooks/use-settings";
import { useRouter } from "next/router";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";


const AssetManagement = () => {
  const router = useRouter();
  const currentTenant = useSettings().currentTenant;
  const [tableDataINT, setTableDataINT] = useState([]);
  const [tableDataPSA,   setTableDataPSA] = useState([]);
  const [tableDataRMM,   setTableDataRMM] = useState([]);
  const columns = [
    'Name',
    'SerialNumber'
  ]
 

  const formControl = useForm({
    defaultValues: {
      name: "",
      style: "Table",
      Fields: [{ UseExistingInfo: false }],
    },
  });

  const matchedDevs = ApiGetCall({
    url: "/api/ExecAssetManagement",
    data: { tenantFilter: currentTenant }, //Data is {paramName: paramValue}
    queryKey: "ExecAssetManagement-Matched",
  });

  useEffect(() => {
    if (matchedDevs.isSuccess) {
      setTableDataINT(matchedDevs.data.assetsINT ?? []);
      setTableDataPSA(matchedDevs.data.assetsPSA ?? []);
      setTableDataRMM(matchedDevs.data.assetsRMM ?? []);
    }
  }, [router.query, currentTenant, matchedDevs.isSuccess]);

  return (
    <Container >
      <Stack spacing={2} sx={{ p: 3, mt: 1 }}>
        <CippButtonCard component="accordion" title="PSA Assets" accordionExpanded={true}>
          <Typography variant="h6" gutterBottom>
            Matched assets (via rmmID on PSA asset)
          </Typography>
          <Grid container spacing={2}>              
          <Grid item xs={6} sm={6} md={4}>
            <CippFormComponent
              label="Assets in PSA"
              name="style"
              type="select"
              options={tableDataPSA}
              formControl={formControl}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <CippFormComponent
              label="Unmatched RMM"
              name="style"
              type="select"
              options={tableDataRMM}
              formControl={formControl}
            />
          </Grid>
            {/* Submit Button */}
          <Grid item xs={12}>              
            <Button onClick={matchedDevs.refetch} variant="contained" color="primary" startIcon={<Search />}>
              Reload Tables
            </Button>
          </Grid>
          </Grid>
        </CippButtonCard>
        <CippDataTable
          title="Assets in PSA"
          data={tableDataPSA}
          simple={true}
          simpleColumns={columns}
          isFetching={matchedDevs.isFetching}
          />

        <CippDataTable
          title="Assets in RMM"
          data={tableDataRMM}
          simple={true}
          simpleColumns={columns}
          isFetching={matchedDevs.isFetching}
          />

        <CippDataTable
          title="Assets in Intune"
          data={tableDataINT}
          simple={true}
          simpleColumns={columns}
          isFetching={matchedDevs.isFetching}
          />
      </Stack>
    </Container>
  );
};

AssetManagement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default AssetManagement;