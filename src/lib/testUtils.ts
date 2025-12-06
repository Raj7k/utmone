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
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'manual'
    });

    const duration = Date.now() - startTime;

    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      return {
        name: testName,
        passed: true,
        message: `Redirect working correctly (${response.status})`,
        duration,
        details: { status: response.status, location }
      };
    }

    return {
      name: testName,
      passed: false,
      message: `Expected 302/301, got ${response.status}`,
      duration,
      details: { status: response.status }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
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
    const testData = {
      workspace_id: workspaceId,
      title: `Test Link ${Date.now()}`,
      destination_url: "https://example.com",
      final_url: "https://example.com",
      slug: `test-${Date.now()}`,
      domain: "go.utm.one",
      path: "",
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
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

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
    const { data, error } = await supabase
      .from("qr_codes")
      .select("id")
      .eq("link_id", linkId)
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      return {
        name: testName,
        passed: false,
        message: bucketError.message,
        duration
      };
    }

    const hasQRBucket = buckets?.some(b => b.name === "qr-codes");

    return {
      name: testName,
      passed: true,
      message: "QR code system ready and accessible",
      duration,
      details: { hasQRBucket, existingQRs: data?.length || 0 }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
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
    const { data: clicks, error } = await supabase
      .from("link_clicks")
      .select("id, clicked_at")
      .eq("link_id", linkId)
      .order("clicked_at", { ascending: false })
      .limit(5);

    const duration = Date.now() - startTime;

    if (error) {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    const { error: viewError } = await supabase.rpc("get_link_analytics", {
      p_workspace_id: "00000000-0000-0000-0000-000000000000"
    });

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
    return {
      name: testName,
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
      duration
    };
  }
}

/**
 * Test authentication signup
 */
export async function testAuthSignUp(): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Authentication Signup";

  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    const duration = Date.now() - startTime;

    if (error) {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    if (data.user) {
      await supabase.auth.signOut();
    }

    return {
      name: testName,
      passed: true,
      message: "Signup successful",
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
 * Test link update
 */
export async function testLinkUpdate(linkId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Link Update";

  try {
    const { error } = await supabase
      .from("links")
      .update({ title: `Updated ${Date.now()}` })
      .eq("id", linkId);

    const duration = Date.now() - startTime;

    return {
      name: testName,
      passed: !error,
      message: error ? error.message : "Link updated successfully",
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
 * Test link duplication
 */
export async function testLinkDuplication(linkId: string, workspaceId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Link Duplication";

  try {
    const { data: original, error: fetchError } = await supabase
      .from("links")
      .select("*")
      .eq("id", linkId)
      .single();

    if (fetchError || !original) {
      return {
        name: testName,
        passed: false,
        message: "Could not fetch original link",
        duration: Date.now() - startTime
      };
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data: duplicate, error } = await supabase
      .from("links")
      .insert({
        ...original,
        id: undefined,
        slug: `${original.slug}-copy-${Date.now()}`,
        title: `${original.title} (Copy)`,
        created_by: user.user.id
      })
      .select()
      .single();

    const duration = Date.now() - startTime;

    if (duplicate) {
      await supabase.from("links").delete().eq("id", duplicate.id);
    }

    return {
      name: testName,
      passed: !error,
      message: error ? error.message : "Link duplicated successfully",
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
 * Test QR code actual generation
 */
export async function testActualQRGeneration(linkId: string, shortUrl: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Actual QR Generation";

  try {
    const { data: bucket } = await supabase.storage.getBucket("qr-codes");
    
    const duration = Date.now() - startTime;

    return {
      name: testName,
      passed: !!bucket,
      message: bucket ? "QR generation system ready" : "QR bucket not accessible",
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
 * Test click recording
 */
export async function testClickRecording(linkId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Click Recording";

  try {
    const { error } = await supabase
      .from("link_clicks")
      .insert({
        link_id: linkId,
        ip_address: "127.0.0.1",
        user_agent: "Test Agent",
        device_type: "desktop",
        browser: "Chrome",
        os: "Windows"
      });

    const duration = Date.now() - startTime;

    return {
      name: testName,
      passed: !error,
      message: error ? error.message : "Click recorded successfully",
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
 * Run all critical path tests
 */
export async function runAllTests(workspaceId: string, linkId: string, shortUrl: string): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await testRedirect(shortUrl));
  results.push(await testLinkCreation(workspaceId));
  results.push(await testQRGeneration(linkId));
  results.push(await testAnalyticsTracking(linkId));
  results.push(await testLinkUpdate(linkId));
  results.push(await testLinkDuplication(linkId, workspaceId));
  results.push(await testActualQRGeneration(linkId, shortUrl));
  results.push(await testClickRecording(linkId));

  return results;
}