import { 
  Link2, 
  Type, 
  Mail, 
  Phone, 
  MessageSquare, 
  Wifi, 
  MapPin, 
  Calendar, 
  Contact 
} from "lucide-react";

export type ContentType = 
  | "url" 
  | "text" 
  | "email" 
  | "phone" 
  | "sms" 
  | "wifi" 
  | "location" 
  | "event" 
  | "vcard";

export interface ContentTypeConfig {
  id: ContentType;
  label: string;
  icon: typeof Link2;
  description: string;
}

export const CONTENT_TYPES: ContentTypeConfig[] = [
  { id: "url", label: "URL", icon: Link2, description: "website link" },
  { id: "text", label: "text", icon: Type, description: "plain text" },
  { id: "email", label: "email", icon: Mail, description: "send email" },
  { id: "phone", label: "phone", icon: Phone, description: "call number" },
  { id: "sms", label: "SMS", icon: MessageSquare, description: "send text" },
  { id: "wifi", label: "WiFi", icon: Wifi, description: "join network" },
  { id: "location", label: "location", icon: MapPin, description: "open maps" },
  { id: "event", label: "event", icon: Calendar, description: "add to calendar" },
  { id: "vcard", label: "vCard", icon: Contact, description: "save contact" },
];

// QR format generators
export interface EmailData {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneData {
  phone: string;
}

export interface SMSData {
  phone: string;
  message?: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  label?: string;
}

export interface EventData {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location?: string;
  description?: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  company?: string;
  title?: string;
  website?: string;
  address?: string;
}

// Format generators
export function generateEmailQR(data: EmailData): string {
  if (!data.email) return "";
  let url = `mailto:${data.email}`;
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  if (params.length > 0) url += `?${params.join("&")}`;
  return url;
}

export function generatePhoneQR(data: PhoneData): string {
  if (!data.phone) return "";
  return `tel:${data.phone.replace(/\s/g, "")}`;
}

export function generateSMSQR(data: SMSData): string {
  if (!data.phone) return "";
  let url = `sms:${data.phone.replace(/\s/g, "")}`;
  if (data.message) url += `?body=${encodeURIComponent(data.message)}`;
  return url;
}

export function generateWifiQR(data: WifiData): string {
  if (!data.ssid) return "";
  const hidden = data.hidden ? "H:true;" : "";
  const password = data.encryption !== "nopass" ? `P:${data.password};` : "";
  return `WIFI:T:${data.encryption};S:${data.ssid};${password}${hidden};`;
}

export function generateLocationQR(data: LocationData): string {
  if (!data.latitude || !data.longitude) return "";
  let url = `geo:${data.latitude},${data.longitude}`;
  if (data.label) url += `?q=${encodeURIComponent(data.label)}`;
  return url;
}

export function generateEventQR(data: EventData): string {
  if (!data.title || !data.startDate || !data.startTime) return "";
  
  const formatDateTime = (date: string, time: string) => {
    return `${date.replace(/-/g, "")}T${time.replace(/:/g, "")}00`;
  };

  const start = formatDateTime(data.startDate, data.startTime);
  const end = data.endDate && data.endTime 
    ? formatDateTime(data.endDate, data.endTime)
    : formatDateTime(data.startDate, data.startTime);

  let vcal = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${data.title}`;
  
  if (data.location) vcal += `\nLOCATION:${data.location}`;
  if (data.description) vcal += `\nDESCRIPTION:${data.description}`;
  
  vcal += `\nEND:VEVENT
END:VCALENDAR`;
  
  return vcal;
}

export function generateVCardQR(data: VCardData): string {
  if (!data.firstName && !data.lastName) return "";
  
  let vcard = `BEGIN:VCARD
VERSION:3.0
N:${data.lastName || ""};${data.firstName || ""};;;
FN:${[data.firstName, data.lastName].filter(Boolean).join(" ")}`;

  if (data.phone) vcard += `\nTEL:${data.phone}`;
  if (data.email) vcard += `\nEMAIL:${data.email}`;
  if (data.company) vcard += `\nORG:${data.company}`;
  if (data.title) vcard += `\nTITLE:${data.title}`;
  if (data.website) vcard += `\nURL:${data.website}`;
  if (data.address) vcard += `\nADR:;;${data.address};;;;`;

  vcard += `\nEND:VCARD`;
  
  return vcard;
}
