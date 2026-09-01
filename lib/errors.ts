/**
 * Unified Error Handling Utility
 * Transforms internal/database/network errors into clean, safe, and meaningful user-friendly messages.
 * Prevents leaking raw OpenSSL, C++, MongoDB driver, or filesystem internals to the client.
 */

export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const errObj = error as Record<string, any>;
  const message: string = typeof error === 'string'
    ? error
    : errObj.message || (typeof errObj.toString === 'function' ? errObj.toString() : '');

  const lowerMsg = message.toLowerCase();

  // 1. SSL Alert 80 / IP Whitelist issues in MongoDB Atlas
  if (
    lowerMsg.includes('ssl alert number 80') ||
    lowerMsg.includes('alert internal error') ||
    lowerMsg.includes('err_ssl_tlsv1_alert_internal_error') ||
    (lowerMsg.includes('ssl') && lowerMsg.includes('tlsv1'))
  ) {
    return 'MongoDB Connection Error: Your IP address is not whitelisted in MongoDB Atlas. Please go to MongoDB Atlas Dashboard -> Network Access -> Add IP Address (add 0.0.0.0/0 or your current IP).';
  }

  // 2. General Database / Network / Connection Issues
  if (
    lowerMsg.includes('ssl') ||
    lowerMsg.includes('mongoserverselectionerror') ||
    lowerMsg.includes('mongonetworkerror') ||
    lowerMsg.includes('mongotimeouterror') ||
    lowerMsg.includes('econnrefused') ||
    lowerMsg.includes('enotfound') ||
    lowerMsg.includes('etimedout') ||
    lowerMsg.includes('timed out') ||
    lowerMsg.includes('topology was destroyed') ||
    lowerMsg.includes('pool destroyed') ||
    lowerMsg.includes('connection reset') ||
    lowerMsg.includes('socket has been ended') ||
    lowerMsg.includes('connection error')
  ) {
    return 'Database service is temporarily unreachable. Please check your internet connection or verify your MongoDB Atlas network access list.';
  }

  // 3. Duplicate Key / Unique Index Violations (Mongo code 11000)
  if (errObj.code === 11000 || lowerMsg.includes('e11000') || lowerMsg.includes('duplicate key')) {
    if (lowerMsg.includes('email')) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (lowerMsg.includes('slug')) {
      return 'An item with this unique URL slug already exists.';
    }
    return 'A record with this information already exists.';
  }

  // 4. JWT & Authentication Token Errors
  if (
    lowerMsg.includes('jwt') ||
    lowerMsg.includes('jwe') ||
    lowerMsg.includes('token expired') ||
    lowerMsg.includes('claim validation failed') ||
    lowerMsg.includes('signature verification failed')
  ) {
    return 'Your session has expired or is invalid. Please sign in again.';
  }

  // 5. Rate Limiting
  if (lowerMsg.includes('too many') || lowerMsg.includes('rate limit')) {
    return message || 'Too many requests. Please wait a minute and try again.';
  }

  // 6. Cloudinary / Image Upload Errors
  if (lowerMsg.includes('cloudinary') || lowerMsg.includes('upload failed') || lowerMsg.includes('file too large')) {
    return 'Image upload failed. Please verify your file size and format (PNG, JPG, WEBP).';
  }

  // 7. Redis Cache Errors
  if (lowerMsg.includes('redis') || lowerMsg.includes('ioredis')) {
    return 'Cache service temporarily unavailable. Processing request directly.';
  }

  // 8. OpenSSL / C++ Internal Stack traces
  if (
    lowerMsg.includes('internal server error') ||
    lowerMsg.includes('c:\\ws\\deps') ||
    lowerMsg.includes('node:') ||
    lowerMsg.includes('openssl') ||
    lowerMsg.includes('runtimeerror') ||
    lowerMsg.includes('rec_layer_s3')
  ) {
    return 'Database connection failed. Please verify your MongoDB network access and credentials.';
  }

  // Clean user-directed validation message
  if (message.length > 0 && message.length < 180 && !message.includes(' at ') && !message.includes('node_modules')) {
    return message;
  }

  return 'An unexpected error occurred. Please try again.';
}
