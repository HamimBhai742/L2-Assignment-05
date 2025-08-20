export enum AgentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum Role {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

export interface IUser {
  name: string;
  phone: string;
  password: string;
  role: Role;
  isActive: boolean;
  agentStatus?: AgentStatus;
}
