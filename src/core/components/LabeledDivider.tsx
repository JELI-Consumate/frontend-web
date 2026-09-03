/** Setara `frontend-android/lib/core/widgets/labeled_divider.dart`. */
export function LabeledDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center">
      <span className="h-px flex-1 bg-border" />
      <span className="px-sm text-body-sm text-ink-muted">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
