
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { 
  Home, Globe, PieChart, BarChart2, LineChart, 
  Menu, ChevronRight, ChevronLeft 
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const regions = [
  { id: "us", label: "United States" },
  { id: "europe", label: "Europe" },
  { id: "india", label: "India" },
  { id: "china", label: "China" },
];

const sectors = [
  { id: "energy", label: "Energy" },
  { id: "transport", label: "Transport" },
  { id: "industry", label: "Industry" },
  { id: "residential", label: "Residential" },
  { id: "agriculture", label: "Agriculture" },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isRegionActive = (regionId: string) => {
    return location.pathname === `/regions/${regionId}`;
  };

  const isSectorActive = (sectorId: string) => {
    return location.pathname === `/sectors/${sectorId}`;
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Emissions Dashboard</h2>
        <p className="text-sm text-muted-foreground">CO₂, CO, CH₄ Analysis</p>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-auto">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">General</h3>
          <div className="space-y-1">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Home className="mr-2 size-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/world-map">
              <Button 
                variant={isActive("/world-map") ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Globe className="mr-2 size-4" />
                World Map View
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Regions</h3>
          <div className="space-y-1">
            {regions.map((region) => (
              <Link to={`/regions/${region.id}`} key={region.id}>
                <Button 
                  variant={isRegionActive(region.id) ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <BarChart2 className="mr-2 size-4" />
                  {region.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Sectors</h3>
          <div className="space-y-1">
            {sectors.map((sector) => (
              <Link to={`/sectors/${sector.id}`} key={sector.id}>
                <Button 
                  variant={isSectorActive(sector.id) ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <PieChart className="mr-2 size-4" />
                  {sector.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">© 2025 Emissions Analysis</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden lg:block border-r transition-all duration-300 ease-in-out overflow-hidden", 
          sidebarOpen ? "w-64" : "w-0"
        )}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden absolute left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Toggle Sidebar Button (Desktop) */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setSidebarOpen(prev => !prev)}
        className="hidden lg:flex absolute left-4 bottom-4 z-40"
      >
        {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
