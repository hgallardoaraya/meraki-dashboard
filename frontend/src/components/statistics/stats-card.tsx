type StatsCardProps = {
  title: string,
  subtitle: string,
  cardClassName: string
}

const StatsCard: React.FC<StatsCardProps> = ({title, subtitle, cardClassName}) => {
  return (
    <div className={`flex flex-col px-4 gap-1 justify-center bg-white shadow-sm h-20 border-l-8 border-solid rounded-sm ${cardClassName}`}>            
        <span className="font-bold text-2xl">{title}</span>
        <span className="text-gray-500 uppercase tracking-wide font-semibold text-xs">{subtitle}</span>      
    </div>
  )
}

export default StatsCard;