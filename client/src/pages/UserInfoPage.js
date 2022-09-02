import React from 'react'
import {
    Container,
} from '@mui/material';
import Page from '../components/Page';
import { UserInfoCard } from '../sections/@user';

export default function UserInfoPage() {

    return (
        <Page title="Serviço de Autenticação">
            <Container maxWidth='sm'>
                <UserInfoCard/>
            </Container>
        </Page>
    );
}