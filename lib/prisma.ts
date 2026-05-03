// lib/prisma.ts - Safe stub for backward compatibility
// Prisma has been removed - use lib/db.ts for MySQL queries instead

/**
 * This is a safe stub that returns empty results instead of crashing.
 * It allows the app to run while services are being migrated to lib/db.ts
 */

const createSafeProxy = () => {
  return new Proxy({}, {
    get: () => new Proxy({}, {
      get: (target, method) => {
        const methodName = String(method);
        console.warn(`⚠️ WARNING: Prisma method "${methodName}" called - lib/prisma.ts is deprecated. Use lib/db.ts for MySQL queries instead.`);
        
        // Return a function that returns safe defaults
        return async (...args: any[]) => {
          if (methodName.includes('find')) {
            if (methodName === 'findMany' || methodName === 'findUnique' || methodName === 'findFirst') {
              return methodName === 'findMany' ? [] : null;
            }
          }
          if (methodName === 'count') return 0;
          if (methodName === 'create' || methodName === 'update' || methodName === 'upsert') return null;
          if (methodName === 'delete') return null;
          if (methodName === 'deleteMany') return { count: 0 };
          return null;
        };
      }
    })
  });
};

export const prisma = createSafeProxy() as any;
