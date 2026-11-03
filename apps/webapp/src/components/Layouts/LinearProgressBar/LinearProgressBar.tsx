interface LinearProgressBarProps {
  percentage: number;
}

export const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  percentage,
}) => {
  return (
    <div className="w-full h-2 bg-white rounded-full">
      <div
        className="h-full bg-[#3942CF] rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
