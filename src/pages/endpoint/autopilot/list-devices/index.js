import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippTablePage } from "/src/components/CippComponents/CippTablePage.jsx";
import { CippApiDialog } from "/src/components/CippComponents/CippApiDialog.jsx";
import { Button } from "@mui/material";
import { PersonAdd, Delete, Sync, Add, AddLink } from "@mui/icons-material";
import { useDialog } from "../../../../hooks/use-dialog";
import Link from "next/link";
import GroupTags from "/src/data/AutopilotGroupTags.json"
import { useState } from "react";

const Page = () => {
  const pageTitle = "Autopilot Devices";
  const createDialog = useDialog();

  const actions = [
    {
      label: "Assign device",
      icon: <PersonAdd />,
      type: "POST",
      url: "/api/ExecAssignAPDevice",
      data: {
        device: "id",
        serialNumber: "serialNumber",
      },
      confirmText: "Select the user to assign the device to",
      fields: [
        {
          type: "autoComplete",
          name: "user",
          label: "Select User",
          multiple: false,
          creatable: false,
          api: {
            url: "/api/listUsers",
            labelField: (user) => `${user.displayName} (${user.userPrincipalName})`,
            valueField: "userPrincipalName",
            addedField: {
              userPrincipalName: "userPrincipalName",
              addressableUserName: "displayName",
            },
          },
        },
      ],
      color: "info",
    },
    {
      label:"Set Group Tag",
      icon: <AddLink/>,
      type: "POST",
      url:"/api/ExecSetGroupTag",
      data: {
        ID: "id"
      },
      fields: [
        {
          type: "autoComplete",
          name: "groupId",
          label: "Select a group to add the user to",
          multiple: false,
          creatable: false,
          options: [
            { label: "ManagedPC", value: "ManagedPC"},
            { label: "Administrator", value: "Administrator"},
            { label: "Standard", value: "Standard"},           
            { label: "PAL-Shared", value: "PAL-Shared"},
            { label: "PAL", value: "PAL"},
            { label: "BLY", value: "BLY"},
            { label: "BLY-Shared", value: "BLY-Shared"}
          ]
        },
      ],
      confirmText: "Enter a Group Tag and press continue."
    },
    {
      label: "Delete Device",
      icon: <Delete />,
      type: "POST",
      url: "/api/RemoveAPDevice",
      data: { ID: "id" },
      confirmText: "Are you sure you want to delete this device?",
      color: "danger",
    },
  ];

  const offCanvas = {
    extendedInfoFields: [
      "userPrincipalName",
      "productKey",
      "serialNumber",
      "model",
      "manufacturer",
    ],
    actions: actions,
  };

  const simpleColumns = [
    "displayName",
    "serialNumber",
    "model",
    "manufacturer",
    "groupTag",
    "enrollmentState",
  ];

  return (
    <>
      <CippTablePage
        title={pageTitle}
        apiUrl="/api/ListAPDevices"
        actions={actions}
        offCanvas={offCanvas}
        simpleColumns={simpleColumns}
        cardButton={
          <>
            <Button component={Link} href="/endpoint/autopilot/add-device" startIcon={<Add />}>
              Add Autopilot Devices
            </Button>
            <Button onClick={createDialog.handleOpen} startIcon={<Sync />}>
              Sync Devices
            </Button>
          </>
        }
      />
      <CippApiDialog
        title="Sync Autopilot Devices"
        createDialog={createDialog}
        api={{
          type: "POST",
          url: "/api/ExecSyncAPDevices",
          data: {},
          confirmText:
            "Are you sure you want to sync Autopilot devices? This can only be done every 10 minutes.",
        }}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
