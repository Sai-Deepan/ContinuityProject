import { useState, useEffect } from "react";
import type { Service } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Package, Laptop, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  Package,
  Laptop,
  Zap,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <section className="py-20 bg-background border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Professional Engineering Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From rapid prototyping to mass manufacturing, our suite of services is designed to accelerate your hardware development lifecycle.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">No services found.</div>
            ) : (
              services.map((service, index) => {
                const Icon = iconMap[service.iconName] || Zap;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    key={service.id}
                  >
                    <Card className="h-full flex flex-col hover:shadow-lg transition-all border-border bg-card group">
                      <CardHeader className="p-8 pb-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 flex-1 flex flex-col">
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="mt-auto">
                          <Button variant="outline" className="w-full" asChild>
                            <Link to="/contact">Request Quote</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
            Our engineering team can build customized workflows for your specialized hardware requirements.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg" asChild>
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}