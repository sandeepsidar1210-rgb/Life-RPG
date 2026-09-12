import { supabaseAdmin, supabase } from '../supabase.js';

/**
 * Authentication Middleware
 * Validates Supabase JWT from Authorization: Bearer <token>
 * Attaches verified user to req.user ({ id, email, ... })
 * Rejects missing/invalid tokens with 401
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header. Expected Bearer <token>.'
      });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token is empty.'
      });
    }

    // Verify token with Supabase Auth
    const client = supabaseAdmin || supabase;
    if (!client) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'Supabase client is not initialized.'
      });
    }

    const { data, error } = await client.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired session token.'
      });
    }

    // Attach verified user and explicit id to request object
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      user_metadata: data.user.user_metadata || {}
    };

    req.userId = data.user.id;

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication verification failed.'
    });
  }
}
