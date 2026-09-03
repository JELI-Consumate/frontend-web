interface AuthFooterLinkProps {
  question: string;
  action: string;
  onTap: () => void;
}

/** Padanan `auth_footer_link.dart`. */
export function AuthFooterLink({ question, action, onTap }: AuthFooterLinkProps) {
  return (
    <div className="flex justify-center">
      <button type="button" onClick={onTap} className="px-md py-xs text-body-sm text-ink-muted">
        {question} <span className="font-bold text-primary">{action}</span> ›
      </button>
    </div>
  );
}
