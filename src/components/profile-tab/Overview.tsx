interface Activity {
  type: string;
  title: string;
  time: string;
  detail: string | null;
  stars: number | null;
}

interface StatCardProps {
  emoji: string;
  value: number;
  label: string;
}

function StatCard({ emoji, value, label }: StatCardProps) {
  return (
    <div className="flex-1 bg-amber-50 rounded-2xl flex flex-col items-center justify-center py-8 gap-2 min-w-0">
      <span className="text-3xl">{emoji}</span>
      <span className="text-4xl font-bold text-gray-800">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

interface ActivityItemProps {
  type: string;
  title: string;
  time: string;
  detail: string | null;
  stars: number | null;
}

function ActivityItem({ type, title, time, detail, stars }: ActivityItemProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 flex gap-4 items-start bg-white">
      <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm shrink-0">
        Z
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-800">
            {type} &quot;{title}&quot;
          </p>
          {stars !== null && (
            <span className="text-yellow-400 text-sm shrink-0">
              {"★".repeat(stars)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
        {detail && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{detail}</p>
        )}
      </div>
    </div>
  );
}

const RECENT_ACTIVITY: Activity[] = [
  {
    type: "You reviewed",
    title: "The Midnight Library",
    time: "2 days ago",
    detail:
      "An incredible book that makes you think about the infinite paths life could take. Highly recommended for anyone feeling stuck.",
    stars: 5,
  },
  
  {
    type: "You added",
    title: "Project Hail Mary",
    time: "5 days ago",
    detail: null,
    stars: null,
  },
];

function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      <p className="text-sm text-gray-400 mt-1 mb-6">
        Your reading journey at a glance
      </p>

      <div className="flex gap-4 mb-8">
        <StatCard emoji="📖" value={47} label="Books Read" />
        <StatCard emoji="❤️" value={12} label="Favorites" />
        <StatCard emoji="⭐" value={23} label="Reviews Written" />
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Activity
      </h2>
      <div className="flex flex-col gap-3">
        {RECENT_ACTIVITY.map((item, i) => (
          <ActivityItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Overview;
