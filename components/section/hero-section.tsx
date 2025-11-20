import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const stats = [
    { number: "50+", label: "AI Tools" },
    { number: "10K+", label: "Users" },
    { number: "500K+", label: "Tasks Completed" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <section className="container mx-auto px-6 py-16 sm:py-24 lg:py-32">
      <div className="text-center">
        <Badge variant="outline" className="mb-6 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
          🚀 Trusted by 10,000+ users worldwide
        </Badge>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Your All-in-One
          <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Toolkit
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
          Generate content, analyze data, create images, and more with our comprehensive suite of AI tools. 
          Everything you need, powered by cutting-edge artificial intelligence.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Link href="/signup">
              Start Free Trial
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">
              View Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}