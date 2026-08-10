'use client';

import { useState } from 'react';
import { Bell, Calendar, Check } from 'lucide-react';
import { useAppReminders, useCreateReminder, useDeleteReminder } from '@/lib/api-client/reminders';
import { toast } from "@/lib/toast";

interface ReminderSetterProps {
  applicationId: string;
  company: string;
}

export function ReminderSetter({ applicationId, company }: ReminderSetterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [days, setDays] = useState<number>(7);
  const [customDate, setCustomDate] = useState<string>('');
  const [message, setMessage] = useState<string>(`Follow up email to ${company}`);

  const { data: reminders = [], isLoading } = useAppReminders(applicationId);
  const createReminder = useCreateReminder(applicationId);
  const deleteReminder = useDeleteReminder(applicationId);

  const existingReminder = reminders[0];

  const handleSave = () => {
    let targetDate: string;
    if (customDate) {
      targetDate = new Date(customDate).toISOString();
    } else {
      const d = new Date();
      d.setDate(d.getDate() + days);
      targetDate = d.toISOString();
    }

    createReminder.mutate(
      {
        title: message || `Follow up with ${company}`,
        reminderDate: targetDate,
      },
      {
        onSuccess: () => {
          toast.success("Reminder Created", {
            description: "Your follow-up reminder has been scheduled.",
            preset: "smooth",
            showProgress: true,
          });

          setIsEditing(false);
        },
        onError: () => {
          toast.error("Failed to Create Reminder", {
            description: "Please try again.",
            preset: "smooth",
          });
        },
      }
    );
  };

  const handleRemove = () => {
    if (!existingReminder) return;
    deleteReminder.mutate(existingReminder.id, {
      onSuccess: () => {
        toast.success("Reminder Removed", {
          description: "The reminder has been deleted.",
          preset: "smooth",
          showProgress: true,
        });

        setIsEditing(false);
      },
      onError: () => {
        toast.error("Delete Failed", {
          description: "Failed to remove the reminder.",
          preset: "smooth",
        });
      },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-400" />
          Follow-up Reminder
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium px-2 py-1 rounded-lg hover:bg-violet-500/10 transition-colors"
          >
            {existingReminder ? 'Change' : '+ Set Reminder'}
          </button>
        )}
      </div>

      {existingReminder && !isEditing && (
        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-violet-200 font-medium">{existingReminder.title}</p>
            <p className="text-[11px] text-violet-400 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(existingReminder.reminderDate).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1"
          >
            Remove
          </button>
        </div>
      )}

      {isEditing && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1.5">
              Quick Presets
            </label>
            <div className="flex gap-1.5">
              {[3, 7, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDays(d);
                    setCustomDate('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${days === d && !customDate
                    ? 'bg-violet-600/30 border-violet-500 text-violet-200'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                >
                  In {d} days
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">
              Or Choose Date
            </label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-100 outline-none focus:border-violet-500/50"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">
              Reminder Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Follow up email to HR"
              className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-100 outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Save Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
