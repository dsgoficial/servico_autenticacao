import React from "react";
import Page from '../components/Page';
import {
  Box
} from '@mui/material';
import { UsersAuthTable } from '../sections/@user';

export default function UsersAuthPage() {
  return (
    <Page title="Serviço de Autenticação">
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: 2,
        paddingRight: 2
      }}>
        <UsersAuthTable/>
      </Box>
    </Page>
  );
}
