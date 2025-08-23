export enum AgentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SUSPEND = 'suspend',
}

export enum Role {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}
export interface IUser {
  _id?: string;
  name: string;
  phone: string;
  password: string;
  role?: Role;
  isActive?: boolean;
  agentStatus?: AgentStatus;
}
