interface CircleProgressBarProps {
  percentage: number;
  bg?: boolean;
}

export const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  percentage,
  bg,
}) => {
  const getColor = () => {
    if (percentage < 50) return "text-red-500 stroke-red-500";
    if (percentage < 80) return "text-yellow-500 stroke-yellow-500";
    return "text-green-500 stroke-green-500";
  };

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative w-18 h-18 flex items-center justify-center ${
        bg && "rounded-full bg-[#333C59]"
      } `}
    >
      <svg className="w-fill transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="6"
          className="stroke-gray-300 fill-none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="6"
          className={`${getColor()} fill-none transition-all `}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute text-sm font-regular ${getColor()}`}>
        {percentage}%
      </span>
    </div>
  );
};
