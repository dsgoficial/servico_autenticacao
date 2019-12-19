import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import api from "../../services/api";
import { setToken } from "../../services/auth";

import { Form, Container } from "./styles";

const Login = withRouter(props => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async e => {
    e.preventDefault();
    if (!usuario || !senha) {
      setError("Preencha o usuário e a senha para continuar!");
    } else {
      try {
        const response = await api.post("/login", { usuario, senha });
        if (
          !response ||
          response.status !== 201 ||
          !("data" in response) ||
          !("dados" in response.data) ||
          !("token" in response.data.dados)
        ) {
          throw new Error();
        }
        setToken(response.data.dados.token);
        setError("");
        props.history.push("/app");
      } catch (err) {
        if (
          "response" in err &&
          "data" in err.response &&
          "message" in err.response.data
        ) {
          setError(err.response.data.message);
        } else {
          setError(
            "Houve um problema com o login, verifique suas credenciais."
          );
        }
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSignIn}>
        <h1>Serviço de Autenticação</h1>
        <br />
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Usuário"
          onChange={e => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={e => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
        <hr />
        <Link to="/cadastro">Criar novo usuário</Link>
      </Form>
    </Container>
  );
});

export default Login;
