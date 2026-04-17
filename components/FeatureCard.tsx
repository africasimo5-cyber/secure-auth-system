'use client';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

export default function FeatureCard({ title, description, icon, delay = "0" }: FeatureCardProps) {
  return (
    <div 
      className={`group p-8 rounded-3xl bg-[#0f172a] border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
        <div className="text-blue-400 group-hover:text-white transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
        {description}
      </p>
    </div>
  );
}
