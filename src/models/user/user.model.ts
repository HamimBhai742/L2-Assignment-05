import { model, Schema } from 'mongoose';
import { AgentStatus, IUser, Role } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Role, required: true },
    isActive: { type: Boolean, default: true },
    agentStatus: {
      type: String,
      enum: AgentStatus,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre('save', function (next) {
  if ((this.role = Role.AGENT)) {
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
