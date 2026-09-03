import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CalendarDays, CheckCircle2, AlertCircle, LogOut, Camera, Pencil, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { isApiError } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { Spinner } from '@/core/components/Spinner';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { AppTextField } from '@/core/components/AppTextField';
import { cn } from '@/core/lib/cn';
import { formatDashDate } from '@/core/lib/dateFormat';
import { useCurrentUser } from '@/features/auth/hooks/useAuthState';
import { useLogoutMutation, useUpdateProfileMutation } from '@/features/auth/api/authApi';
import { isEmailVerified } from '@/features/auth/model/appUser';

/** Padanan `profile_screen.dart`. */
export function ProfileScreen() {
  const user = useCurrentUser();
  const showAlert = useAlert();
  const [logout] = useLogoutMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [busy, setBusy] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const dobInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      void showAlert({
        type: 'error',
        title: 'Terjadi Kesalahan',
        message: isApiError(error)
          ? error.message
          : 'Terjadi kesalahan tak terduga. Coba lagi sebentar.',
      });
    } finally {
      setBusy(false);
    }
  }

  async function saveName(newName: string) {
    if (!user || newName.length === 0 || newName === user.name) return;
    await run(async () => {
      await updateProfile({ name: newName }).unwrap();
      void showAlert({ type: 'success', title: 'Berhasil', message: 'Nama berhasil diperbarui.' });
    });
  }

  async function saveBirthDate(value: string) {
    if (!value) return;
    const [y, m, d] = value.split('-').map(Number);
    const picked = new Date(y!, (m ?? 1) - 1, d ?? 1);
    await run(async () => {
      await updateProfile({ dateOfBirth: picked }).unwrap();
      void showAlert({
        type: 'success',
        title: 'Berhasil',
        message: 'Tanggal lahir berhasil diperbarui.',
      });
    });
  }

  function signOut() {
    void showAlert({
      type: 'warning',
      title: 'Keluar dari akun?',
      message: 'Kamu perlu masuk lagi untuk melanjutkan belajar.',
      confirmLabel: 'Keluar',
      cancelLabel: 'Batal',
      onConfirm: () => {
        setBusy(true);
        logout()
          .unwrap()
          .catch((error) => {
            void showAlert({
              type: 'error',
              title: 'Terjadi Kesalahan',
              message: isApiError(error) ? error.message : 'Terjadi kesalahan tak terduga.',
            });
            setBusy(false);
          });
      },
    });
  }

  function avatarUnavailable() {
    void showAlert({
      type: 'info',
      title: 'Segera Hadir',
      message: 'Fitur ganti foto profil belum tersedia saat ini.',
    });
  }

  const initial = user.name.trim().length === 0 ? '?' : user.name.trim()[0]!.toUpperCase();
  const dob = user.dateOfBirth ? new Date(user.dateOfBirth) : null;

  return (
    <div className="min-h-full bg-background">
      <div className="rounded-b-[64px] bg-gradient-to-b from-primary to-primary-pressed px-screen pb-xxl pt-lg shadow-card">
        <div className="relative mx-auto h-132 w-132">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-white/[0.16]">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-display-lg text-white">{initial}</span>
            )}
          </div>
          <button
            type="button"
            onClick={avatarUnavailable}
            aria-label="Ganti foto"
            className="absolute bottom-6 right-0 flex h-36 w-36 items-center justify-center rounded-full border-2 border-white bg-primary text-white"
          >
            <Camera size={17} />
          </button>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => setEditingName(true)}
          className="mx-auto mt-md flex items-center gap-xxs px-xs py-xxs"
        >
          <span className="max-w-[220px] truncate text-title-lg font-bold text-white">
            {user.name}
          </span>
          <Pencil size={15} className="text-white/80" />
        </button>
      </div>

      <div className="p-screen">
        <ProfileField
          label="Email"
          value={user.email}
          trailing={<VerifiedBadge verified={isEmailVerified(user)} />}
        />
        <div className="h-lg" />
        <ProfileField label="Nomor HP" value={user.phone} placeholder="Belum diisi" />
        <div className="h-lg" />
        <div className="relative">
          <ProfileField
            label="Tanggal Lahir"
            value={dob ? formatDashDate(dob) : null}
            placeholder="Pilih tanggal lahir"
            trailing={<CalendarDays size={18} className="text-primary" />}
            onClick={busy ? undefined : () => dobInputRef.current?.showPicker?.()}
          />
          <input
            ref={dobInputRef}
            type="date"
            max={formatIso(new Date())}
            defaultValue={dob ? formatIso(dob) : undefined}
            onChange={(e) => void saveBirthDate(e.target.value)}
            className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
            tabIndex={-1}
          />
        </div>
        <div className="h-xxl" />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={signOut}
            className="inline-flex items-center gap-xs rounded-pill bg-danger px-lg py-sm text-label-lg text-white disabled:opacity-60"
          >
            {busy ? (
              <Spinner size={16} strokeWidth={2} className="text-white" />
            ) : (
              <LogOut size={18} />
            )}
            Keluar
          </button>
        </div>
      </div>

      {editingName ? (
        <EditNameSheet
          currentName={user.name}
          onClose={() => setEditingName(false)}
          onSubmit={(name) => {
            setEditingName(false);
            void saveName(name);
          }}
        />
      ) : null}
    </div>
  );
}

function formatIso(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

function ProfileField({
  label,
  value,
  placeholder,
  trailing,
  onClick,
}: {
  label: string;
  value: string | null;
  placeholder?: string;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  const hasValue = value != null && value.trim().length > 0;
  const content = (
    <>
      <p className="text-label-sm text-ink-muted">{label}</p>
      <div className="mt-[4px] flex items-center gap-xs">
        <span
          className={cn(
            'flex-1 truncate text-body-lg font-bold',
            hasValue ? 'text-ink' : 'text-muted',
          )}
        >
          {hasValue ? value : (placeholder ?? '-')}
        </span>
        {trailing}
      </div>
      <div className="mt-xs h-px bg-border" />
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  ) : (
    <div>{content}</div>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[3px] rounded-pill px-xs py-[3px] text-label-sm font-bold',
        verified ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning',
      )}
    >
      {verified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
      {verified ? 'Aktif' : 'Belum'}
    </span>
  );
}

function EditNameSheet({
  currentName,
  onClose,
  onSubmit,
}: {
  currentName: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
}) {
  const [value, setValue] = useState(currentName);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0 && trimmed !== currentName;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-app rounded-t-xl bg-white px-screen pb-lg pt-sm"
      >
        <div className="mx-auto h-[4px] w-40 rounded-pill bg-border" />
        <div className="mt-md flex flex-col items-stretch">
          <h2 className="text-title-lg text-black">Ubah Nama</h2>
          <p className="mt-xxs text-body-sm text-ink-muted">
            Nama ini akan tampil di profil dan sertifikatmu.
          </p>
          <div className="h-md" />
          <AppTextField
            value={value}
            onChange={setValue}
            hintText="Nama lengkap"
            icon={Pencil}
            autoFocus
            onSubmit={() => canSubmit && onSubmit(trimmed)}
          />
          <div className="h-lg" />
          <PrimaryButton
            label="Simpan"
            trailingIcon={Check}
            onPressed={canSubmit ? () => onSubmit(trimmed) : null}
          />
          <button
            type="button"
            onClick={onClose}
            className="mt-xs w-full px-md py-xs text-label-md font-semibold text-primary"
          >
            Batal
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
