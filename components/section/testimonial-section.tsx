import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "This platform revolutionized my content workflow. I save 10+ hours every week!",
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Developer",
      content: "The code assistant is incredible. It's like having a senior developer by my side.",
      avatar: "MJ",
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Director",
      content: "Our team's productivity increased by 40% since we started using AIStudio.",
      avatar: "ER",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Loved by Users
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          See what our users are saying about AIStudio
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-purple-600">
                  <span className="font-semibold text-white">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">&quot;{testimonial.content}&quot;</p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}