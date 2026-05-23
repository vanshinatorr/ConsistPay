export function SocialProof() {
  const stats = [
    { value: "12,400+", label: "streaks built" },
    { value: "98%", label: "consistency rate" },
    { value: "5,000+", label: "challenges completed" },
  ];

  return (
    <section className="px-6 py-12 border-y border-white/5 bg-gradient-to-r from-violet-500/5 via-transparent to-emerald-500/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
