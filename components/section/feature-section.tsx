import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Image, Zap, Code, Mic, Video } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Content Generation",
      description: "Create blog posts, social media content, and marketing copy in seconds",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Image,
      title: "Image Creation",
      description: "Generate stunning images and artwork from text descriptions",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Data Analysis",
      description: "Extract insights and patterns from your data with AI-powered analytics",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Code,
      title: "Code Assistant",
      description: "Write better code faster with intelligent suggestions and debugging",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Mic,
      title: "Voice Synthesis",
      description: "Convert text to natural-sounding speech in multiple languages",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Video,
      title: "Video Processing",
      description: "Edit, enhance, and analyze videos with AI-powered tools",
      color: "from-rose-500 to-orange-500",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Powerful AI Tools
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Everything you need to supercharge your workflow
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="group relative overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className={`mb-4 inline-flex rounded-lg bg-linear-to-r ${feature.color} p-3`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}