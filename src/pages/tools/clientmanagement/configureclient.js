import {
  Box,
  Button,
  CardActions,
  CardContent,
  Stack,
  Skeleton,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/system";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiGetCall, ApiPostCall, ApiGetCallWithPagination } from "/src/api/ApiCall";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { useRouter } from "next/router";
import extensions from "/src/data/Extensions.json";
import { useEffect } from "react";
import { CippDataTable } from "/src/components/CippTable/CippDataTable";
import { PlusSmallIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CippFormTenantSelector } from "/src/components/CippComponents/CippFormTenantSelector";
import { Sync, SyncAlt } from "@mui/icons-material";
import { CippFormComponent } from "/src/components/CippComponents/CippFormComponent";
import { CippApiResults } from "/src/components/CippComponents/CippApiResults";
import { useSettings } from "../../../hooks/use-settings";


const ConfigureClient = () => {
  const currentTenant = useSettings().currentTenant;
  const [tableData, setTableData] = useState([]);
  const [groupsList, setGroups] = useState([]);
  const [userServices, setUsrSrv] = useState([]);
  const [pcServices, setPcSrv] = useState([]);

  const mappings = ApiGetCall({
    url: "/api/ExecExtensionMapping",
    data: {
      List: "Autotask",
    },
    queryKey: `IntegrationExtensionMapping-${currentTenant}`,
  });

  const listGroups = ApiGetCall({
    url: "/api/ListGroups",
    data: {
      tenantFilter: currentTenant,
      groupType: "Microsoft 365"
    },
    queryKey: `IntegrationGroupMapping-${currentTenant}`,
  });

  const listServices = ApiGetCall({
    url: "/api/ListPSAServices",    
    queryKey: `IntegrationPsaSvcMapping-${currentTenant}`,
  });  

  const formControl = useForm({
    mode: "onChange",
    defaultValues: mappings?.data,
  });

  const postCall = ApiPostCall({
    datafromUrl: true,
    relatedQueryKeys: [`IntegrationTenantMapping-${currentTenant}`],
  });

  const handleRemoveItem = (rows) => {
    if (rows === undefined) return false;
    const newTableData = [...tableData];
    if (Array.isArray(rows)) {
      rows.forEach((row) => {
        const index = newTableData.findIndex((item) => item === row);
        if (index !== -1) newTableData.splice(index, 1);
      });
    } else {
      const index = newTableData.findIndex((item) => item === rows);
      if (index !== -1) newTableData.splice(index, 1);
    }
    setTableData(newTableData);
  };

  const handleAddItem = () => {
    const selectedTenant = formControl.getValues("tenantFilter");
    const selectedCompany = formControl.getValues("integrationCompany");
    if (!selectedTenant || !selectedCompany) return;
    if (tableData?.find((item) => item.TenantId === selectedTenant.addedFields.customerId)) return;

    const newRowData = {
      TenantId: selectedTenant.value,
      Tenant: selectedTenant.label,
      IntegrationName: selectedCompany.label,
      IntegrationId: selectedCompany.value,
      TenantDomain: selectedTenant.addedFields.defaultDomainName,
    };

    setTableData([...tableData, newRowData]);
  };

  const handleSubmit = () => {
    postCall.mutate({
      url: `/api/ExecExtensionMapping?AddMapping=${router.query.id}`,
      data: tableData,
    });
  };

  const actions = [
    {
      label: "Delete Mapping",
      icon: <TrashIcon />,
      confirmText: "Are you sure you want to delete this mapping?",
      customFunction: handleRemoveItem,
    },
  ];


  useEffect(() => {
    if (listGroups.isSuccess) {
      setGroups(listGroups.data ?? []);
    }

    if (listServices.isSuccess) {
      setPcSrv(listServices.data ?? []);
      setUsrSrv(listServices.data ?? []);
    }

    if (mappings.isSuccess) {
      setTableData(mappings.data.Mappings ?? []);
    }
  }, [mappings.isSuccess, listGroups.isSuccess, listServices.isSuccess]);

  return (
    <>
      {mappings.isSuccess && listGroups.isSuccess ? (
        <>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Add a Tenant Mapping
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{
                alignItems: "center",
                mb: 3,
              }}
            >
              <Grid size={{ md: 3, xs: 12 }}>
                <Box sx={{ my: "auto" }}>
                  <CippFormComponent
                    type="autoComplete"
                    fullWidth
                    name="licenseGroup"
                    formControl={formControl}
                    placeholder={"License Group"}
                    options={groupsList.map((group) => {
                      return {
                        label: group.displayName,
                        value: group.id,
                      };
                    })}
                    creatable={false}
                    multiple={false}
                    isFetching={listGroups.isFetching}
                    sortOptions={true}
                  />
                </Box>
              </Grid>
              <Grid size={{ md: 3, xs: 12 }}>
                <CippFormComponent
                  type="autoComplete"
                  fullWidth
                  name="pcService"
                  formControl={formControl}
                  placeholder={"PC Service"}
                  options={pcServices.map((svc) => {
                    return {
                      label: svc.name,
                      value: svc.id,
                    };
                  })}
                  creatable={false}
                  multiple={false}
                  isFetching={listServices.isFetching}
                  sortOptions={true}
                />
              </Grid>
              <Grid size={{ md: 3, xs: 12 }}>
                <Box>
                  <CippFormComponent
                    type="autoComplete"
                    fullWidth
                    name="userService"
                    formControl={formControl}
                    placeholder={"User Service"}
                    options={userServices.map((svc) => {
                      return {
                        label: svc.name,
                        value: svc.id,
                      };
                    })}
                    creatable={false}
                    multiple={false}
                    isFetching={listServices.isFetching}
                    sortOptions={true}
                  />
                </Box>
              </Grid>
              <Grid>
                <Stack direction={"row"} spacing={1}>
                  <Tooltip title="Add Mapping">
                    <Button size="small" onClick={() => handleAddItem()} variant="contained">
                      <SvgIcon>
                        <PlusSmallIcon />
                      </SvgIcon>
                    </Button>
                  </Tooltip>
                  <Tooltip title="Refresh Integration Mapping">
                    <Button
                      size="small"
                      onClick={() => {
                        mappings.refetch();
                        listGroups.refetch();
                        listServices.refetch();
                      }}
                      variant="contained"
                    >
                      <SvgIcon>
                        <Sync />
                      </SvgIcon>
                    </Button>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
            <Box sx={{ borderTop: 1, borderColor: "divider" }}>
              <CippDataTable
                actions={actions}
                noCard={true}
                reportTitle={`${currentTenant}-tenant-map`}
                data={tableData}
                simple={false}
                simpleColumns={["IntegrationName", "Tenant", "TenantDomain"]}
                isFetching={mappings.isFetching}
                refreshFunction={() => mappings.refetch()}
              />
            </Box>
            <CippApiResults apiObject={postCall} />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              disabled={postCall.isPending}
              onClick={formControl.handleSubmit(handleSubmit)}
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
          </CardActions>
        </>
      ) : (
        <CardContent>
          {mappings.isLoading && (
            <Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Skeleton variant="rectangular" height={300} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          {mappings.isSuccess && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ textAlign: "center" }}>Extension not found</Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      )}
    </>
  );
};

ConfigureClient.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ConfigureClient;