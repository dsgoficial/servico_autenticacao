import React from 'react'
import {
    Container,
} from '@mui/material';
import Page from '../components/Page';
import { LDAPInfoCard } from '../sections/@user';

export default function LDAPManagePage() {

    return (
        <Page title="Sincronizar usuários LDAP">
            <Container maxWidth='sm'>
                <LDAPInfoCard/>
            </Container>
        </Page>
    );
}