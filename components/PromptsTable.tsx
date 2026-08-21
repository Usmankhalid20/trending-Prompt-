'use client';

import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

interface Prompt {
  _id?: string;
  id: number;
  title: string;
  image: string;
  prompt: string;
  date: string;
  visible: boolean;
}

interface PromptsTableProps {
  prompts: Prompt[];
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (prompt: Prompt) => void;
}

export default function PromptsTable({
  prompts,
  onToggleVisibility,
  onDelete,
  onEdit,
}: PromptsTableProps) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-secondary/50 border-b border-border">
          <TableRow>
            <TableHead className="text-foreground font-semibold py-4">Image</TableHead>
            <TableHead className="text-foreground font-semibold">Prompt Info</TableHead>
            <TableHead className="text-foreground font-semibold">Date</TableHead>
            <TableHead className="text-foreground font-semibold">Status</TableHead>
            <TableHead className="text-foreground font-semibold text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => (
            <TableRow
              key={prompt._id}
              className="border-b border-border/50 hover:bg-secondary/30 transition-colors group"
            >
              <TableCell className="py-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border shadow-sm">
                  <Image
                    src={prompt.image}
                    alt={prompt.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              </TableCell>

              <TableCell>
                <div className="max-w-[300px]">
                  <p className="font-semibold text-foreground text-sm line-clamp-1">{prompt.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {truncateText(prompt.prompt, 100)}
                  </p>
                </div>
              </TableCell>

              <TableCell className="text-sm text-muted-foreground font-medium">
                {formatDate(prompt.date)}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={prompt.visible}
                    onCheckedChange={() => onToggleVisibility(prompt._id!)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    prompt.visible 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {prompt.visible ? 'Public' : 'Hidden'}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => onEdit(prompt)}
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit prompt ${prompt.title}`}
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(prompt._id!)}
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete prompt ${prompt.title}`}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {prompts.length === 0 && (
        <div className="p-12 text-center border-t border-border bg-secondary/10">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
             <EyeOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground">No prompts found</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding your first trending prompt</p>
        </div>
      )}
    </div>
  );
}

