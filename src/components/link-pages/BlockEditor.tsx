import { useState } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableBlockItem } from "./SortableBlockItem";
import { BlockTypeSelector } from "./BlockTypeSelector";
import { BlockEditDialog } from "./BlockEditDialog";
import {
  useLinkPageBlocks,
  useCreateBlock,
  useUpdateBlock,
  useDeleteBlock,
  useReorderBlocks,
  type LinkPageBlock,
} from "@/hooks/useLinkPageBlocks";
import type { LinkPageBlockType } from "@/lib/linkPages";

interface BlockEditorProps {
  pageId: string;
}

export function BlockEditor({ pageId }: BlockEditorProps) {
  const { data: blocks = [], isLoading } = useLinkPageBlocks(pageId);
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorderBlocks = useReorderBlocks();

  const [editingBlock, setEditingBlock] = useState<LinkPageBlock | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      const reorderedBlocks = newBlocks.map((block, index) => ({
        id: block.id,
        order_index: index,
      }));

      reorderBlocks.mutate({ blocks: reorderedBlocks, pageId });
    }
  };

  const handleAddBlock = (type: LinkPageBlockType) => {
    createBlock.mutate({ page_id: pageId, type });
    setShowTypeSelector(false);
  };

  const handleToggleEnabled = (block: LinkPageBlock) => {
    updateBlock.mutate({ id: block.id, is_enabled: !block.is_enabled });
  };

  const handleDeleteBlock = (block: LinkPageBlock) => {
    deleteBlock.mutate({ id: block.id, pageId });
  };

  const handleSaveBlock = (data: Record<string, unknown>) => {
    if (editingBlock) {
      updateBlock.mutate({ id: editingBlock.id, data });
      setEditingBlock(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                onEdit={() => setEditingBlock(block)}
                onToggle={() => handleToggleEnabled(block)}
                onDelete={() => handleDeleteBlock(block)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No blocks yet. Add your first block below.
        </div>
      )}

      <div className="relative">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowTypeSelector(!showTypeSelector)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>

        {showTypeSelector && (
          <BlockTypeSelector
            onSelect={handleAddBlock}
            onClose={() => setShowTypeSelector(false)}
          />
        )}
      </div>

      <BlockEditDialog
        block={editingBlock}
        open={!!editingBlock}
        onOpenChange={(open) => !open && setEditingBlock(null)}
        onSave={handleSaveBlock}
      />
    </div>
  );
}
