import "dotenv/config";

/** Self */
export const PORT = process.env.PORT ?? 8080;

/** Infrastructure */
// Security
export const JWT_SECRET = process.env.JWT_SECRET;
export const BYCRYPT_SALT = 10;
