'use client';

import { useState } from 'react';
import { FileText, Plus, Trash2, Send } from 'lucide-react';
import { useNotes, useCreateNote } from '@/lib/api-client/notes';
import { useUIStore } from '@/stores/useUIStore';

interface NotesSectionProps {
  applicationId: string;
}

export function NotesSection({ applicationId }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: notes = [], isLoading } = useNotes(applicationId);
  const createNote = useCreateNote(applicationId);
  const addToast = useUIStore((state) => state.addToast);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    createNote.mutate(
      { content: newNote.trim() },
      {
        onSuccess: () => {
          addToast('Note added successfully');
          setNewNote('');
          setIsAdding(false);
        },
        onError: () => {
          addToast('Failed to add note', 'error');
        }
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
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed group relative hover:border-white/10 transition-colors"
            >
              {note.content}
            </div>
          ))}
        </div>
      ) : (
        !isAdding && <p className="text-xs text-gray-500 italic">No notes added yet.</p>
      )}
    </div>
  );
}
