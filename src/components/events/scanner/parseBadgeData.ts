// Badge data parsing utilities for vCard, MECARD, JSON, and plain text formats

export interface ParsedBadgeData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  company?: string;
  title?: string;
  phone?: string;
  linkedinUrl?: string;
  rawData: string;
  parseMethod: 'vcard' | 'mecard' | 'json' | 'email' | 'url' | 'encrypted' | 'plain';
  confidence: number; // 0-100
}

// Parse vCard format (BEGIN:VCARD ... END:VCARD)
function parseVCard(data: string): ParsedBadgeData | null {
  if (!data.includes('BEGIN:VCARD')) return null;
  
  const result: ParsedBadgeData = {
    rawData: data,
    parseMethod: 'vcard',
    confidence: 95
  };
  
  // Extract fields using regex
  const fnMatch = data.match(/FN[;:]([^\r\n]+)/i);
  if (fnMatch) result.fullName = fnMatch[1].trim();
  
  const nMatch = data.match(/N[;:]([^\r\n]+)/i);
  if (nMatch) {
    const parts = nMatch[1].split(';');
    result.lastName = parts[0]?.trim();
    result.firstName = parts[1]?.trim();
  }
  
  const emailMatch = data.match(/EMAIL[;:]([^\r\n]+)/i);
  if (emailMatch) result.email = emailMatch[1].replace(/^[^:]+:/, '').trim();
  
  const orgMatch = data.match(/ORG[;:]([^\r\n]+)/i);
  if (orgMatch) result.company = orgMatch[1].split(';')[0].trim();
  
  const titleMatch = data.match(/TITLE[;:]([^\r\n]+)/i);
  if (titleMatch) result.title = titleMatch[1].trim();
  
  const telMatch = data.match(/TEL[;:]([^\r\n]+)/i);
  if (telMatch) result.phone = telMatch[1].replace(/^[^:]+:/, '').trim();
  
  const urlMatch = data.match(/URL[;:]([^\r\n]+)/i);
  if (urlMatch && urlMatch[1].includes('linkedin')) {
    result.linkedinUrl = urlMatch[1].trim();
  }
  
  return result;
}

// Parse MECARD format (MECARD:N:Doe,John;TEL:...)
function parseMECARD(data: string): ParsedBadgeData | null {
  if (!data.startsWith('MECARD:')) return null;
  
  const result: ParsedBadgeData = {
    rawData: data,
    parseMethod: 'mecard',
    confidence: 90
  };
  
  const fields = data.substring(7).split(';');
  
  for (const field of fields) {
    const [key, ...valueParts] = field.split(':');
    const value = valueParts.join(':');
    
    switch (key?.toUpperCase()) {
      case 'N':
        const nameParts = value.split(',');
        result.lastName = nameParts[0]?.trim();
        result.firstName = nameParts[1]?.trim();
        break;
      case 'EMAIL':
        result.email = value.trim();
        break;
      case 'ORG':
        result.company = value.trim();
        break;
      case 'TITLE':
        result.title = value.trim();
        break;
      case 'TEL':
        result.phone = value.trim();
        break;
    }
  }
  
  return result;
}

// Parse JSON format
function parseJSON(data: string): ParsedBadgeData | null {
  try {
    const json = JSON.parse(data);
    
    const result: ParsedBadgeData = {
      rawData: data,
      parseMethod: 'json',
      confidence: 85
    };
    
    // Handle various JSON structures
    result.firstName = json.firstName || json.first_name || json.fname;
    result.lastName = json.lastName || json.last_name || json.lname;
    result.fullName = json.name || json.fullName || json.full_name;
    result.email = json.email || json.emailAddress || json.email_address;
    result.company = json.company || json.organization || json.org;
    result.title = json.title || json.jobTitle || json.job_title || json.position;
    result.phone = json.phone || json.phoneNumber || json.phone_number || json.tel;
    
    // If no structured data found, return null
    if (!result.email && !result.fullName && !result.firstName) {
      return null;
    }
    
    return result;
  } catch {
    return null;
  }
}

// Check if data is just an email
function parseEmail(data: string): ParsedBadgeData | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = data.trim();
  
  if (emailRegex.test(trimmed)) {
    return {
      email: trimmed,
      rawData: data,
      parseMethod: 'email',
      confidence: 100
    };
  }
  
  // Check if email is embedded in text
  const emailMatch = data.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  if (emailMatch) {
    return {
      email: emailMatch[0],
      rawData: data,
      parseMethod: 'email',
      confidence: 70
    };
  }
  
  return null;
}

// Check if data is a URL (could be digital business card)
function parseURL(data: string): ParsedBadgeData | null {
  try {
    const url = new URL(data.trim());
    
    return {
      rawData: data,
      parseMethod: 'url',
      confidence: 50,
      linkedinUrl: url.hostname.includes('linkedin') ? data.trim() : undefined
    };
  } catch {
    return null;
  }
}

// Detect if data is encrypted/proprietary
function isEncryptedData(data: string): boolean {
  // Heuristics for detecting encrypted/proprietary codes
  const trimmed = data.trim();
  
  // Very short alphanumeric strings are likely IDs
  if (/^[A-Za-z0-9]{6,20}$/.test(trimmed)) return true;
  
  // Base64-like strings without recognizable structure
  if (/^[A-Za-z0-9+/=]{20,}$/.test(trimmed) && !trimmed.includes(':')) return true;
  
  // Strings with only numbers (badge IDs)
  if (/^\d{6,}$/.test(trimmed)) return true;
  
  // Contains "ID" pattern
  if (/^(id|badge|reg|attendee)[:\s#-]?\d+$/i.test(trimmed)) return true;
  
  return false;
}

// Main parsing function - tries all parsers in order
export function parseBadgeData(rawData: string): ParsedBadgeData {
  const data = rawData.trim();
  
  // Try structured formats first
  const vcard = parseVCard(data);
  if (vcard) return vcard;
  
  const mecard = parseMECARD(data);
  if (mecard) return mecard;
  
  const json = parseJSON(data);
  if (json) return json;
  
  const email = parseEmail(data);
  if (email) return email;
  
  const url = parseURL(data);
  if (url) return url;
  
  // Check if encrypted/proprietary
  if (isEncryptedData(data)) {
    return {
      rawData: data,
      parseMethod: 'encrypted',
      confidence: 0
    };
  }
  
  // Plain text fallback
  return {
    rawData: data,
    parseMethod: 'plain',
    confidence: 10
  };
}

// Extract name parts from full name
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}