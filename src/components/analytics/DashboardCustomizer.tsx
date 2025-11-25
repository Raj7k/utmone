import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, GripVertical } from "lucide-react";
import { useDashboardPreferences } from "@/hooks/useDashboardPreferences";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DashboardCustomizerProps {
  workspaceId: string;
}

const WIDGET_OPTIONS = [
  { id: 'overview', label: 'Overview Cards' },
  { id: 'heatmap', label: 'Click Heatmap' },
  { id: 'conversions', label: 'Conversion Funnel' },
  { id: 'geography', label: 'Geography Map' },
  { id: 'devices', label: 'Device Breakdown' },
  { id: 'campaigns', label: 'UTM Campaigns' },
];

const TAB_OPTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'devices', label: 'Devices' },
  { id: 'geography', label: 'Geography' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'time', label: 'Time Analysis' },
  { id: 'compare', label: 'Compare' },
];

function SortableItem({ id, label }: { id: string; label: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg"
    >
      <GripVertical
        className="h-4 w-4 text-muted-foreground cursor-grab"
        {...attributes}
        {...listeners}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function DashboardCustomizer({ workspaceId }: DashboardCustomizerProps) {
  const { preferences, updatePreferences } = useDashboardPreferences(workspaceId);
  const [open, setOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(preferences.visible_widgets || []);
  const [tabOrder, setTabOrder] = useState<string[]>(preferences.tab_order || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTabOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleWidget = (widgetId: string) => {
    setVisibleWidgets(prev =>
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleSave = () => {
    updatePreferences({
      visible_widgets: visibleWidgets,
      tab_order: tabOrder,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Dashboard</DialogTitle>
          <DialogDescription>
            Choose which widgets to display and arrange tab order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Widget Visibility */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Visible Widgets</h3>
            <div className="space-y-3">
              {WIDGET_OPTIONS.map(widget => (
                <div key={widget.id} className="flex items-center justify-between">
                  <Label htmlFor={`widget-${widget.id}`} className="text-sm">
                    {widget.label}
                  </Label>
                  <Switch
                    id={`widget-${widget.id}`}
                    checked={visibleWidgets.includes(widget.id)}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Tab Order */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Tab Order</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Drag to reorder tabs
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tabOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {tabOrder.map(tabId => {
                    const tab = TAB_OPTIONS.find(t => t.id === tabId);
                    return tab ? (
                      <SortableItem key={tabId} id={tabId} label={tab.label} />
                    ) : null;
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
