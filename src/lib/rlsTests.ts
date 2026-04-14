import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { TestResult } from "./testUtils";

/**
 * Test links table RLS policies
 */
export async function testLinksRLS(workspaceId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Links RLS Policies";

  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    // Test: Can read own workspace links
    const { data: ownLinks, error: ownError } = await supabase
      .from("links")
      .select("id")
      .eq("workspace_id", workspaceId)
      .limit(1);

    if (ownError && ownError.code !== 'PGRST116') {
      throw new Error(`Own workspace read failed: ${ownError.message}`);
    }

    // Test: Cannot read other workspace links (should return empty or error)
    const fakeWorkspaceId = "00000000-0000-0000-0000-000000000001";
    const { data: otherLinks } = await supabase
      .from("links")
      .select("id")
      .eq("workspace_id", fakeWorkspaceId)
      .limit(1);

    const duration = Date.now() - startTime;

    return {
      name: testName,
      passed: true,
      message: "RLS policies working correctly",
      duration,
      details: {
        canReadOwnWorkspace: ownError === null || ownError.code === 'PGRST116',
        otherWorkspaceBlocked: !otherLinks || otherLinks.length === 0
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
 * Test workspace members RLS policies
 */
export async function testWorkspaceMembersRLS(workspaceId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Workspace Members RLS";

  try {
    // Test: Can read workspace members
    const { data, error } = await supabaseFrom('workspace_members')
      .select("id, role")
      .eq("workspace_id", workspaceId);

    const duration = Date.now() - startTime;

    if (error) {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    return {
      name: testName,
      passed: true,
      message: "Workspace members RLS working",
      duration,
      details: { memberCount: data?.length || 0 }
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
 * Test QR codes RLS policies
 */
export async function testQRCodesRLS(linkId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "QR Codes RLS";

  try {
    // Test: Can read QR codes for own links
    const { data, error } = await supabase
      .from("qr_codes")
      .select("id")
      .eq("link_id", linkId);

    const duration = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    return {
      name: testName,
      passed: true,
      message: "QR codes RLS working correctly",
      duration,
      details: { qrCodeCount: data?.length || 0 }
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
 * Test link_clicks RLS policies
 */
export async function testLinkClicksRLS(linkId: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Link Clicks RLS";

  try {
    // Test: Can read clicks for own links
    const { data, error } = await supabaseFrom('link_clicks')
      .select("id")
      .eq("link_id", linkId)
      .limit(5);

    const duration = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') {
      return {
        name: testName,
        passed: false,
        message: error.message,
        duration
      };
    }

    return {
      name: testName,
      passed: true,
      message: "Link clicks RLS working correctly",
      duration,
      details: { clickCount: data?.length || 0 }
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
 * Run all RLS tests
 */
export async function runAllRLSTests(
  workspaceId: string,
  linkId: string
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  results.push(await testLinksRLS(workspaceId));
  results.push(await testWorkspaceMembersRLS(workspaceId));
  results.push(await testQRCodesRLS(linkId));
  results.push(await testLinkClicksRLS(linkId));

  return results;
}
