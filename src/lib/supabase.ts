
// Dummy Supabase client for MVP (hardcoded auth)
export const supabase = {
  auth: {
    signOut: async () => {},
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => {
    const chain = {
      select: () => chain,
      insert: async () => ({ data: null, error: null }),
      update: () => chain,
      delete: () => chain,
      eq: () => chain,
      single: async () => ({ data: null, error: null }),
      order: () => chain,
      limit: () => chain,
      match: () => chain,
      then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
    };
    return chain;
  },
} as any;
