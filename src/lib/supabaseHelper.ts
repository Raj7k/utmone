import { supabase } from "@/integrations/supabase/client";

/**
 * Helper to query tables that may not yet exist in the generated types.
 * Use this for tables referenced in code but not yet created in the database.
 * Once the table is created and types regenerated, switch back to supabase.from().
 */
export const supabaseFrom = (table: string) => {
  return (supabase as any).from(table);
};
