const MarqueeBanner = ({ items, className = "" }: { items: string[]; className?: string }) => {
  const text = items.join("\u00A0\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0\u00A0\u00A0");
  const repeated = Array(4).fill(text).join("\u00A0\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0\u00A0\u00A0") + "\u00A0\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0\u00A0\u00A0";

  return (
    <div className={`overflow-hidden py-1.5 bg-white ${className}`}>
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-sm font-semibold tracking-wide uppercase text-black">
          {repeated}
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
