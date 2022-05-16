import React from "react";
import Page from '../components/Page';
import {
  Box
} from '@mui/material';
import { ApplicationsManageTable } from '../sections/@user';

export default function ApplicationsManagePage() {
  return (
    <Page title="Serviço de Autenticação">
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: 2,
        paddingRight: 2
      }}>
        <ApplicationsManageTable/>
      </Box>
    </Page>
  );
}
