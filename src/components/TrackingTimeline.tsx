import type { StatusHistory } from '@/vite-env.d';

interface TrackingTimelineProps {
  history: StatusHistory[];
}

export default function TrackingTimeline({ history }: TrackingTimelineProps) {
  if (!history || history.length === 0) {
    return <p className="loading">No status history available</p>;
  }

  return (
    <ul className="timeline">
      {history.map((item) => (
        <li key={item.id} className="timeline-item">
          <div className="timeline-status">{item.status}</div>
          {/* BUG: Shows raw timestamp instead of formatted date */}
          <div className="timeline-time">{item.createdAt}</div>
          {/* FIXME: Should format as "Jul 18, 2026 23:24" */}
          {item.note && <div className="timeline-note">{item.note}</div>}
        </li>
      ))}
    </ul>
  );
}
