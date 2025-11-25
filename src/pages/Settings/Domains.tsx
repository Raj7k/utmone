import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useWorkspaceDomains,
  useAddDomain,
  useSetPrimaryDomain,
  useDeleteDomain,
  useVerifyDomain,
} from "@/hooks/useDomains";
import { DomainBadge } from "@/components/DomainBadge";
import { DomainDNSInstructions } from "@/components/DomainDNSInstructions";
import { DomainHealthDashboard } from "@/components/settings/DomainHealthDashboard";
import { DomainSettings } from "@/components/settings/DomainSettings";
import { DomainUsageStats } from "@/components/settings/DomainUsageStats";
import { DomainEditDialog } from "@/components/settings/DomainEditDialog";
import { Plus, Trash2, FileText, CheckCircle2, Loader2, Star, Settings, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DomainsProps {
  workspaceId: string;
}

export default function Domains({ workspaceId }: DomainsProps) {
  const { toast } = useToast();
  const { data: domains, isLoading } = useWorkspaceDomains(workspaceId);
  const addDomainMutation = useAddDomain();
  const setPrimaryMutation = useSetPrimaryDomain();
  const deleteMutation = useDeleteDomain();
  const verifyMutation = useVerifyDomain();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [isDNSDialogOpen, setIsDNSDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name.",
        variant: "destructive",
      });
      return;
    }

    const cleanDomain = newDomain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, "");

    try {
      const domain = await addDomainMutation.mutateAsync({
        workspaceId,
        domain: cleanDomain,
      });
      setNewDomain("");
      setIsAddDialogOpen(false);
      setSelectedDomain(domain);
      setIsDNSDialogOpen(true);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSetPrimary = async (domainId: string) => {
    try {
      await setPrimaryMutation.mutateAsync({ domainId, workspaceId });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (domainId: string) => {
    try {
      await deleteMutation.mutateAsync(domainId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleVerify = async (domainId: string) => {
    try {
      const result = await verifyMutation.mutateAsync(domainId);
      
      // Check if verification succeeded
      if (result && (result as any).is_verified) {
        toast({
          title: "Domain verified!",
          description: "You can now use this domain when creating short links.",
        });
        // Auto-close DNS dialog after successful verification
        setIsDNSDialogOpen(false);
      } else {
        toast({
          title: "Verification pending",
          description: "DNS records not found yet. It can take up to 72 hours for DNS changes to propagate.",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please check your DNS settings and try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Domains</CardTitle>
              <CardDescription>
                Manage domains for your branded short links
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  add domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>add custom domain</DialogTitle>
                  <DialogDescription>
                    add a branded domain to make your links yours.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="domain">domain name</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                              <span className="text-[10px] text-secondary-label font-medium">?</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-popover border border-border">
                            <p className="text-sm">your domain increases trust and click-through rates.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="domain"
                      placeholder="yourdomain.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddDomain}
                    disabled={addDomainMutation.isPending}
                  >
                    {addDomainMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    add domain
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {domains && domains.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.domain}</TableCell>
                    <TableCell>
                      <DomainBadge
                        isVerified={domain.is_verified}
                        isPrimary={domain.is_primary}
                        sslStatus={domain.ssl_status}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(domain.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!domain.is_verified && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDomain(domain);
                                      setIsDNSDialogOpen(true);
                                    }}
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover border border-border">
                                  <p className="text-sm">view dns instructions</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleVerify(domain.id)}
                                    disabled={verifyMutation.isPending}
                                  >
                                    {verifyMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover border border-border">
                                  <p className="text-sm">verify domain</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDomain(domain);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover border border-border">
                              <p className="text-sm">edit domain settings</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDomain(domain);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover border border-border">
                              <p className="text-sm">domain details & health</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {domain.is_verified && !domain.is_primary && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSetPrimary(domain.id)}
                                  disabled={setPrimaryMutation.isPending}
                                >
                                  <Star className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover border border-border">
                                <p className="text-sm">set as primary domain</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={domain.is_primary}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {domain.domain}? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(domain.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert>
              <AlertDescription>
                add a branded domain to make your links yours.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDNSDialogOpen} onOpenChange={setIsDNSDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>dns configuration</DialogTitle>
            <DialogDescription>
              configure these dns records to verify your domain
            </DialogDescription>
          </DialogHeader>
          {selectedDomain && (
            <DomainDNSInstructions
              domain={selectedDomain.domain}
              verificationCode={selectedDomain.verification_code}
              domainId={selectedDomain.id}
            />
          )}
          <DialogFooter>
            <Button
              onClick={() => selectedDomain && handleVerify(selectedDomain.id)}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              verify domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Domain Details & Health</DialogTitle>
            <DialogDescription>
              View health status and usage for {selectedDomain?.domain}
            </DialogDescription>
          </DialogHeader>
          {selectedDomain && (
            <div className="space-y-6">
              <DomainHealthDashboard domain={selectedDomain} />
              <DomainUsageStats domainId={selectedDomain.id} domain={selectedDomain.domain} />
              <DomainSettings domain={selectedDomain} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedDomain && (
        <DomainEditDialog
          domain={selectedDomain}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  );
}
