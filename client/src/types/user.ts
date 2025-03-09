// Path: types\user.ts

export interface UserPosition {
  code: number;
  nome: string;
}

export interface UserShift {
  code: number;
  nome: string;
}

export interface User {
  uuid: string;
  login: string;
  nome: string;
  nome_guerra: string;
  tipo_posto_grad_id: number;
  tipo_posto_grad: string;
  tipo_turno_id: number;
  tipo_turno: string;
  ativo: boolean;
  administrador: boolean;
  ultimo_login?: string;
}

export interface UserCreateRequest {
  usuario: string;
  nome: string;
  nomeGuerra: string;
  tipoPostoGradId: number;
  tipoTurnoId: number;
  ativo: boolean;
  administrador: boolean;
  uuid?: string;
}

export interface UserUpdateRequest {
  uuid: string;
  usuario: string;
  nome: string;
  nomeGuerra: string;
  tipoPostoGradId: number;
  tipoTurnoId: number;
  ativo: boolean;
  administrador: boolean;
  novoUuid?: string;
}

export interface UserPasswordUpdateRequest {
  senha_atual: string;
  senha_nova: string;
}

export interface UserInfoUpdateRequest {
  nome: string;
  nomeGuerra: string;
  tipoPostoGradId: number;
  tipoTurnoId: number;
}

export interface UserPasswordChange {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}
