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

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export interface IUser {
  _id?: string;
  name: string;
  phone: string;
  password: string;
  role?: Role;
  status: UserStatus;
  agentStatus?: AgentStatus;
}
