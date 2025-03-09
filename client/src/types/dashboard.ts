// Path: types\dashboard.ts

// Basic data point structure for charts
interface DataPoint {
  [key: string]: string | number;
}

// Statistics for dashboard summary cards
export interface DashboardSummary {
  usuariosAtivos: number;
  aplicacoesAtivas: number;
}

// Stats for logins per day
export interface DailyLoginStats extends DataPoint {
  data: string;
  logins: number;
}

// Stats for logins per month
export interface MonthlyLoginStats extends DataPoint {
  month: string;
  logins: number;
}

// Stats for logins per application
export interface ApplicationLoginStats extends DataPoint {
  data: string;
  [key: string]: string | number; // Dynamic keys for application names
}

// Stats for logins per user
export interface UserLoginStats extends DataPoint {
  data: string;
  [key: string]: string | number; // Dynamic keys for usernames
}

// User currently logged in
export interface LoggedInUser {
  login: string;
  tipo_posto_grad: string;
  tipo_turno: string;
  nome_guerra: string;
  aplicacao: string;
  ultimo_login: string;
}

// Complete dashboard data structure
export interface DashboardData {
  usuariosAtivos: number;
  aplicacoesAtivas: number;
  usuariosLogados: LoggedInUser[];
  loginsPorDia: DailyLoginStats[];
  loginsPorMes: MonthlyLoginStats[];
  loginsPorAplicacao: ApplicationLoginStats[];
  loginsPorUsuario: UserLoginStats[];
}
