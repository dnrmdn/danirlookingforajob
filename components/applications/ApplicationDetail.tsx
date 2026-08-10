'use client';

import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  Copy,
  Check,
  Edit3,
  Trash2,
} from "lucide-react";
import { useUIStore } from '@/stores/useUIStore';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { NotesSection } from '@/components/shared/NotesSection';
import { ActivityTimeline } from '@/components/shared/ActivityTimeline';
import { FileUploader } from '@/components/shared/FileUploader';
import { ReminderSetter } from '@/components/shared/ReminderSetter';
import { toast } from "@/lib/toast";
import { SOURCE_CONFIG, METHOD_CONFIG, KANBAN_COLUMNS, STATUS_CONFIG } from '@/lib/constants';
import { getDurationText, formatDate } from '@/lib/utils';
import { ApplicationStatus } from '@/lib/types';
import { useState } from 'react';
import { useApplicationActivity, } from "@/lib/api-client/activity";
import {
  useApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "@/lib/api-client/applications";



export function ApplicationDetail() {
  const { isDetailPanelOpen, setDetailPanelOpen, setFormModalOpen, setEditingApplicationId, selectedApplicationId, setSelectedApplicationId, } = useUIStore();
  const { data: application, isLoading } = useApplication(selectedApplicationId || '');
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const applicationId = application?.id ?? "";

  const {
    data: activity = [],
    isLoading: isLoadingActivity,
  } = useApplicationActivity(applicationId);

  if (!application) return null;

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== application.status) {
      updateApplication.mutate(
        {
          id: application.id,
          data: {
            status: newStatus as ApplicationStatus,
          },
        },
        {
          onSuccess: () => {
            const statusLabel =
              STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label ??
              newStatus;

            toast.success("Status Updated", {
              description: `Application moved to ${statusLabel}.`,
              preset: "smooth",
              showProgress: true,
            });
          },
          onError: () => {
            toast.error("Update Failed", {
              description: "Failed to update application status.",
              preset: "smooth",
            });
          },
        }
      );
    }

    setIsChangingStatus(false);
  };

  const handleEdit = () => {
    setEditingApplicationId(application.id);
    setDetailPanelOpen(false);
    setFormModalOpen(true);
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Delete this application?\n\nThis action will move it to the recycle bin."
      )
    ) {
      return;
    }

    deleteApplication.mutate(application.id, {
      onSuccess: () => {
        toast.success("Application Deleted", {
          description: "The application has been moved to the recycle bin.",
          preset: "smooth",
          showProgress: true,
        });

        setSelectedApplicationId(null);

        setEditingApplicationId(null);

        setDetailPanelOpen(false);
      },
      onError: () => {
        toast.error("Delete Failed", {
          description: "Failed to delete the application.",
          preset: "smooth",
        });
      },
    });
  };

  const copyEmailTemplate = () => {
    const template = `Subject: Following up on my application for ${application.position} role at ${application.company}

Dear Hiring Team,

I hope this email finds you well. I am following up on my application for the ${application.position} position submitted on ${application.appliedAt ? formatDate(application.appliedAt) : 'recently'}.

I remain very interested in contributing to ${application.company} and would appreciate any update regarding my application status.

Best regards,
[Your Name]`;

    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    toast.success("Template Copied", {
      description: "Follow-up email template copied to clipboard.",
      preset: "smooth",
    });
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <Dialog.Root open={isDetailPanelOpen} onOpenChange={setDetailPanelOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#0B0F1A]/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/10 bg-[#111827] shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
            <button
              onClick={() => setDetailPanelOpen(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Close
            </button>
            <div className="flex gap-2">

              <button
                onClick={handleEdit}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors text-xs font-medium flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>

            </div>
          </div>

          {/* Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar space-y-6">
            {/* Header Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">{application.company}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{application.position}</p>
              </div>
            </div>

            {/* Quick Details Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-mono uppercase">Status</span>
                <div className="relative">
                  {isChangingStatus ? (
                    <select
                      autoFocus
                      value={application.status}
                      onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                      onBlur={() => setIsChangingStatus(false)}
                      className="bg-[#111827] border border-violet-500 rounded-lg px-2 py-1 text-xs text-gray-100 outline-none w-32"
                    >
                      {KANBAN_COLUMNS.map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                      ))}
                    </select>
                  ) : (
                    <div
                      onClick={() => setIsChangingStatus(true)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <StatusBadge status={application.status} />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-gray-500 text-[10px] font-mono uppercase">Applied</span>
                  <div className="flex items-center gap-1.5 text-gray-200 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {application.appliedAt ? formatDate(application.appliedAt) : '-'}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-500 text-[10px] font-mono uppercase">Duration</span>
                  <div className="text-gray-200 text-xs">
                    {application.appliedAt ? getDurationText(application.appliedAt) : '-'}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-gray-500 text-[10px] font-mono uppercase">Location</span>
                  <div className="flex items-center gap-1.5 text-gray-200 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {application.location || '-'}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-500 text-[10px] font-mono uppercase">Salary</span>
                  <div className="flex items-center gap-1.5 text-gray-200 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    {application.salary || '-'}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-gray-500 text-[10px] font-mono uppercase">Source</span>
                  <div className="text-gray-200 text-xs">
                    {SOURCE_CONFIG[application.source.toLowerCase() as keyof typeof SOURCE_CONFIG]?.label || application.source}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-500 text-[10px] font-mono uppercase">Method</span>
                  <div className="text-gray-200 text-xs">
                    {METHOD_CONFIG[application.method.toLowerCase() as keyof typeof METHOD_CONFIG]?.label || application.method}
                  </div>
                </div>
              </div>

              {application.url && (
                <>
                  <div className="h-px w-full bg-white/5"></div>
                  <div className="flex items-center gap-2 text-xs">
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                    <a href={application.url} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline truncate">
                      {application.url}
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Reminder Setter */}
            <ReminderSetter
              applicationId={application.id}
              company={application.company}
            />

            {/* Notes Section */}
            <NotesSection
              applicationId={application.id}
            />

            {/* Attachments Section */}
            <FileUploader
              applicationId={application.id}
            />

            {/* Email Follow-up Template Helper */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-200">Email Follow-up Template</span>
                <button
                  onClick={copyEmailTemplate}
                  className="px-2.5 py-1 rounded-lg bg-violet-600/30 border border-violet-500/30 text-violet-300 hover:bg-violet-600/50 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedTemplate ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copiedTemplate ? 'Copied!' : 'Copy Template'}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Ready-to-send follow-up email tailored for {application.company}.
              </p>
            </div>

            {/* Activity Log Timeline */}
            <div className="pt-2 border-t border-white/5">
              <h3 className="text-sm font-semibold text-gray-100 mb-3">Activity History</h3>
              {/* API activity log for individual application is pending */}
              <ActivityTimeline entries={activity} />
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
