import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Mail, MessageSquare, Share2, Check } from "lucide-react";
import { showSuccessToast } from "@/lib/enhancedToast";
import { FacebookIcon, WhatsAppIcon, TelegramIcon, TwitterIcon, LinkedInIcon } from "@/components/icons/SocialIcons";

interface ShareReferralModalProps {
  referralCode: string;
  userName?: string;
}

export function ShareReferralModal({ referralCode, userName }: ShareReferralModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/early-access?ref=${referralCode}`;

  const shareMessages = {
    twitter: `I just joined the utm.one early access waitlist! Join me and get 1 month Pro free when we launch 🚀`,
    linkedin: `Excited to be on the waitlist for utm.one - the cleanest way to manage links, UTMs, and QR codes. Join me in early access!`,
    whatsapp: `Hey! Join utm.one's early access with my link and we both get perks! ${referralLink}`,
    facebook: `I'm on the waitlist for utm.one - finally, a clean way to manage campaign links and tracking! Join me:`,
    email: {
      subject: "Join me on utm.one early access",
      body: `Hey!\n\nI just signed up for utm.one early access and thought you'd like it too. It's the cleanest way to manage links, UTMs, QR codes, and analytics.\n\nJoin with my link and we both get 1 month of Pro free when it launches:\n${referralLink}\n\n${userName ? `— ${userName}` : ""}`,
    },
    sms: `Join utm.one early access with me! We both get 1 month Pro free: ${referralLink}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showSuccessToast("referral link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessages.twitter)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const shareViaLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessages.whatsapp)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareMessages.facebook)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareMessages.twitter)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const shareViaEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(shareMessages.email.subject)}&body=${encodeURIComponent(shareMessages.email.body)}`;
    window.open(url, "_self");
  };

  const shareViaSMS = () => {
    const url = `sms:?body=${encodeURIComponent(shareMessages.sms)}`;
    window.open(url, "_self");
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join utm.one Early Access",
          text: shareMessages.twitter,
          url: referralLink,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blazeOrange hover:bg-blazeOrange/90">
          <Share2 className="h-4 w-4" />
          share & earn perks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">
            share your referral link
          </DialogTitle>
          <p className="text-secondary-label">
            invite friends and jump the queue — you both get 1 month Pro free when we launch
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Copy Link Bar */}
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <p className="text-xs text-tertiary-label mb-2">your referral link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-zinc-900/60 px-3 py-2 rounded border border-white/10 text-sm text-white"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Grid */}
          <div>
            <p className="text-sm font-medium mb-3">share via</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Native Share (Mobile) */}
              {navigator.share && (
                <Button
                  onClick={shareViaWebShare}
                  variant="outline"
                  className="gap-2 justify-start h-auto py-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Share2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">share</span>
                </Button>
              )}

              {/* Twitter/X */}
              <Button
                onClick={shareViaTwitter}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                  <TwitterIcon className="h-4 w-4" />
                </div>
                <span className="text-sm">twitter/x</span>
              </Button>

              {/* LinkedIn */}
              <Button
                onClick={shareViaLinkedIn}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                  <LinkedInIcon className="h-4 w-4" />
                </div>
                <span className="text-sm">linkedin</span>
              </Button>

              {/* WhatsApp */}
              <Button
                onClick={shareViaWhatsApp}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="h-4 w-4" />
                </div>
                <span className="text-sm">whatsapp</span>
              </Button>

              {/* Facebook */}
              <Button
                onClick={shareViaFacebook}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center shrink-0">
                  <FacebookIcon className="h-4 w-4" />
                </div>
                <span className="text-sm">facebook</span>
              </Button>

              {/* Telegram */}
              <Button
                onClick={shareViaTelegram}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#0088cc]/10 flex items-center justify-center shrink-0">
                  <TelegramIcon className="h-4 w-4" />
                </div>
                <span className="text-sm">telegram</span>
              </Button>

              {/* Email */}
              <Button
                onClick={shareViaEmail}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">email</span>
              </Button>

              {/* SMS */}
              <Button
                onClick={shareViaSMS}
                variant="outline"
                className="gap-2 justify-start h-auto py-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">sms</span>
              </Button>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-900">
              <span className="font-semibold">💡 pro tip:</span> personalized messages get more clicks. explain why you're excited about utm.one when sharing!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
