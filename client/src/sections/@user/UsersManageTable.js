import React, { useState, useEffect } from "react";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { CsvBuilder } from "filefy";
import MaterialTable from '../../components/Table';
import UserDeleteDialog from './UserDeleteDialog'
import UserAddDialog from './UserAddDialog'
import UserEditDialog from './UserEditDialog'
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

export default function ManageUsersTable() {

    const [usuarios, setUsuarios] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [openDeleteDialog, setOpenDeleteDialog] = useState({});
    const [openAdicionaDialog, setOpenAdicionaDialog] = useState({});
    const [openAtualizaDialog, setOpenAtualizaDialog] = useState({});

    const {
        getUsers
    } = useAPI()

    useEffect(() => {
        fetchData()
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async () => {
        try {
            const [usuarios] = await Promise.all([
                getUsers()
            ])
            setUsuarios(usuarios)
            setLoaded(true);
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const showDeleteUser = (event, rowData) => {
        setOpenDeleteDialog({
            open: true,
            title: "Deletar usuário",
            msg: `Deseja realmente deletar o usuário ${rowData.tipo_posto_grad} ${rowData.nome_guerra}`,
            userUUID: rowData.uuid
        });
    };

    const showAddUser = (event, rowData) => {
        setOpenAdicionaDialog({
            open: true,
        });
    };

    const showEditUser = (event, rowData) => {
        setOpenAtualizaDialog({
            open: true,
            usuario: rowData,
        });
    };

    const updateTable = () => {
        fetchData()
    }

    return (
        <>
            <MaterialTable
                title="Usuários"
                loaded={loaded}
                columns={[
                    { title: "Login", field: "login" },
                    { title: "Posto/Graducao", field: "tipo_posto_grad" },
                    { title: "Turno", field: "tipo_turno" },
                    { title: "Nome Guerra", field: "nome_guerra" },
                    { title: "Nome completo", field: "nome" },
                    { title: "Ativo", field: "ativo", type: "boolean" },
                    { title: "Administrador", field: "administrador", type: "boolean" },
                ]}
                data={usuarios}
                actions={[
                    {
                        icon: Edit,
                        tooltip: "Editar usuário",
                        onClick: showEditUser,
                    },
                    {
                        icon: Delete,
                        tooltip: "Deletar usuário",
                        onClick: showDeleteUser,
                    },
                    {
                        icon: Add,
                        tooltip: "Adicionar usuário",
                        isFreeAction: true,
                        onClick: showAddUser,
                    },
                ]}
                options={{
                    exportButton: true,
                    exportCsv: (columns, data) => {
                        data.forEach((d) => {
                            delete d.tableData;
                        });
                        const keys = Object.keys(data[0]);
                        const dataToExport = data.map((r) =>
                            keys.map((k) => {
                                return r[k];
                            })
                        );
                        const builder = new CsvBuilder("export_usuarios.csv");
                        builder
                            .setDelimeter(",")
                            .setColumns(keys)
                            .addRows(dataToExport)
                            .exportFile();
                    },
                }}
            />
            {
                openDeleteDialog ? (
                    <UserDeleteDialog
                        open={!!openDeleteDialog.open}
                        title={openDeleteDialog.title}
                        msg={openDeleteDialog.msg}
                        onClose={() => setOpenDeleteDialog({ open: false })}
                        userUUID={openDeleteDialog.userUUID}
                        callback={updateTable}
                    />
                ) : null
            }
            {
                openAdicionaDialog ? (
                    <UserAddDialog
                        open={!!openAdicionaDialog.open}
                        onClose={() => setOpenAdicionaDialog({ open: false })}
                        callback={updateTable}
                    />
                ) : null
            }
            {
                openAtualizaDialog ? (
                    <UserEditDialog
                        open={!!openAtualizaDialog.open}
                        usuario={openAtualizaDialog.usuario}
                        onClose={() => setOpenAtualizaDialog({ open: false })}
                        callback={updateTable}
                    />
                ) : null
            }
        </>
    );
}
