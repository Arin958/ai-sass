import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Video } from "lucide-react";

export default function CTASection() {
  return (
    <section className="container mx-auto px-6 py-16">
      <Card className="relative overflow-hidden border-0 bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8 sm:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Transform Your Workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Join thousands of users who are already boosting their productivity with our AI tools
            </p>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="text-blue-600">
                <Link href="/signup">
                  Create Free Account
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/demo">
                  Watch Demo
                  <Video className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-sm text-blue-200">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}