import { cn } from "../../lib/utils";

export const Component = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="loader-wrapper flex flex-col items-center justify-center relative">
        <div className="flex gap-2 mb-8">
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">G</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">e</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">n</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">e</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">r</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">a</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">t</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">i</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">n</span>
          <span className="loader-letter text-2xl font-light tracking-[0.2em] text-emerald-400/80 uppercase">g</span>
        </div>

        <div className="loader"></div>
      </div>
    </div>
  );
};
