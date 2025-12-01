/**
 * Role Recommendation using Discrete Optimization
 * Based on Chapter 22: Constraint Satisfaction
 * Minimize privilege subject to capability constraints
 */

export type Capability = 
  | 'create_link'
  | 'edit_link'
  | 'delete_link'
  | 'view_analytics'
  | 'export_data'
  | 'invite_members'
  | 'manage_members'
  | 'view_billing'
  | 'manage_billing'
  | 'manage_domains'
  | 'manage_integrations';

export interface RoleDefinition {
  role: 'owner' | 'workspace_admin' | 'editor' | 'contributor' | 'viewer' | 'analyst';
  displayName: string;
  capabilities: Capability[];
  privilegeLevel: number; // Lower = less privilege (better for security)
  description: string;
}

const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'viewer',
    displayName: 'Viewer',
    capabilities: [],
    privilegeLevel: 1,
    description: 'Read-only access to links and basic analytics'
  },
  {
    role: 'analyst',
    displayName: 'Analyst',
    capabilities: ['view_analytics', 'export_data'],
    privilegeLevel: 2,
    description: 'View detailed analytics and export reports'
  },
  {
    role: 'contributor',
    displayName: 'Contributor',
    capabilities: ['create_link', 'view_analytics'],
    privilegeLevel: 3,
    description: 'Create links (requires approval) and view analytics'
  },
  {
    role: 'editor',
    displayName: 'Editor',
    capabilities: ['create_link', 'edit_link', 'view_analytics', 'export_data'],
    privilegeLevel: 4,
    description: 'Full link management and analytics access'
  },
  {
    role: 'workspace_admin',
    displayName: 'Admin',
    capabilities: [
      'create_link',
      'edit_link',
      'delete_link',
      'view_analytics',
      'export_data',
      'invite_members',
      'manage_members',
      'manage_domains',
      'manage_integrations'
    ],
    privilegeLevel: 5,
    description: 'Full workspace management except billing'
  },
  {
    role: 'owner',
    displayName: 'Owner',
    capabilities: [
      'create_link',
      'edit_link',
      'delete_link',
      'view_analytics',
      'export_data',
      'invite_members',
      'manage_members',
      'view_billing',
      'manage_billing',
      'manage_domains',
      'manage_integrations'
    ],
    privilegeLevel: 6,
    description: 'Full access including billing and ownership transfer'
  }
];

export interface RoleRecommendation {
  role: RoleDefinition;
  matchedCapabilities: Capability[];
  extraCapabilities: Capability[];
  isExactMatch: boolean;
}

/**
 * Recommend the role with least privilege that satisfies all required capabilities
 * Constraint Satisfaction: minimize privilege subject to "User must be able to do X, Y, Z"
 */
export function recommendRole(requiredCapabilities: Capability[]): RoleRecommendation {
  // Find all roles that satisfy the requirements
  const satisfyingRoles = ROLE_DEFINITIONS.filter(roleDef => {
    return requiredCapabilities.every(cap => roleDef.capabilities.includes(cap));
  });

  if (satisfyingRoles.length === 0) {
    // No role satisfies all requirements - return owner (edge case)
    const owner = ROLE_DEFINITIONS.find(r => r.role === 'owner')!;
    return {
      role: owner,
      matchedCapabilities: requiredCapabilities,
      extraCapabilities: owner.capabilities.filter(c => !requiredCapabilities.includes(c)),
      isExactMatch: false
    };
  }

  // Sort by privilege level (ascending) and find the one with minimum extra capabilities
  const bestRole = satisfyingRoles.reduce((best, current) => {
    const bestExtras = best.capabilities.filter(c => !requiredCapabilities.includes(c)).length;
    const currentExtras = current.capabilities.filter(c => !requiredCapabilities.includes(c)).length;
    
    // Prefer role with fewer extra capabilities (Least Privilege)
    if (currentExtras < bestExtras) return current;
    if (currentExtras === bestExtras && current.privilegeLevel < best.privilegeLevel) return current;
    return best;
  });

  const extraCapabilities = bestRole.capabilities.filter(
    c => !requiredCapabilities.includes(c)
  );

  return {
    role: bestRole,
    matchedCapabilities: requiredCapabilities,
    extraCapabilities,
    isExactMatch: extraCapabilities.length === 0
  };
}

export function getAllCapabilities(): Array<{ value: Capability; label: string; description: string }> {
  return [
    { value: 'create_link', label: 'Create Links', description: 'Create new short links' },
    { value: 'edit_link', label: 'Edit Links', description: 'Modify existing links' },
    { value: 'delete_link', label: 'Delete Links', description: 'Permanently delete links' },
    { value: 'view_analytics', label: 'View Analytics', description: 'Access click data and reports' },
    { value: 'export_data', label: 'Export Data', description: 'Download analytics as CSV/Excel' },
    { value: 'invite_members', label: 'Invite Members', description: 'Send team invitations' },
    { value: 'manage_members', label: 'Manage Members', description: 'Remove members and change roles' },
    { value: 'view_billing', label: 'View Billing', description: 'See subscription and usage' },
    { value: 'manage_billing', label: 'Manage Billing', description: 'Upgrade/downgrade plans' },
    { value: 'manage_domains', label: 'Manage Domains', description: 'Add and configure custom domains' },
    { value: 'manage_integrations', label: 'Manage Integrations', description: 'Connect external services' }
  ];
}

export { ROLE_DEFINITIONS };
