interface WrapperProps {
  children: React.ReactNode
}

export default function Wrapper({children}: WrapperProps) {
  return (
    <div className="p-4 flex flex-col gap-2 mx-auto min-w-xs w-full max-w-lg">
      {children}
    </div>
  )
}