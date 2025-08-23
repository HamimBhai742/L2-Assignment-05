import 'dotenv/config';
export const env = {
  PORT: Number(process.env.SERVER_PORT || 3000),
  DB_URL: process.env.MONGOOSE_URL,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
  TRNX_SECRET: process.env.TRNX_SECRET as string,
  AGENT_APPROVED: process.env.AGENT_APPROVED as string,
  AGENT_SUSPEND: process.env.AGENT_SUSPEND as string,
  WALLET_ACTIVE: process.env.WALLET_ACTIVE as string,
  WALLET_BLOCKED: process.env.WALLET_BLOCKED as string,
};
