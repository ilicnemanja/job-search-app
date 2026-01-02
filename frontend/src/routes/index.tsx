import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Search,
  Target,
  Bell,
} from "lucide-react";
import { JobSearch } from "@/components/JobSearch";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find Your <span className="text-primary">Dream Job</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover thousands of opportunities from top companies. Your next
              career move starts here.
            </p>
          </div>

          {/* Search Component */}
          <JobSearch />

          {/* Browse All Jobs CTA */}
          <div className="text-center mt-6">
            <Link to="/jobs">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Or browse all available jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatCard
              icon={<Briefcase className="h-8 w-8" />}
              value="10,000+"
              label="Active Jobs"
            />
            <StatCard
              icon={<Users className="h-8 w-8" />}
              value="5,000+"
              label="Companies"
            />
            <StatCard
              icon={<TrendingUp className="h-8 w-8" />}
              value="50,000+"
              label="Placements"
            />
            <StatCard
              icon={<Zap className="h-8 w-8" />}
              value="24h"
              label="Avg. Response"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Target className="h-10 w-10" />}
              title="Smart Matching"
              description="Our AI-powered algorithm matches you with jobs that fit your skills and preferences."
            />
            <FeatureCard
              icon={<Bell className="h-10 w-10" />}
              title="Real-time Updates"
              description="Get instant notifications when new jobs matching your criteria are posted."
            />
            <FeatureCard
              icon={<Search className="h-10 w-10" />}
              title="Easy Search"
              description="Find the perfect job with powerful filters for field and seniority level."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start browsing jobs from top companies in your field.
          </p>
          <Link to="/jobs">
            <Button size="lg" className="px-8">
              Browse All Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center p-6 rounded-xl bg-card/30 border border-border/50">
      <div className="inline-flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-foreground">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
