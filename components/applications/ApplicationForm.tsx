'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Link as LinkIcon, MapPin, Building2, Briefcase, DollarSign, Bell } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { FileUploader } from '@/components/shared/FileUploader';
import { useUIStore } from '@/stores/useUIStore';
import { ApplicationSource, ApplicationMethod } from '@/lib/types';
import { SOURCE_CONFIG, METHOD_CONFIG } from '@/lib/constants';
import { toast } from "@/lib/toast";
import { todayISO } from '@/lib/utils';
import { useApplication, useCreateApplication, useUpdateApplication } from '@/lib/api-client/applications';
import { useCreateNote } from '@/lib/api-client/notes';
import { useUploadAttachment } from '@/lib/api-client/attachments';
import { useCreateReminder } from '@/lib/api-client/reminders';
import {
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@/features/applications/dto";

export function ApplicationForm() {
  const { isFormModalOpen, setFormModalOpen, editingApplicationId, setEditingApplicationId } = useUIStore();

  const { data: editingApp, isFetching } = useApplication(editingApplicationId || '');
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const createNote = useCreateNote(''); // ID provided at mutate
  const uploadAttachment = useUploadAttachment(''); // ID provided at mutate
  const createReminder = useCreateReminder(''); // ID provided at mutate

  const [formData, setFormData] = useState<Partial<CreateApplicationRequest>>({
    company: '',
    position: '',
    source: 'LINKEDIN',
    method: 'MANUAL',
    status: 'APPLIED',
    appliedAt: todayISO(),
    location: '',
    salary: '',
    url: '',
  });

  const [noteText, setNoteText] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDays, setReminderDays] = useState(7);

  // Reset or populate form when modal opens or editing app changes
  useEffect(() => {
    if (isFormModalOpen) {
      if (editingApp) {
        setFormData({
          company: editingApp.company,
          position: editingApp.position,
          source: editingApp.source,
          method: editingApp.method,
          status: editingApp.status,
          appliedAt: editingApp.appliedAt || todayISO(),
          location: editingApp.location || '',
          salary: editingApp.salary || '',
          url: editingApp.url || '',
        });
        setNoteText('');
        setReminderEnabled(false);
      } else {
        setFormData({
          company: '',
          position: '',
          source: 'LINKEDIN',
          method: 'MANUAL',
          status: 'APPLIED',
          appliedAt: todayISO(),
          location: '',
          salary: '',
          url: '',
        });
        setNoteText('');
        setReminderEnabled(false);
      }
    }
  }, [isFormModalOpen, editingApp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.position || !formData.appliedAt) {
      toast.error("Validation Failed", {
        description: "Company, Position, and Applied Date are required.",
        preset: "smooth",
      });
      return;
    }

    if (editingApplicationId) {
      updateApplication.mutate(
        {
          id: editingApplicationId,
          data: formData as UpdateApplicationRequest,
        },
        {
          onSuccess: () => {
            toast.success("Application Updated", {
              description: "The application has been updated successfully.",
              preset: "smooth",
              showProgress: true,
            });

            setFormModalOpen(false);
            setEditingApplicationId(null);
          },
          onError: () => {
            toast.error("Update Failed", {
              description: "Failed to update the application. Please try again.",
              preset: "smooth",
            });
          },
        }
      );
    } else {
      createApplication.mutate(formData as CreateApplicationRequest, {
        onSuccess: (newApp) => {
          toast.success("Application Created", {
            description: "The application has been saved successfully.",
            preset: "smooth",
            showProgress: true,
          });

          // Fire off supplementary creations (notes, attachments, reminders)
          if (noteText.trim()) {
            // TODO:
            // Hook tidak boleh dipanggil di dalam callback.
            // Nanti kita refactor create note agar menggunakan mutation
            // yang menerima applicationId saat mutate().
          }

          setFormModalOpen(false);
          setEditingApplicationId(null);
        },

        onError: () => {
          toast.error("Create Failed", {
            description: "Failed to create the application. Please try again.",
            preset: "smooth",
          });
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={() => {
        setFormModalOpen(false);
        setEditingApplicationId(null);
      }}
      title={editingApplicationId ? 'Edit Application' : 'Add New Application'}
      icon={<Sparkles className="w-5 h-5 text-violet-400" />}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Company Name *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Position *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="LINKEDIN" className="bg-gray-800 text-white">LinkedIn</option>
              <option value="INDEED" className="bg-gray-800 text-white">Indeed</option>
              <option value="GLASSDOOR" className="bg-gray-800 text-white">Glassdoor</option>
              <option value="COMPANY_SITE" className="bg-gray-800 text-white">Company Website</option>
              <option value="REFERRAL" className="bg-gray-800 text-white">Referral</option>
              <option value="OTHER" className="bg-gray-800 text-white">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Job Listing URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Method</label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="EASY_APPLY" className="bg-gray-800 text-white">Easy Apply</option>
              <option value="MANUAL" className="bg-gray-800 text-white">Manual / Form</option>
              <option value="EMAIL" className="bg-gray-800 text-white">Email</option>
              <option value="REFERRAL" className="bg-gray-800 text-white">Referral</option>
              <option value="OTHER" className="bg-gray-800 text-white">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Date Applied *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                required
                value={formData.appliedAt || ''}
                onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Jakarta, Remote, Hybrid"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Expected Salary</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. Rp 15.000.000 / mo"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* File Attachments */}
        {editingApplicationId && (
          <FileUploader applicationId={editingApplicationId} />
        )}

        {/* Notes (Creation only, basic) */}
        {!editingApplicationId && (
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Initial Notes</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Will be saved automatically after creation (currently disabled in modal)"
              disabled
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-600 resize-none opacity-50 cursor-not-allowed"
            />
          </div>
        )}

        {/* Set Reminder */}
        {!editingApplicationId && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">Set Follow-up Reminder</p>
                <p className="text-xs text-gray-400">Schedule automatic follow-up reminder</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {reminderEnabled && (
                <select
                  value={reminderDays}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                  className="bg-[#111827] border border-violet-500/50 rounded-lg px-2 py-1 text-xs text-gray-200"
                >
                  <option value={3}>In 3 days</option>
                  <option value={7}>In 7 days</option>
                  <option value={14}>In 14 days</option>
                </select>
              )}
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${reminderEnabled ? 'bg-violet-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${reminderEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              setFormModalOpen(false);
              setEditingApplicationId(null);
            }}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-xl px-6 py-2.5 flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all text-sm"
          >
            {editingApplicationId ? 'Update Application' : 'Save Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
