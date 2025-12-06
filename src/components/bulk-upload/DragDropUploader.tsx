import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DragDropUploaderProps {
  onFileSelect: (content: string) => void;
  accept?: string;
}

export const DragDropUploader = ({ onFileSelect, accept = ".csv,.txt" }: DragDropUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileSelect(content);
      };
      reader.readAsText(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFile(file);
      }
    };
    input.click();
  }, [accept, handleFile]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-dragging={isDragging}
      className={`border-2 border-dashed rounded-xl p-12 transition-all duration-200 cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
      onClick={handleClick}
    >
      <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
      <p className="font-display text-lg font-semibold text-center" style={{ color: 'rgba(255,255,255,0.9)' }}>
        drop your file here
      </p>
      <p className="text-sm text-center mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
        or click to browse • supports CSV and TXT
      </p>
      <Button variant="outline" size="sm" className="mx-auto mt-4 block pointer-events-none">
        choose file
      </Button>
    </div>
  );
};