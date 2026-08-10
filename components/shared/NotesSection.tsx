'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Send,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNotes, useCreateNote, useDeleteNote, useUpdateNote } from '@/lib/api-client/notes';
import { toast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface NotesSectionProps {
  applicationId: string;
}

export function NotesSection({ applicationId }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { data: notes = [], isLoading } = useNotes(applicationId);
  const createNote = useCreateNote(applicationId);
  const deleteNote = useDeleteNote(applicationId);
  const updateNote = useUpdateNote(applicationId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    createNote.mutate(
      { content: newNote.trim() },
      {
        onSuccess: () => {
          toast.success("Note Added", {
            description: "Your note has been saved successfully.",
            preset: "smooth",
            showProgress: true,
          });

          setNewNote("");
          setIsAdding(false);
        },
        onError: () => {
          toast.error("Failed to Add Note", {
            description: "Please try again.",
            preset: "smooth",
          });
        },
      }
    );
  };

  const handleDeleteNote = (noteId: string) => {
    if (!confirm("Delete this note?")) return;

    deleteNote.mutate(noteId, {
      onSuccess: () => {
        toast.success("Note Deleted", {
          description: "The note has been removed.",
          preset: "smooth",
          showProgress: true,
        });
      },
      onError: () => {
        toast.error("Delete Failed", {
          description: "Failed to delete the note.",
          preset: "smooth",
        });
      },
    });
  };

  const handleEditNote = (note: typeof notes[number]) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleSaveEdit = () => {
    if (!editingNoteId || !editingContent.trim()) return;

    updateNote.mutate(
      {
        noteId: editingNoteId,
        data: {
          content: editingContent.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Note Updated", {
            description: "Your changes have been saved.",
            preset: "smooth",
            showProgress: true,
          });

          setEditingNoteId(null);
          setEditingContent("");
        },
        onError: () => {
          toast.error("Update Failed", {
            description: "Failed to update the note.",
            preset: "smooth",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          Notes ({notes.length})
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 hover:bg-violet-500/10 px-2 py-1 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Note
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddNote} className="space-y-2 bg-white/5 border border-white/10 p-3 rounded-xl">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type interview notes, feedback, contact details..."
            rows={3}
            autoFocus
            className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}
              className="px-2.5 py-1 text-xs text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-3 py-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3 h-3" /> Save Note
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative rounded-xl border border-white/5 bg-white/5 p-3 hover:border-white/10 transition-all"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-1 rounded-md hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={6}
                      className="z-50 min-w-[160px] rounded-lg border border-white/10 bg-[#1b1e2a] p-1 shadow-xl"
                    >
                      <DropdownMenu.Item
                        onClick={() => handleEditNote(note)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        onClick={() => handleDeleteNote(note.id)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 outline-none hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              {editingNoteId === note.id ? (
                <div className="space-y-2 pr-8">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-black/20 p-2 text-xs text-gray-100 focus:border-violet-500 focus:outline-none"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingNoteId(null);
                        setEditingContent("");
                      }}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSaveEdit}
                      className="rounded-lg bg-violet-600 px-3 py-1 text-xs text-white hover:bg-violet-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="pr-8 text-xs leading-relaxed text-gray-300">
                  {note.content}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isAdding && <p className="text-xs text-gray-500 italic">No notes added yet.</p>
      )}
    </div>
  );
}
