import 'dotenv/config';
export const env = {
  PORT: Number(process.env.PORT || 3000),
  DB_URL: process.env.MONGOOSE_URL,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
  TRNX_SECRET: process.env.TRNX_SECRET as string
};
