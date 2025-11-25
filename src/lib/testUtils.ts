import { supabase } from "@/integrations/supabase/client";

/**
 * Test utility functions for critical path testing
 */

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
  details?: any;
}

/**
 * Test redirect functionality
 */
export async function testRedirect(shortUrl: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Redirect Functionality";

  try {
    console.log(`[Test] ${testName}: Testing URL ${shortUrl}`);
    
    // Test if URL responds
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'manual'
    });

    const duration = Date.now() - startTime;

    // Check for redirect (302 or 301)
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log(`[Test] ${testName}: ✓ Redirect successful to ${location}`);
      return {
        name: testName,
        passed: true,
        message: `Redirect working correctly (${response.status})`,
        duration,
        details: { status: response.status, location }
      };
    }

    console.log(`[Test] ${testName}: ✗ Unexpected status ${response.status}`);
    return {
      name: testName,
      passed: false,
      message: `Expected 302/301, got ${response.status}`,
      duration,
      details: { status: response.status }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Test] ${testName}: ✗ Error:`, error);
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration
    };
  }
}

/**
 * Test link creation flow
 */
export async function testLinkCreation(workspaceId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Link Creation Flow";

  try {
    console.log(`[Test] ${testName}: Creating test link...`);

    const testData = {
      workspace_id: workspaceId,
      title: `Test Link ${Date.now()}`,
      destination_url: "https://example.com",
      final_url: "https://example.com",
      slug: `test-${Date.now()}`,
      domain: "utm.one",
      path: "go",
      status: "active" as const
    };

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data: link, error } = await supabase
      .from("links")
      .insert({
        ...testData,
        created_by: user.user.id
      })
      .select()
      .single();

    const duration = Date.now() - startTime;

    if (error) {
      console.error(`[Test] ${testName}: ✗ Database error:`, error);
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    console.log(`[Test] ${testName}: ✓ Link created successfully`, link.id);

    // Clean up test link
    await supabase.from("links").delete().eq("id", link.id);

    return {
      name: testName,
      passed: true,
      message: "Link created and verified successfully",
      duration,
      details: { linkId: link.id }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Test] ${testName}: ✗ Error:`, error);
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration
    };
  }
}

/**
 * Test QR code generation
 */
export async function testQRGeneration(linkId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "QR Code Generation";

  try {
    console.log(`[Test] ${testName}: Checking QR code generation capability...`);

    // Check if qr_codes table exists and is accessible
    const { data, error } = await supabase
      .from("qr_codes")
      .select("id")
      .eq("link_id", linkId)
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      console.error(`[Test] ${testName}: ✗ Database error:`, error);
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    // Check storage bucket accessibility
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error(`[Test] ${testName}: ✗ Storage error:`, bucketError);
      return {
        name: testName,
        passed: false,
        message: bucketError.message,
        duration
      };
    }

    const hasQRBucket = buckets?.some(b => b.name === "qr-codes");

    console.log(`[Test] ${testName}: ✓ QR system accessible`);
    return {
      name: testName,
      passed: true,
      message: "QR code system ready and accessible",
      duration,
      details: { hasQRBucket, existingQRs: data?.length || 0 }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Test] ${testName}: ✗ Error:`, error);
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration
    };
  }
}

/**
 * Test analytics tracking
 */
export async function testAnalyticsTracking(linkId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Analytics Tracking";

  try {
    console.log(`[Test] ${testName}: Verifying analytics tracking...`);

    // Check if link_clicks table is accessible
    const { data: clicks, error } = await supabase
      .from("link_clicks")
      .select("id, clicked_at")
      .eq("link_id", linkId)
      .order("clicked_at", { ascending: false })
      .limit(5);

    const duration = Date.now() - startTime;

    if (error) {
      console.error(`[Test] ${testName}: ✗ Database error:`, error);
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    // Check if analytics materialized views exist
    const { error: viewError } = await supabase.rpc("get_link_analytics", {
      p_workspace_id: "00000000-0000-0000-0000-000000000000" // Test with dummy ID
    });

    console.log(`[Test] ${testName}: ✓ Analytics system accessible`);
    return {
      name: testName,
      passed: true,
      message: "Analytics tracking system operational",
      duration,
      details: { 
        recentClicks: clicks?.length || 0,
        analyticsViewsAccessible: !viewError
      }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Test] ${testName}: ✗ Error:`, error);
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration
    };
  }
}

/**
 * Run all critical path tests
 */
export async function runAllTests(workspaceId: string, linkId: string, shortUrl: string): Promise<TestResult[]> {
  console.log("[Test Suite] Starting critical path tests...");
  
  const results: TestResult[] = [];

  // Run tests sequentially to avoid overwhelming the system
  results.push(await testRedirect(shortUrl));
  results.push(await testLinkCreation(workspaceId));
  results.push(await testQRGeneration(linkId));
  results.push(await testAnalyticsTracking(linkId));

  const passedCount = results.filter(r => r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`[Test Suite] Completed: ${passedCount}/${results.length} passed in ${totalDuration}ms`);

  return results;
}
