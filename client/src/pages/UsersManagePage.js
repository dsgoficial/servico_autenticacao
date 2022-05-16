import React from "react";
import Page from '../components/Page';
import {
  Box
} from '@mui/material';
import { UsersManageTable } from '../sections/@user';

export default function UsersManagePage() {
  return (
    <Page title="Serviço de Autenticação">
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: 2,
        paddingRight: 2
      }}>
        <UsersManageTable/>
      </Box>
    </Page>
  );
}
