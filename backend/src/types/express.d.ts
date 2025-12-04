import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Clerk's auth() method returns AuthObject
      // The actual structure varies, but commonly includes:
      auth(): {
        userId?: string;           // May or may not be present
        sessionId?: string;        
        isAuthenticated: boolean;  
        sessionClaims?: {
          sub?: string;            // User ID is often here (sub = subject)
          email?: string;
          [key: string]: any;
        };
        orgId?: string;
        orgRole?: string;
        orgSlug?: string;
        [key: string]: any;        // Allow other properties
      };
    }
  }
}

export {};