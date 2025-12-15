import { useState } from "react";
import { format } from "date-fns";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  useAllVerificationRequests,
  useUpdateVerificationStatus,
  type VerificationRequest,
} from "@/hooks/useVerificationStatus";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Eye,
  CheckCircle,
  X,
  ExternalLink,
  FileText,
  Search,
  User,
  Phone,
  Mail,
  Globe,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", color: "text-amber-500", bg: "bg-amber-500/10" },
  under_review: { label: "Under Review", color: "text-blue-500", bg: "bg-blue-500/10" },
  approved: { label: "Approved", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  rejected: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
};

export default function VerificationRequests() {
  const { toast } = useToast();
  const { data: requests = [], isLoading } = useAllVerificationRequests();
  const updateStatus = useUpdateVerificationStatus();
  
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const filteredRequests = requests.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.phone_number.includes(search)
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const underReviewCount = requests.filter((r) => r.status === "under_review").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const handleApprove = async (request: VerificationRequest) => {
    try {
      await updateStatus.mutateAsync({
        requestId: request.id,
        status: "approved",
      });
      toast({
        title: "Verification approved",
        description: `${request.full_name} is now verified.`,
      });
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to approve" });
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    try {
      await updateStatus.mutateAsync({
        requestId: selectedRequest.id,
        status: "rejected",
        rejection_reason: rejectReason,
      });
      toast({
        title: "Verification rejected",
        description: `Application from ${selectedRequest.full_name} was rejected.`,
      });
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to reject" });
    }
  };

  const openRejectDialog = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const openDetailsDialog = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };

  const RequestsTable = ({ requests }: { requests: VerificationRequest[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No requests found
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => {
            const config = statusConfig[request.status];
            return (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.full_name}</p>
                    <p className="text-xs text-muted-foreground">{request.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {request.category || "Not specified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs", config.color, config.bg)}>
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(request.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetailsDialog(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(request.status === "pending" || request.status === "under_review") && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-500 hover:text-emerald-600"
                          onClick={() => handleApprove(request)}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openRejectDialog(request)}
                          disabled={updateStatus.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  return (
    <PageContentWrapper
      title="Verification Requests"
      description="Review and manage badge verification applications"
      breadcrumbs={[
        { label: "admin" },
        { label: "verification" },
      ]}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{underReviewCount}</p>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/10">
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">All Requests</CardTitle>
              <CardDescription>
                {requests.length} total applications
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="under_review">Under Review ({underReviewCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <RequestsTable requests={filteredRequests.filter(r => r.status === "pending")} />
            </TabsContent>
            <TabsContent value="under_review">
              <RequestsTable requests={filteredRequests.filter(r => r.status === "under_review")} />
            </TabsContent>
            <TabsContent value="approved">
              <RequestsTable requests={filteredRequests.filter(r => r.status === "approved")} />
            </TabsContent>
            <TabsContent value="rejected">
              <RequestsTable requests={filteredRequests.filter(r => r.status === "rejected")} />
            </TabsContent>
            <TabsContent value="all">
              <RequestsTable requests={filteredRequests} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedRequest?.full_name}'s application.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason || updateStatus.isPending}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedRequest.full_name}</p>
                  <Badge className={cn("text-xs", statusConfig[selectedRequest.status].color, statusConfig[selectedRequest.status].bg)}>
                    {statusConfig[selectedRequest.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> Phone
                </div>
                <div>{selectedRequest.phone_number}</div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> Email
                </div>
                <div>{selectedRequest.email}</div>

                {selectedRequest.business_name && (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" /> Business
                    </div>
                    <div>{selectedRequest.business_name}</div>
                  </>
                )}

                {selectedRequest.business_website && (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" /> Website
                    </div>
                    <a
                      href={selectedRequest.business_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" /> Document
                </div>
                <div className="capitalize">
                  {selectedRequest.document_type.replace("_", " ")}
                  {selectedRequest.document_url && (
                    <a
                      href={selectedRequest.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline text-xs"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Reason for Verification</p>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                  {selectedRequest.reason_for_verification}
                </p>
              </div>

              {selectedRequest.social_links && selectedRequest.social_links.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Social Profiles</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.social_links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm hover:bg-muted/80"
                      >
                        {link.platform} <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.rejection_reason && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                  <p className="text-sm mt-1">{selectedRequest.rejection_reason}</p>
                </div>
              )}

              {(selectedRequest.status === "pending" || selectedRequest.status === "under_review") && (
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleApprove(selectedRequest);
                      setDetailsDialogOpen(false);
                    }}
                    disabled={updateStatus.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      openRejectDialog(selectedRequest);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContentWrapper>
  );
}
