// Path: usuarios\usuario_types.ts
export interface Usuario {
  uuid: string;
  login: string;
  nome: string;
  nome_guerra: string;
  tipo_posto_grad_id: number;
  tipo_posto_grad: string;
  tipo_turno_id: number;
  tipo_turno: string;
  ativo?: boolean;
  administrador?: boolean;
}

export interface TipoPostoGrad {
  code: number;
  nome: string;
  nome_abrev: string;
}

export interface TipoTurno {
  code: number;
  nome: string;
}
