import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  currentStep: string;
  completedSteps: string[];
}

export const StepIndicator = ({ steps, currentStep, completedSteps }: StepIndicatorProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isUpcoming = !isCompleted && !isCurrent;

        return (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-smooth",
                  {
                    "bg-primary text-primary-foreground shadow-lg": isCompleted,
                    "bg-drawing-active text-background ring-2 ring-drawing-active ring-offset-2": isCurrent,
                    "bg-muted text-muted-foreground": isUpcoming,
                  }
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-2 transition-smooth",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-sm font-medium transition-smooth",
                  {
                    "text-primary": isCompleted,
                    "text-drawing-active": isCurrent,
                    "text-muted-foreground": isUpcoming,
                  }
                )}
              >
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};