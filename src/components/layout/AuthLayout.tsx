import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Plane, MapPin, NotebookPen } from "lucide-react";
import { Card } from "@/components/ui/card";

const AuthLayout = () => {
  return (
    <div className="bg-muted/30 flex min-h-screen w-full items-stretch">
      <div className="container mx-auto grid flex-1 items-center gap-10 py-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="space-y-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="bg-primary text-primary-foreground inline-flex h-10 w-10 items-center justify-center rounded-xl">
                <Plane className="h-5 w-5" />
              </span>
              <div>
                <div className="text-foreground text-base font-semibold">
                  TravelLog
                </div>
                <div className="text-muted-foreground text-sm">
                  Write. Share. Discover.
                </div>
              </div>
            </Link>

            <div className="space-y-3">
              <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                Your next trip starts with a story
              </h1>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Join the community to read destination guides, save inspiration,
                and share your own travel notes.
              </p>
            </div>

            <div className="grid gap-3">
              <Card className="bg-background/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">
                      Find places worth visiting
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Discover stories by destination and category.
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-background/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg">
                    <NotebookPen className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">
                      Keep your trip notes tidy
                    </div>
                    <div className="text-muted-foreground text-sm">
                      A clean place for your travel articles.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
