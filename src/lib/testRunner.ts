import { TestResult } from "./testUtils";

/**
 * Test categorization for organized test execution
 */
export type TestCategory = 
  | 'authentication'
  | 'link-management'
  | 'qr-codes'
  | 'team-management'
  | 'analytics'
  | 'redirects'
  | 'api'
  | 'database';

export interface TestSuite {
  name: string;
  category: TestCategory;
  description: string;
  tests: Array<{
    name: string;
    fn: () => Promise<TestResult>;
  }>;
}

export interface TestRunHistory {
  timestamp: string;
  category: TestCategory | 'all';
  results: TestResult[];
  passRate: number;
  totalDuration: number;
}

/**
 * Run all tests in a specific category
 */
export async function runTestsByCategory(
  category: TestCategory,
  testSuites: TestSuite[]
): Promise<TestResult[]> {
  console.log(`[Test Runner] Starting tests for category: ${category}`);
  
  const results: TestResult[] = [];
  const categoryTests = testSuites.filter(suite => suite.category === category);
  
  for (const suite of categoryTests) {
    for (const test of suite.tests) {
      try {
        const result = await test.fn();
        results.push(result);
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          message: error instanceof Error ? error.message : "Unknown error",
          duration: 0
        });
      }
    }
  }
  
  return results;
}

/**
 * Run all test suites
 */
export async function runAllTestSuites(
  testSuites: TestSuite[]
): Promise<{ category: string; results: TestResult[] }[]> {
  console.log(`[Test Runner] Starting all test suites...`);
  
  const allResults: { category: string; results: TestResult[] }[] = [];
  
  for (const suite of testSuites) {
    const results: TestResult[] = [];
    
    for (const test of suite.tests) {
      try {
        const result = await test.fn();
        results.push(result);
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          message: error instanceof Error ? error.message : "Unknown error",
          duration: 0
        });
      }
    }
    
    allResults.push({
      category: suite.name,
      results
    });
  }
  
  return allResults;
}

/**
 * Save test run to history (localStorage)
 */
export function saveTestHistory(
  category: TestCategory | 'all',
  results: TestResult[]
): void {
  const history = getTestHistory();
  
  const passedCount = results.filter(r => r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  const newEntry: TestRunHistory = {
    timestamp: new Date().toISOString(),
    category,
    results,
    passRate: (passedCount / results.length) * 100,
    totalDuration
  };
  
  history.unshift(newEntry);
  
  // Keep only last 10 runs
  const trimmedHistory = history.slice(0, 10);
  
  localStorage.setItem('test-history', JSON.stringify(trimmedHistory));
}

/**
 * Get test run history from localStorage
 */
export function getTestHistory(): TestRunHistory[] {
  try {
    const stored = localStorage.getItem('test-history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear test history
 */
export function clearTestHistory(): void {
  localStorage.removeItem('test-history');
}

/**
 * Export test results as JSON
 */
export function exportTestResults(results: TestResult[]): void {
  const dataStr = JSON.stringify(results, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `test-results-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
