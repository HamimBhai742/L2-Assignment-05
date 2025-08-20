import { model, Schema } from 'mongoose';
import { AgentStatus, IUser, Role, UserStatus } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    agentStatus: {
      type: String,
      enum: Object.values(AgentStatus),
      default: AgentStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre('save', function (next) {
  if (this.role === Role.AGENT) {
    if (!this.agentStatus) {
      this.agentStatus = AgentStatus.PENDING;
    }
  } else {
    this.agentStatus = undefined;
    delete this.agentStatus;
  }
  next();
});

export const User = model<IUser>('User', userSchema);
