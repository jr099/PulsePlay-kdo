export function ResourceBadges() {
  const resources = ['Coins', 'Tickets Free', 'Tickets Premium', 'XP Saison', 'Gems', 'Reward Credits'];
  return (
    <div className="flex flex-wrap gap-2">
      {resources.map((resource) => (
        <span key={resource} className="rounded bg-slate-800 px-2 py-1 text-xs">{resource}</span>
      ))}
    </div>
  );
}
