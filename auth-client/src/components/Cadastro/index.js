import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Form, Container } from "./styles";
import api from "../../services/api";
import { useAlert } from "react-alert";
import ReactLoading from "react-loading";

const Cadastro = withRouter(props => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nomeGuerra, setNomeGuerra] = useState("");
  const [tipoTurnoId, setTipoTurnoId] = useState("");
  const [tipoPostoGradId, setTipoPostoGradId] = useState("");
  const [listaTurnos, setListaTurnos] = useState([]);
  const [listaPostoGrad, setListaPostoGrad] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const alert = useAlert();

  useEffect(() => {
    async function getTipoPostoGrad() {
      try {
        const response = await api.get("/usuarios/tipo_posto_grad");
        if (
          !response ||
          response.status !== 200 ||
          !("data" in response) ||
          !("dados" in response.data)
        ) {
          throw new Error();
        }
        setListaPostoGrad(response.data.dados);
      } catch (err) {
        console.log(error);
        setError("Erro com o serviço de autenticação.");
      }
    }
    async function getTurnos() {
      try {
        const response = await api.get("/usuarios/tipo_turno");
        if (
          !response ||
          response.status !== 200 ||
          !("data" in response) ||
          !("dados" in response.data)
        ) {
          throw new Error();
        }
        setListaTurnos(response.data.dados);
      } catch (err) {
        console.log(error);
        setError("Erro com o serviço de autenticação.");
      }
    }

    Promise.all([getTipoPostoGrad(), getTurnos()]).then(() => {
      setLoaded(true);
    });
  }, []);

  const handleSignUp = async e => {
    e.preventDefault();
    if (
      !usuario ||
      !senha ||
      !confirmarSenha ||
      !nome ||
      !nomeGuerra ||
      !tipoTurnoId ||
      !tipoPostoGradId
    ) {
      setError("Preencha todos os dados para se cadastrar");
    } else if (confirmarSenha !== senha) {
      setError("As senhas devem ser iguais");
    } else {
      try {
        await api.post("/usuarios", {
          usuario,
          senha,
          nome,
          nome_guerra: nomeGuerra,
          tipo_turno_id: tipoTurnoId,
          tipo_posto_grad_id: tipoPostoGradId
        });
        alert.success(
          "Usuário criado com sucesso. Entre em contato com o gerente para autorizar o login."
        );
        props.history.push("/");
      } catch (err) {
        if (
          "response" in err &&
          "data" in err.response &&
          "message" in err.response.data
        ) {
          setError(err.response.data.message);
        } else {
          setError("Ocorreu um erro ao registrar sua conta.");
        }
      }
    }
  };

  const handlePostoGrad = event => {
    setTipoPostoGradId(+event.target.value);
  };

  const handleTurno = event => {
    setTipoTurnoId(+event.target.value);
  };

  return (
    <Container>
      {loaded ? (
        <Form onSubmit={handleSignUp}>
          <h1>Cadastrar novo usuário</h1>
          <br />
          {error && <p>{error}</p>}
          <input
            type="text"
            placeholder="Nome de usuário"
            onChange={e => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={e => setSenha(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirme a senha"
            onChange={e => setConfirmarSenha(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome completo"
            onChange={e => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome de guerra"
            onChange={e => setNomeGuerra(e.target.value)}
          />
          <select defaultValue="" onChange={handlePostoGrad}>
            <option value="" disabled>
              Selecione seu Posto/Graduação
            </option>
            {listaPostoGrad.map(function(n) {
              return (
                <option key={n.code} value={n.code}>
                  {n.nome_abrev}
                </option>
              );
            })}
          </select>
          <select defaultValue="" onChange={handleTurno}>
            <option value="" disabled>
              Selecione seu turno de trabalho
            </option>
            {listaTurnos.map(function(n) {
              return (
                <option key={n.code} value={n.code}>
                  {n.nome}
                </option>
              );
            })}
          </select>
          <button type="submit">Cadastrar</button>
          <hr />
          <Link to="/">Fazer login</Link>
        </Form>
      ) : (
        <ReactLoading type="bars" color="#fff" height={"7%"} width={"7%"} />
      )}
    </Container>
  );
});

export default Cadastro;
