'use client';

import { useState } from 'react';
import { X, Upload, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { toast } from 'sonner';

interface Prompt {
  _id?: string;
  id: number;
  title: string;
  image: string;
  prompt: string;
  date: string;
  visible: boolean;
}

interface AddPromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onSave: (data: Omit<Prompt, 'id'>) => void;
}

export default function AddPromptModal({ prompt, onClose, onSave }: AddPromptModalProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [imageUrl, setImageUrl] = useState(prompt?.image || '');
  const [promptText, setPromptText] = useState(prompt?.prompt || '');
  const [date, setDate] = useState(prompt?.date || new Date().toISOString().split('T')[0]);
  const [visible, setVisible] = useState(prompt?.visible ?? true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
        toast.success('Image uploaded successfully');
      } else {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.message || errorData?.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !promptText.trim() || !imageUrl) {
      toast.error('Please fill in all fields including image');
      return;
    }

    onSave({
      title,
      image: imageUrl,
      prompt: promptText,
      date,
      visible,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl scale-in-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {prompt ? 'Edit Prompt' : 'Add New Prompt'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Fill in the details for your AI prompt</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-all hover:rotate-90"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Prompt Image
            </Label>
            {imageUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-border group bg-secondary/30">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setImageUrl('')}
                    className="rounded-full"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                  <label className="cursor-pointer">
                    <Button variant="secondary" size="sm" className="rounded-full pointer-events-none">
                      <Upload className="w-4 h-4 mr-1" />
                      Change
                    </Button>
                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              >
                <label
                  htmlFor="image-input"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  {isUploading ? (
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {isUploading ? 'Uploading image...' : 'Drop your image here'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG or WebP up to 10MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 border-primary/20 text-primary hover:bg-primary/5">
                    Select File
                  </Button>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Cyberpunk City at Night"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-secondary/30 border-border focus:ring-primary/20"
            />
          </div>

          {/* Prompt Text */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-semibold">Prompt Details</Label>
            <Textarea
              id="prompt"
              placeholder="Enter the detailed prompt text here..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={5}
              className="bg-secondary/30 border-border focus:ring-primary/20 resize-none min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">Date Added</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 h-11 bg-secondary/30 border-border"
                />
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Status</Label>
              <div className="flex items-center justify-between bg-secondary/30 rounded-xl h-11 px-4 border border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  {visible ? 'Public' : 'Hidden'}
                </span>
                <Switch
                  checked={visible}
                  onCheckedChange={setVisible}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm flex gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className="flex-1 h-11 shadow-lg shadow-primary/20"
          >
            {prompt ? 'Update Changes' : 'Publish Prompt'}
          </Button>
        </div>
      </div>
    </div>
  );
}
