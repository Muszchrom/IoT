import { cn } from "@/lib/utils"

interface WrapperProps {
  children?: React.ReactNode,
  className?: string 
}

export default function Wrapper({children, className}: WrapperProps) {
  return (
    <div className={cn("p-4 flex flex-col gap-2 mx-auto min-w-xs w-full max-w-lg", className)}>
      {children}
    </div>
  )
}