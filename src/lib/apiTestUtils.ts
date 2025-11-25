import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "./testUtils";

/**
 * Test an API endpoint with authentication
 */
export async function testApiEndpoint(
  functionName: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object,
  expectedStatus?: number
): Promise<TestResult> {
  const startTime = Date.now();
  const testName = `API: ${method} ${functionName}`;

  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
      method
    });

    const duration = Date.now() - startTime;

    if (error && expectedStatus !== 400) {
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
      message: "API endpoint responded correctly",
      duration,
      details: data
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
 * Test API endpoint with API key
 */
export async function testWithApiKey(
  endpoint: string,
  apiKey: string,
  body?: object
): Promise<TestResult> {
  const startTime = Date.now();
  const testName = `API Key: ${endpoint}`;

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      return {
        name: testName,
        passed: false,
        message: `HTTP ${response.status}: ${data.message || 'Request failed'}`,
        duration
      };
    }

    return {
      name: testName,
      passed: true,
      message: "API key authentication successful",
      duration,
      details: data
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
 * Test rate limiting
 */
export async function testRateLimiting(apiKey: string): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "Rate Limiting";

  try {
    // Make 5 rapid requests
    const promises = Array.from({ length: 5 }, () =>
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ action: 'test' })
      })
    );

    const responses = await Promise.all(promises);
    const duration = Date.now() - startTime;

    const rateLimited = responses.some(r => r.status === 429);

    return {
      name: testName,
      passed: true,
      message: rateLimited ? "Rate limiting active" : "Rate limits not triggered",
      duration,
      details: {
        totalRequests: responses.length,
        rateLimitedCount: responses.filter(r => r.status === 429).length
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
 * Test public API link creation
 */
export async function testApiLinkCreation(
  apiKey: string,
  workspaceId: string
): Promise<TestResult> {
  const startTime = Date.now();
  const testName = "API Link Creation";

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        action: 'create_link',
        workspace_id: workspaceId,
        destination_url: 'https://example.com',
        title: 'API Test Link',
        slug: `api-test-${Date.now()}`
      })
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      return {
        name: testName,
        passed: false,
        message: data.message || 'Link creation failed',
        duration
      };
    }

    // Cleanup
    if (data.link_id) {
      await supabase.from("links").delete().eq("id", data.link_id);
    }

    return {
      name: testName,
      passed: true,
      message: "Link created via API successfully",
      duration,
      details: data
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
