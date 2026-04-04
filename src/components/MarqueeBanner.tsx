const MarqueeBanner = ({ items, className = "" }: { items: string[]; className?: string }) => {
  const text = items.join(" ✦ ");
  const repeated = `${text} ✦ ${text} ✦ `;

  return (
    <div className={`overflow-hidden py-4 bg-white ${className}`}>
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-sm font-semibold tracking-[0.2em] uppercase text-black">
          {repeated}
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
