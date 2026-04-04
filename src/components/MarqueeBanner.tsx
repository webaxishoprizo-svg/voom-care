const MarqueeBanner = ({ items, className = "" }: { items: string[]; className?: string }) => {
  const text = items.join("✦");
  const repeated = `${text}✦${text}✦`;

  return (
    <div className={`overflow-hidden py-4 border-y border-border ${className}`}>
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-sm tracking-[0.15em] uppercase text-muted-foreground">
          {repeated}
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
