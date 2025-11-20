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
import { Plus, Trash2, FileText, CheckCircle2, Loader2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      await verifyMutation.mutateAsync(domainId);
      toast({
        title: "Domain verified",
        description: "Your domain is now ready to use.",
      });
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
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Domain</DialogTitle>
                  <DialogDescription>
                    Enter the domain you want to use for short links
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="yourdomain.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                    />
                    <p className="text-sm text-muted-foreground">
                      Don't include "http://" or "www"
                    </p>
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
                    Add Domain
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(domain.id)}
                              disabled={verifyMutation.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {domain.is_verified && !domain.is_primary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetPrimary(domain.id)}
                            disabled={setPrimaryMutation.isPending}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
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
                No domains added yet. Add your first custom domain to get started.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDNSDialogOpen} onOpenChange={setIsDNSDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>DNS Configuration</DialogTitle>
            <DialogDescription>
              Configure these DNS records to verify your domain
            </DialogDescription>
          </DialogHeader>
          {selectedDomain && (
            <DomainDNSInstructions
              domain={selectedDomain.domain}
              verificationCode={selectedDomain.verification_code}
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
              Verify Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
