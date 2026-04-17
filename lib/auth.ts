import * as jose from 'jose';
import { JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Sign a JWT token for a user.
 * Default expiry: 7 days.
 */
export const signToken = async (payload: JWTPayload, expiresIn: string | number = '7d') => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};

/**
 * Verify a JWT token.
 * Returns the payload if valid, null otherwise.
 */
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
};

/**
 * Extract Bearer token from headers and return payload.
 */
export const getAuthUser = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return await verifyToken(token);
};
