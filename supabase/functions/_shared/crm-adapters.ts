// CRM Adapter Interface and Implementations

export interface ContactData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface CrmCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  instanceUrl?: string;
}

export interface CrmAdapter {
  pushContact(credentials: CrmCredentials, contact: ContactData): Promise<{ success: boolean; externalId?: string; error?: string }>;
}

// HubSpot Adapter
export const hubspotAdapter: CrmAdapter = {
  async pushContact(credentials: CrmCredentials, contact: ContactData) {
    try {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            firstname: contact.firstName || '',
            lastname: contact.lastName || '',
            email: contact.email,
            phone: contact.phone || '',
            company: contact.company || '',
            jobtitle: contact.title || '',
            hs_lead_status: contact.source || 'Event Lead',
            linkedin_url: contact.linkedinUrl || '',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] HubSpot push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('[CRM-Adapter] HubSpot contact created:', data.id);
      return { success: true, externalId: data.id };
    } catch (error) {
      console.error('[CRM-Adapter] HubSpot error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Salesforce Adapter
export const salesforceAdapter: CrmAdapter = {
  async pushContact(credentials: CrmCredentials, contact: ContactData) {
    try {
      const response = await fetch(
        `${credentials.instanceUrl}/services/data/v58.0/sobjects/Lead`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: contact.firstName || '',
            LastName: contact.lastName || contact.email.split('@')[0],
            Email: contact.email,
            Phone: contact.phone || '',
            Company: contact.company || 'Unknown',
            Title: contact.title || '',
            LeadSource: contact.source || 'Event',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] Salesforce push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('[CRM-Adapter] Salesforce lead created:', data.id);
      return { success: true, externalId: data.id };
    } catch (error) {
      console.error('[CRM-Adapter] Salesforce error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Zoho CRM Adapter
export const zohoAdapter: CrmAdapter = {
  async pushContact(credentials: CrmCredentials, contact: ContactData) {
    try {
      const response = await fetch('https://www.zohoapis.com/crm/v3/Leads', {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{
            First_Name: contact.firstName || '',
            Last_Name: contact.lastName || contact.email.split('@')[0],
            Email: contact.email,
            Phone: contact.phone || '',
            Company: contact.company || 'Unknown',
            Designation: contact.title || '',
            Lead_Source: contact.source || 'Event',
            LinkedIn: contact.linkedinUrl || '',
          }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] Zoho push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      const leadId = data.data?.[0]?.details?.id;
      console.log('[CRM-Adapter] Zoho lead created:', leadId);
      return { success: true, externalId: leadId };
    } catch (error) {
      console.error('[CRM-Adapter] Zoho error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Pipedrive Adapter
export const pipedriveAdapter: CrmAdapter = {
  async pushContact(credentials: CrmCredentials, contact: ContactData) {
    try {
      const response = await fetch(
        `https://api.pipedrive.com/v1/persons?api_token=${credentials.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email,
            email: [{ value: contact.email, primary: true }],
            phone: contact.phone ? [{ value: contact.phone, primary: true }] : [],
            org_name: contact.company || '',
            job_title: contact.title || '',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('[CRM-Adapter] Pipedrive push failed:', error);
        return { success: false, error };
      }

      const data = await response.json();
      console.log('[CRM-Adapter] Pipedrive person created:', data.data?.id);
      return { success: true, externalId: String(data.data?.id) };
    } catch (error) {
      console.error('[CRM-Adapter] Pipedrive error:', error);
      return { success: false, error: String(error) };
    }
  },
};

// Adapter Factory
const adapters: Record<string, CrmAdapter> = {
  hubspot: hubspotAdapter,
  salesforce: salesforceAdapter,
  zoho: zohoAdapter,
  pipedrive: pipedriveAdapter,
};

export const getCrmAdapter = (providerId: string): CrmAdapter | null => {
  return adapters[providerId] || null;
};

export const pushToAllCrms = async (
  crmTargets: string[],
  credentialsMap: Record<string, CrmCredentials>,
  contact: ContactData
): Promise<Record<string, { success: boolean; externalId?: string; error?: string }>> => {
  const results: Record<string, { success: boolean; externalId?: string; error?: string }> = {};

  for (const crmId of crmTargets) {
    const adapter = getCrmAdapter(crmId);
    const credentials = credentialsMap[crmId];

    if (!adapter) {
      results[crmId] = { success: false, error: `Unknown CRM: ${crmId}` };
      continue;
    }

    if (!credentials) {
      results[crmId] = { success: false, error: `No credentials for: ${crmId}` };
      continue;
    }

    results[crmId] = await adapter.pushContact(credentials, contact);
  }

  return results;
};
