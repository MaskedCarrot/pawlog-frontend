function CallButton({ label, contact, variant = 'primary' }) {
  const tel = contact?.replace(/\D/g, '') || '';
  const href = tel ? `tel:${tel}` : null;
  if (!href) return null;
  const base = 'inline-flex items-center justify-center gap-1.5 w-[130px] min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors';
  const primary = 'bg-emergency text-white hover:bg-red-600 shadow-sm';
  const secondary = 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200';
  const styles = variant === 'secondary' ? secondary : primary;
  return (
    <a href={href} className={`${base} ${styles}`}>
      <span className="text-base">📞</span>
      {label}
    </a>
  );
}

function ContactRow({ label, name, contact, variant, buttonLabel }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 only:py-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{name}</p>
      </div>
      <CallButton label={buttonLabel} contact={contact} variant={variant} />
    </div>
  );
}

export default function EmergencyBar({ vetName, vetContact, emergencyContactNumber, emergencyContactName }) {
  const hasVet = vetContact?.replace(/\D/g, '');
  const hasEmergency = emergencyContactNumber?.replace(/\D/g, '');

  if (!hasVet && !hasEmergency) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 divide-y divide-gray-200">
      {hasVet && (
        <ContactRow
          label="Vet"
          name={vetName || 'Veterinarian'}
          contact={vetContact}
          variant="primary"
          buttonLabel="Call Vet"
        />
      )}
      {hasEmergency && (
        <ContactRow
          label="Emergency contact"
          name={emergencyContactName || 'Backup'}
          contact={emergencyContactNumber}
          variant="secondary"
          buttonLabel="Call Backup"
        />
      )}
    </div>
  );
}
