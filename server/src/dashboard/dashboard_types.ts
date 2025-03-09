// Path: dashboard\dashboard_types.ts
export interface UsuarioLogado {
  id: number;
  ultimo_login: Date;
  login: string;
  nome_guerra: string;
  tipo_posto_grad: string;
  tipo_turno: string;
  aplicacao: string;
}

export interface LoginDia {
  data_login: string;
  logins: number;
}

export interface LoginMes {
  data_login: string;
  logins: number;
}

export interface LoginAplicacao {
  data: string;
  [key: string]: number | string;
  outros: number;
}

export interface LoginUsuario {
  data: string;
  [key: string]: number | string;
  outros: number;
}

export interface AplicacaoLoginCount {
  aplicacao: string;
  logins: number;
}

export interface UsuarioLoginCount {
  usuario: string;
  logins: number;
}
