import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { Card } from "@/components/ui/card";

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  workspaceId: string;
  placeholder?: string;
}

export function MentionInput({ value, onChange, workspaceId, placeholder }: MentionInputProps) {
  const { members, getMemberName } = useWorkspaceMembers(workspaceId);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredMembers = members.filter((member) =>
    getMemberName(member.user_id).toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[2]); // Extract user ID
    }
    return mentions;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);

    // Check if @ was just typed
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtIndex !== -1 && lastAtIndex === cursorPos - 1) {
      setShowSuggestions(true);
      setMentionSearch("");
    } else if (lastAtIndex !== -1) {
      const searchText = textBeforeCursor.substring(lastAtIndex + 1);
      if (!searchText.includes(" ") && searchText.length <= 20) {
        setShowSuggestions(true);
        setMentionSearch(searchText);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    const mentions = extractMentions(newValue);
    onChange(newValue, mentions);
  };

  const insertMention = (userId: string, name: string) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    
    const beforeMention = value.substring(0, lastAtIndex);
    const mentionText = `@[${name}](${userId})`;
    const newValue = beforeMention + mentionText + " " + textAfterCursor;
    
    const mentions = extractMentions(newValue);
    onChange(newValue, mentions);
    setShowSuggestions(false);
    
    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPos = beforeMention.length + mentionText.length + 1;
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Format display text (show names instead of markdown)
  const displayValue = value.replace(/@\[([^\]]+)\]\([^)]+\)/g, "@$1");

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder || "type @ to mention someone"}
        rows={3}
      />
      
      {showSuggestions && filteredMembers.length > 0 && (
        <Card className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredMembers.map((member) => (
              <button
                key={member.user_id}
                onClick={() => insertMention(member.user_id, getMemberName(member.user_id))}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm"
              >
                {getMemberName(member.user_id)}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
