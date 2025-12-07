import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Edit, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useOGVariants, useAddOGVariant, useUpdateOGVariant, useDeleteOGVariant, useABTestStatus, useStartABTest, useStopABTest, type OGVariantInput } from "@/hooks/useOGVariants";

interface OGVariantManagerProps {
  linkId: string;
}

export const OGVariantManager = ({ linkId }: OGVariantManagerProps) => {
  const { data: variants, isLoading } = useOGVariants(linkId);
  const { data: testStatus } = useABTestStatus(linkId);
  const addVariant = useAddOGVariant();
  const updateVariant = useUpdateOGVariant();
  const deleteVariant = useDeleteOGVariant();
  const startTest = useStartABTest();
  const stopTest = useStopABTest();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [formData, setFormData] = useState<OGVariantInput>({
    variant_name: "",
    og_title: "",
    og_description: "",
    og_image: "",
    is_active: true,
  });

  const handleSubmit = async () => {
    if (editingVariant) {
      await updateVariant.mutateAsync({
        variantId: editingVariant,
        linkId,
        updates: formData,
      });
      setEditingVariant(null);
    } else {
      await addVariant.mutateAsync({ linkId, variant: formData });
      setIsAddDialogOpen(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      variant_name: "",
      og_title: "",
      og_description: "",
      og_image: "",
      is_active: true,
    });
  };

  const handleEdit = (variant: any) => {
    setFormData({
      variant_name: variant.variant_name,
      og_title: variant.og_title || "",
      og_description: variant.og_description || "",
      og_image: variant.og_image,
      is_active: variant.is_active,
    });
    setEditingVariant(variant.id);
  };

  const handleToggleActive = async (variantId: string, currentStatus: boolean) => {
    await updateVariant.mutateAsync({
      variantId,
      linkId,
      updates: { is_active: !currentStatus },
    });
  };

  const handleDelete = async (variantId: string) => {
    if (confirm("Are you sure you want to delete this variant? This cannot be undone.")) {
      await deleteVariant.mutateAsync({ variantId, linkId });
    }
  };

    return <div className="text-secondary-label">loading variants…</div>;

  const activeVariantCount = variants?.filter(v => v.is_active).length || 0;
  const canStartTest = activeVariantCount >= 2;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>A/B Test Variants</CardTitle>
            <CardDescription>
              Create multiple preview variants to test which performs best
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {testStatus?.ab_test_status === 'inactive' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => startTest.mutate({ linkId })}
                disabled={!canStartTest || startTest.isPending}
              >
                <Play className="h-4 w-4 mr-2" />
                Start A/B Test
              </Button>
            )}
            {testStatus?.ab_test_status === 'running' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => stopTest.mutate({ linkId })}
                disabled={stopTest.isPending}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Test
              </Button>
            )}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add OG Variant</DialogTitle>
                <DialogDescription>
                  Create a new Open Graph variant for A/B testing
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="variant_name">Variant Name *</Label>
                  <Input
                    id="variant_name"
                    placeholder="e.g., Variant A, Red Background, CTA Button"
                    value={formData.variant_name}
                    onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="og_image">Image URL *</Label>
                  <Input
                    id="og_image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.og_image}
                    onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  />
                  {formData.og_image && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={formData.og_image}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="og_title">Title (optional)</Label>
                  <Input
                    id="og_title"
                    placeholder="Custom title for this variant"
                    value={formData.og_title}
                    onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="text-xs text-secondary-label mt-1">
                    {formData.og_title?.length || 0}/60 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="og_description">Description (optional)</Label>
                  <Textarea
                    id="og_description"
                    placeholder="Custom description for this variant"
                    value={formData.og_description}
                    onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-secondary-label mt-1">
                    {formData.og_description?.length || 0}/160 characters
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.variant_name || !formData.og_image}
                >
                  Add Variant
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!canStartTest && testStatus?.ab_test_status === 'inactive' && (
          <div className="mb-4 p-4 border border-muted rounded-lg bg-muted/30">
            <p className="text-sm text-secondary-label">
              ℹ️ You need at least 2 active variants to start an A/B test. Add more variants or activate existing ones.
            </p>
          </div>
        )}
        {testStatus?.ab_test_status === 'running' && (
          <div className="mb-4 p-4 rounded-lg border border-border bg-muted/50">
            <p className="text-sm font-medium text-foreground">A/B Test Active</p>
            <p className="text-sm text-secondary-label mt-1">
              The system is automatically tracking variant performance. When statistical significance is reached 
              (≥{((testStatus.ab_test_confidence_threshold || 0.95) * 100).toFixed(0)}% confidence, 
              min {testStatus.ab_test_min_clicks} clicks), the winner will be automatically declared.
            </p>
          </div>
        )}
        {!variants || variants.length === 0 ? (
          <div className="text-center py-8 text-secondary-label">
            <p>No variants created yet.</p>
            <p className="text-sm mt-2">Create multiple variants to run A/B tests on your social previews.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <Card key={variant.id} className={!variant.is_active ? "opacity-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={variant.og_image}
                      alt={variant.variant_name}
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{variant.variant_name}</h4>
                        <Badge variant={variant.is_active ? "default" : "secondary"}>
                          {variant.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {variant.og_title && (
                        <p className="text-sm text-secondary-label truncate">
                          {variant.og_title}
                        </p>
                      )}
                      {variant.og_description && (
                        <p className="text-xs text-secondary-label line-clamp-2 mt-1">
                          {variant.og_description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(variant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleActive(variant.id, variant.is_active)}
                      >
                        {variant.is_active ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(variant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingVariant} onOpenChange={(open) => !open && setEditingVariant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Variant</DialogTitle>
              <DialogDescription>
                Update the variant details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_variant_name">Variant Name *</Label>
                <Input
                  id="edit_variant_name"
                  value={formData.variant_name}
                  onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_og_image">Image URL *</Label>
                <Input
                  id="edit_og_image"
                  type="url"
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                />
                {formData.og_image && (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={formData.og_image}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="edit_og_title">Title (optional)</Label>
                <Input
                  id="edit_og_title"
                  value={formData.og_title}
                  onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                  maxLength={60}
                />
              </div>
              <div>
                <Label htmlFor="edit_og_description">Description (optional)</Label>
                <Textarea
                  id="edit_og_description"
                  value={formData.og_description}
                  onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                  maxLength={160}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingVariant(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
