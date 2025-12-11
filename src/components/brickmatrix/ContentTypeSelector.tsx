import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  ContentType,
  CONTENT_TYPES,
  EmailData,
  PhoneData,
  SMSData,
  WifiData,
  LocationData,
  EventData,
  VCardData,
  generateEmailQR,
  generatePhoneQR,
  generateSMSQR,
  generateWifiQR,
  generateLocationQR,
  generateEventQR,
  generateVCardQR,
} from "@/lib/qrContentTypes";

interface ContentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ContentTypeSelector = ({ value, onChange }: ContentTypeSelectorProps) => {
  const [contentType, setContentType] = useState<ContentType>("url");
  
  // Form states for each type
  const [emailData, setEmailData] = useState<EmailData>({ email: "", subject: "", body: "" });
  const [phoneData, setPhoneData] = useState<PhoneData>({ phone: "" });
  const [smsData, setSmsData] = useState<SMSData>({ phone: "", message: "" });
  const [wifiData, setWifiData] = useState<WifiData>({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [locationData, setLocationData] = useState<LocationData>({ latitude: "", longitude: "", label: "" });
  const [eventData, setEventData] = useState<EventData>({ 
    title: "", startDate: "", startTime: "", endDate: "", endTime: "", location: "", description: "" 
  });
  const [vcardData, setVcardData] = useState<VCardData>({ 
    firstName: "", lastName: "", phone: "", email: "", company: "", title: "", website: "", address: "" 
  });

  const handleTypeChange = (type: ContentType) => {
    setContentType(type);
    // Clear the value when switching types
    onChange("");
  };

  const updateEmail = (updates: Partial<EmailData>) => {
    const newData = { ...emailData, ...updates };
    setEmailData(newData);
    onChange(generateEmailQR(newData));
  };

  const updatePhone = (updates: Partial<PhoneData>) => {
    const newData = { ...phoneData, ...updates };
    setPhoneData(newData);
    onChange(generatePhoneQR(newData));
  };

  const updateSms = (updates: Partial<SMSData>) => {
    const newData = { ...smsData, ...updates };
    setSmsData(newData);
    onChange(generateSMSQR(newData));
  };

  const updateWifi = (updates: Partial<WifiData>) => {
    const newData = { ...wifiData, ...updates };
    setWifiData(newData);
    onChange(generateWifiQR(newData));
  };

  const updateLocation = (updates: Partial<LocationData>) => {
    const newData = { ...locationData, ...updates };
    setLocationData(newData);
    onChange(generateLocationQR(newData));
  };

  const updateEvent = (updates: Partial<EventData>) => {
    const newData = { ...eventData, ...updates };
    setEventData(newData);
    onChange(generateEventQR(newData));
  };

  const updateVcard = (updates: Partial<VCardData>) => {
    const newData = { ...vcardData, ...updates };
    setVcardData(newData);
    onChange(generateVCardQR(newData));
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">content type</Label>
      
      {/* Icon Grid */}
      <div className="grid grid-cols-5 gap-2">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = contentType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all",
                "border hover:border-primary/50 hover:bg-accent/50",
                isActive 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-border text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Form Fields */}
      <div className="space-y-3 pt-2">
        {contentType === "url" && (
          <Input
            placeholder="https://example.com"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {contentType === "text" && (
          <Textarea
            placeholder="enter any text..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
          />
        )}

        {contentType === "email" && (
          <div className="space-y-2">
            <Input
              placeholder="recipient@example.com"
              value={emailData.email}
              onChange={(e) => updateEmail({ email: e.target.value })}
            />
            <Input
              placeholder="subject (optional)"
              value={emailData.subject}
              onChange={(e) => updateEmail({ subject: e.target.value })}
            />
            <Textarea
              placeholder="message body (optional)"
              value={emailData.body}
              onChange={(e) => updateEmail({ body: e.target.value })}
              rows={2}
            />
          </div>
        )}

        {contentType === "phone" && (
          <Input
            placeholder="+1 234 567 8900"
            value={phoneData.phone}
            onChange={(e) => updatePhone({ phone: e.target.value })}
          />
        )}

        {contentType === "sms" && (
          <div className="space-y-2">
            <Input
              placeholder="+1 234 567 8900"
              value={smsData.phone}
              onChange={(e) => updateSms({ phone: e.target.value })}
            />
            <Textarea
              placeholder="message (optional)"
              value={smsData.message}
              onChange={(e) => updateSms({ message: e.target.value })}
              rows={2}
            />
          </div>
        )}

        {contentType === "wifi" && (
          <div className="space-y-2">
            <Input
              placeholder="network name (SSID)"
              value={wifiData.ssid}
              onChange={(e) => updateWifi({ ssid: e.target.value })}
            />
            <Input
              type="password"
              placeholder="password"
              value={wifiData.password}
              onChange={(e) => updateWifi({ password: e.target.value })}
            />
            <Select 
              value={wifiData.encryption} 
              onValueChange={(v) => updateWifi({ encryption: v as WifiData["encryption"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">no password</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch
                checked={wifiData.hidden}
                onCheckedChange={(v) => updateWifi({ hidden: v })}
              />
              <span className="text-sm text-muted-foreground">hidden network</span>
            </div>
          </div>
        )}

        {contentType === "location" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="latitude"
                value={locationData.latitude}
                onChange={(e) => updateLocation({ latitude: e.target.value })}
              />
              <Input
                placeholder="longitude"
                value={locationData.longitude}
                onChange={(e) => updateLocation({ longitude: e.target.value })}
              />
            </div>
            <Input
              placeholder="location name (optional)"
              value={locationData.label}
              onChange={(e) => updateLocation({ label: e.target.value })}
            />
          </div>
        )}

        {contentType === "event" && (
          <div className="space-y-2">
            <Input
              placeholder="event title"
              value={eventData.title}
              onChange={(e) => updateEvent({ title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={eventData.startDate}
                onChange={(e) => updateEvent({ startDate: e.target.value })}
              />
              <Input
                type="time"
                value={eventData.startTime}
                onChange={(e) => updateEvent({ startTime: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="end date"
                value={eventData.endDate}
                onChange={(e) => updateEvent({ endDate: e.target.value })}
              />
              <Input
                type="time"
                value={eventData.endTime}
                onChange={(e) => updateEvent({ endTime: e.target.value })}
              />
            </div>
            <Input
              placeholder="location (optional)"
              value={eventData.location}
              onChange={(e) => updateEvent({ location: e.target.value })}
            />
          </div>
        )}

        {contentType === "vcard" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="first name"
                value={vcardData.firstName}
                onChange={(e) => updateVcard({ firstName: e.target.value })}
              />
              <Input
                placeholder="last name"
                value={vcardData.lastName}
                onChange={(e) => updateVcard({ lastName: e.target.value })}
              />
            </div>
            <Input
              placeholder="phone"
              value={vcardData.phone}
              onChange={(e) => updateVcard({ phone: e.target.value })}
            />
            <Input
              type="email"
              placeholder="email"
              value={vcardData.email}
              onChange={(e) => updateVcard({ email: e.target.value })}
            />
            <Input
              placeholder="company"
              value={vcardData.company}
              onChange={(e) => updateVcard({ company: e.target.value })}
            />
            <Input
              placeholder="job title"
              value={vcardData.title}
              onChange={(e) => updateVcard({ title: e.target.value })}
            />
            <Input
              placeholder="website"
              value={vcardData.website}
              onChange={(e) => updateVcard({ website: e.target.value })}
            />
            <Textarea
              placeholder="address"
              value={vcardData.address}
              onChange={(e) => updateVcard({ address: e.target.value })}
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Preview of encoded value */}
      {value && (
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground">encoding:</p>
          <p className="text-xs font-mono truncate">{value}</p>
        </div>
      )}
    </div>
  );
};
