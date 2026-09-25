import { cn } from "@/lib/cn";

interface JourneyPathProps {
  className?: string;
}

// Curved dotted line on a map showing a flight route from an airport to a destination
export default function JourneyPath({ className }: JourneyPathProps) {
  return (
    <svg
      viewBox="0 0 600 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
    >
      <path
        d="M40 160 C 160 20, 420 20, 560 150"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 14"
        className="text-palm-400"
      />
      <path
        d="M40 160 C 160 20, 420 20, 560 150"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="600"
        strokeDashoffset="600"
        className="text-gold-500 animate-dash"
      />
      {/* Airport marker */}
      <g transform="translate(40,160)">
        <circle r="9" className="fill-ocean-600" />
        <path
          d="M-4 0 L4 0 M0 -4 L0 4"
          stroke="white"
          strokeWidth="1.5"
          transform="rotate(45)"
        />
      </g>
      {/* Destination pin */}
      <g transform="translate(560,150)">
        <circle r="9" className="fill-gold-500" />
        <circle r="3.2" fill="white" />
      </g>
    </svg>
  );
}
