import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
}

const SlideNavigation = ({ currentSlide, totalSlides, onPrev, onNext }: SlideNavigationProps) => {
  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-card/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      
      <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              i === currentSlide 
                ? "bg-primary w-4 md:w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5 md:w-2"
            }`}
          />
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-card/80 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 transition-all"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </div>
  );
};

export default SlideNavigation;
