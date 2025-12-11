export interface CrmProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  tier: 'starter' | 'growth' | 'business' | 'enterprise';
  authType: 'oauth' | 'api_key';
  description: string;
  fieldMapping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    title: string;
    source: string;
    linkedinUrl?: string;
  };
  endpoints: {
    createContact: string;
    updateContact: string;
  };
}

export const CRM_PROVIDERS: Record<string, CrmProvider> = {
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    icon: 'hubspot',
    color: '#FF7A59',
    tier: 'growth',
    authType: 'oauth',
    description: 'Marketing, sales, and service CRM platform',
    fieldMapping: {
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email',
      phone: 'phone',
      company: 'company',
      title: 'jobtitle',
      source: 'hs_lead_status',
      linkedinUrl: 'linkedin_url'
    },
    endpoints: {
      createContact: '/crm/v3/objects/contacts',
      updateContact: '/crm/v3/objects/contacts/{id}'
    }
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    icon: 'salesforce',
    color: '#00A1E0',
    tier: 'business',
    authType: 'oauth',
    description: 'Enterprise CRM and sales automation',
    fieldMapping: {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      title: 'Title',
      source: 'LeadSource',
      linkedinUrl: 'LinkedIn_URL__c'
    },
    endpoints: {
      createContact: '/services/data/v58.0/sobjects/Lead',
      updateContact: '/services/data/v58.0/sobjects/Lead/{id}'
    }
  },
  zoho: {
    id: 'zoho',
    name: 'Zoho CRM',
    icon: 'zoho',
    color: '#E42527',
    tier: 'growth',
    authType: 'oauth',
    description: 'All-in-one CRM for growing businesses',
    fieldMapping: {
      firstName: 'First_Name',
      lastName: 'Last_Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      title: 'Designation',
      source: 'Lead_Source',
      linkedinUrl: 'LinkedIn'
    },
    endpoints: {
      createContact: '/crm/v3/Leads',
      updateContact: '/crm/v3/Leads/{id}'
    }
  },
  pipedrive: {
    id: 'pipedrive',
    name: 'Pipedrive',
    icon: 'pipedrive',
    color: '#017737',
    tier: 'growth',
    authType: 'api_key',
    description: 'Sales-focused CRM for small teams',
    fieldMapping: {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      phone: 'phone',
      company: 'org_name',
      title: 'job_title',
      source: 'lead_source',
      linkedinUrl: 'linkedin'
    },
    endpoints: {
      createContact: '/api/v1/persons',
      updateContact: '/api/v1/persons/{id}'
    }
  }
};

export const getCrmProvider = (id: string): CrmProvider | undefined => {
  return CRM_PROVIDERS[id];
};

export const getAvailableCrms = (userTier: string): CrmProvider[] => {
  const tierOrder = ['starter', 'growth', 'business', 'enterprise'];
  const userTierIndex = tierOrder.indexOf(userTier);
  
  return Object.values(CRM_PROVIDERS).filter(crm => {
    const crmTierIndex = tierOrder.indexOf(crm.tier);
    return crmTierIndex <= userTierIndex;
  });
};

export const getAllCrms = (): CrmProvider[] => {
  return Object.values(CRM_PROVIDERS);
};
