import React, { useState, useEffect } from 'react'
import {
    Typography,
    Container,
    CardContent,
    Card,
    Stack,
    TextField,
    Button
} from '@mui/material';
import { useFormik } from 'formik'
import * as yup from 'yup'
import Page from '../components/Page';
import { useSnackbar } from 'notistack';
import { useAPI } from '../contexts/apiContext'
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