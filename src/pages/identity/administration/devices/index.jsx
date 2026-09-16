import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Layout as DashboardLayout } from "../../../../layouts/index"; // had to add an extra path here because I added an extra folder structure. We should switch to absolute pathing so we dont have to deal with relative.
import { useSettings } from "../../../../hooks/use-settings";
import { CippIcons } from "../../../../utils/icon-registry"

const Page = () => {
  const pageTitle = "Devices";
  const tenantFilter = useSettings().currentTenant;

  const actions = [
    {
      label: "View in Entra",
      link: `https://entra.microsoft.com/${tenantFilter}/#view/Microsoft_AAD_Devices/DeviceDetailsMenuBlade/~/Properties/objectId/[id]/deviceId/`,
      pinned: true,
      color: "info",
      icon: <CippIcons.Launch />,
      target: "_blank",
      multiPost: false,
      external: true,
    },
    {
      label: "Enable Device",
      type: "POST",
      url: "/api/ExecDeviceDelete",
      data: {
        ID: "id",
        action: "!Enable",
      },
      confirmText: "Are you sure you want to enable this device?",
      multiPost: false,
      condition: (row) => !row.accountEnabled,
      icon: <CippIcons.CheckCircleOutlined />,
    },
    {
      label: "Disable Device",
      type: "POST",
      url: "/api/ExecDeviceDelete",
      data: {
        ID: "id",
        action: "!Disable",
      },
      confirmText: "Are you sure you want to disable this device?",
      multiPost: false,
      condition: (row) => row.accountEnabled,
      icon: <CippIcons.Block />,
    },
    {
      label: "Retrieve BitLocker Keys",
      type: "POST",
      url: "/api/ExecGetRecoveryKey",
      data: {
        GUID: "deviceId",
      },
      confirmText: "Are you sure you want to retrieve the BitLocker keys?",
      multiPost: false,
      icon: <CippIcons.Key />,
    },
    {
      label: "Retrieve LAPS password",
      type: "POST",
      url: "/api/ExecGetLocalAdminPassword",
      data: {
        GUID: "deviceId",
      },
      confirmText: "Are you sure you want to retrieve the local admin password for [displayName]?",
      multiPost: false,
      condition: (row) => row.operatingSystem === "Windows",
      icon: <CippIcons.Password />,
    },
    {
      label: "Delete Device",
      type: "POST",
      url: "/api/ExecDeviceDelete",
      data: {
        ID: "id",
        action: "!Delete",
      },
      confirmText: "Are you sure you want to delete this device?",
      multiPost: false,
      icon: <CippIcons.Delete />,
    },
    {
          label: "Add to Group",
          type: "POST",
          icon: <CippIcons.GroupAdd />,
          url: "/api/ExecDeviceGroupUpdate",
          customDataformatter: (row, action, formData) => {
            let addMember = [];
            if (Array.isArray(row)) {
              row
                .map((r) => ({
                  label: r.displayName,
                  value: r.id,
                  addedFields: {
                    deviceid: r.deviceid,
                  },
                }))
                .forEach((r) => addMember.push(r));
            } else {
              addMember.push({
                label: row.displayName,
                value: row.id,
                addedFields: {
                  deviceid: row.deviceId,
                },
              });
            }
            return {
              addMember: addMember,
              tenantFilter: tenantFilter,
              action: "!Add",
              groupId: formData.groupId,
            };
          },
          fields: [
            {
              type: "autoComplete",
              name: "groupId",
              label: "Select a group to add the user to",
              multiple: false,
              creatable: false,
              validators: { required: "Please select a group" },
              api: {
                url: "/api/ListGroups",
                labelField: "displayName",
                valueField: "id",
                addedField: {
                  groupType: "calculatedGroupType",
                  groupName: "displayName",
                },
                queryKey: `groups-${tenantFilter}`,
                showRefresh: true,
              },
            },
          ],
          confirmText: "Select group to add computer to",
          multiPost: true,
          allowResubmit: true,
          condition: (c) => c.accountEnabled && c.operatingSystem == "Windows",
    },
  ];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListGraphRequest"
      apiData={{
        Endpoint: "devices",
        $format: "application/json",
        $count: true,
      }}
      apiDataKey="Results"
      queryKey={`EntraDevices-${tenantFilter}`}
      actions={actions}
      simpleColumns={[
        "displayName",
        "accountEnabled",
        "trustType",
        "enrollmentType",
        "manufacturer",
        "model",
        "operatingSystem",
        "operatingSystemVersion",
        "profileType",
        "approximateLastSignInDateTime",
      ]}
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
