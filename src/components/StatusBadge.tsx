interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize to lowercase for the CSS class
  const normalizedStatus = status.toLowerCase();
  const badgeClass = `badge badge-${normalizedStatus}`;

  // NOTE: The display keeps the original casing
  // This means the badge might show "DELIVERED" or "delivered" depending on the source
  return (
    <span className={badgeClass}>
      {status}
    </span>
  );
}
