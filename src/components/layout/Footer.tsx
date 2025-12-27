import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-2">
          <p className="text-foreground text-sm font-medium">TravelLog</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Built with{" "}
            <Heart className="text-muted-foreground inline-block h-4 w-4" /> by{" "}
            <span className="text-foreground font-medium">bennefitchristy</span>
            .
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Travel Article App. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
