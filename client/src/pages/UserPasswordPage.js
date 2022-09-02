import React from 'react'
import {
    Container,
} from '@mui/material';
import Page from '../components/Page';
import { UserPasswordCard } from '../sections/@user'

export default function UserPasswordPage() {


    return (
        <Page title="Serviço de Autenticação">
            <Container maxWidth='sm'>
                <UserPasswordCard />
            </Container>
        </Page>
    );
}