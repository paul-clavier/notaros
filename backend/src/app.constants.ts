import "dotenv/config";

/** Self */
export const PORT = process.env.PORT ?? 8080;

/** Infrastructure */
// Security
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const BYCRYPT_SALT = 10;
