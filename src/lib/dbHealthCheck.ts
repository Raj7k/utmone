import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "./testUtils";

/**
 * Check database table accessibility
 */
export async function testTableAccessibility(): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Database Table Access";

  try {
    const criticalTables = [
      'workspaces',
      'links',
      'link_clicks',
      'qr_codes',
      'workspace_members',
      'profiles'
    ] as const;

    const results = await Promise.all(
      criticalTables.map(async (table) => {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        return { table, accessible: !error };
      })
    );

    const duration = Date.now() - startTime;
    const allAccessible = results.every(r => r.accessible);

    return {
      name: testName,
      passed: allAccessible,
      message: allAccessible 
        ? "All critical tables accessible"
        : `Some tables inaccessible: ${results.filter(r => !r.accessible).map(r => r.table).join(', ')}`,
      duration,
      details: results
    };
  } catch (error) {
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - startTime
    };
  }
}

/**
 * Check materialized view status
 */
export async function testMaterializedViews(): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Materialized Views";

  try {
    // Test analytics views by querying them
    const views = [
      'mv_utm_campaign_analytics',
      'mv_geolocation_analytics',
      'mv_device_analytics',
      'mv_click_time_series',
      'waitlist_analytics'
    ] as const;

    const results = await Promise.all(
      views.map(async (view) => {
        try {
          const { error } = await (supabase as any)
            .from(view)
            .select('*')
            .limit(1);
          
          return { view, status: error ? 'error' : 'ok' };
        } catch {
          return { view, status: 'inaccessible' };
        }
      })
    );

    const duration = Date.now() - startTime;
    const allOk = results.every(r => r.status === 'ok');

    return {
      name: testName,
      passed: allOk,
      message: allOk
        ? "All materialized views accessible"
        : `Some views have issues: ${results.filter(r => r.status !== 'ok').map(r => r.view).join(', ')}`,
      duration,
      details: results
    };
  } catch (error) {
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - startTime
    };
  }
}

/**
 * Check storage buckets
 */
export async function testStorageBuckets(): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Storage Buckets";

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    const duration = Date.now() - startTime;

    if (error) {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    const requiredBuckets = ['qr-codes'];
    const hasRequired = requiredBuckets.every(
      req => buckets?.some(b => b.name === req)
    );

    return {
      name: testName,
      passed: hasRequired,
      message: hasRequired
        ? "All required storage buckets exist"
        : "Missing required storage buckets",
      duration,
      details: {
        buckets: buckets?.map(b => b.name) || [],
        required: requiredBuckets
      }
    };
  } catch (error) {
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - startTime
    };
  }
}

/**
 * Check database functions
 */
export async function testDatabaseFunctions(): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Database Functions";

  try {
    // Test critical RPC functions
    const { error } = await (supabase as any).rpc("has_workspace_access", {
      _user_id: '00000000-0000-0000-0000-000000000000',
      _workspace_id: '00000000-0000-0000-0000-000000000000'
    });

    const duration = Date.now() - startTime;

    // Function should execute without error (even if returns false)
    return {
      name: testName,
      passed: !error || error.code === 'PGRST200',
      message: !error || error.code === 'PGRST200'
        ? "Database functions accessible"
        : error.message,
      duration
    };
  } catch (error) {
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration: Date.now() - startTime
    };
  }
}

/**
 * Run all database health checks
 */
export async function runAllHealthChecks(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await testTableAccessibility());
  results.push(await testMaterializedViews());
  results.push(await testStorageBuckets());
  results.push(await testDatabaseFunctions());

  return results;
}
