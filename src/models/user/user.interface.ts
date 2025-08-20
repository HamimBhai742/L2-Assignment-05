export enum AgentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Role {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export enum IsActive {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export interface IUser {
  _id?: string;
  name: string;
  phone: string;
  password: string;
  role?: Role;
  isActive: IsActive;
  agentStatus?: AgentStatus;
}
