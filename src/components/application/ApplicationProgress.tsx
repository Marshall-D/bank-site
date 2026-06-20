import { cn } from '@/lib/utils'
import { APPLICATION_STEPS } from '@/lib/application/constants'

type ApplicationProgressProps = {
  currentStep: number
}

export function ApplicationProgress({ currentStep }: ApplicationProgressProps) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Step {currentStep} of {APPLICATION_STEPS.length}
        </span>
        <span>{APPLICATION_STEPS[currentStep - 1]?.title}</span>
      </div>
      <div className="flex gap-2">
        {APPLICATION_STEPS.map((step) => (
          <div
            key={step.id}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              step.id <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  )
}
