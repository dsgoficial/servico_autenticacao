import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { Form, Container } from "./styles";
import api from "../../services/api";

const Cadastro = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nomeGuerra, setNomeGuerra] = useState("");
  const [tipoTurnoId, setTipoTurnoId] = useState("");
  const [tipoPostoGradId, setTipoPostoGradId] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async e => {
    e.preventDefault();
    if (!usuario || !senha || !nome || !nomeGuerra || !tipoTurnoId || !tipoPostoGradId) {
      setError("Preencha todos os dados para se cadastrar");
    } else {
      try {
        await api.post("/usuarios", { usuario, senha, nome, nome_guerra: nomeGuerra, tipo_turno_id: tipoTurnoId, tipo_posto_grad_id: tipoPostoGradId });
        this.props.history.push("/");
      } catch (err) {
        console.log(err);
        setError("Ocorreu um erro ao registrar sua conta." );
      }
    }
  };

  return (
      <Container>
        <Form onSubmit={handleSignUp}>
          <h1>Serviço de Autenticação</h1>
          <h2>Cadastrar novo usuário</h2>
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
            type="text"
            placeholder="Nome completo"
            onChange={e => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome de guerra"
            onChange={e => setNomeGuerra(e.target.value)}
          />
          <button type="submit">Cadastrar</button>
          <hr />
          <Link to="/">Fazer login</Link>
        </Form>
      </Container>
    );
}

export default withRouter(Cadastro);
