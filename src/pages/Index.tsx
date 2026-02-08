import { useState, useEffect, useCallback } from "react";
import SlideNavigation from "@/components/SlideNavigation";
import IntroSlide from "@/components/slides/IntroSlide";
import InfluencersSlide from "@/components/slides/InfluencersSlide";
import StreamersSlide from "@/components/slides/StreamersSlide";
import CommunitiesSlide from "@/components/slides/CommunitiesSlide";
import ContentPlanSlide from "@/components/slides/ContentPlanSlide";
import OnboardingSlide from "@/components/slides/OnboardingSlide";
import AMATopicsSlide from "@/components/slides/AMATopicsSlide";
import BudgetSlide from "@/components/slides/BudgetSlide";
import MetricsSlide from "@/components/slides/MetricsSlide";

const slides = [
  IntroSlide,
  InfluencersSlide,
  StreamersSlide,
  CommunitiesSlide,
  AMATopicsSlide,
  BudgetSlide,
  MetricsSlide,
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div
        key={currentSlide}
        className="slide-enter"
      >
        <CurrentSlideComponent />
      </div>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {/* Keyboard hint - hidden on mobile */}
      <div className="hidden md:block fixed bottom-8 right-8 text-xs text-muted-foreground/50">
        Use ← → or space to navigate
      </div>
    </div>
  );
};

export default Index;
