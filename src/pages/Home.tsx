import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { categories, mockComponents } from "../data/mock";
import { ArrowRight, Cpu, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const featuredComponents = mockComponents.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-muted/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6"
          >
            Powering Next-Gen <br className="hidden md:block" />
            <span className="text-primary">Hardware Innovation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            The premium marketplace for professional-grade electronic components. Trusted by engineers, makers, and top universities worldwide.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link to="/components">
                Browse Catalog <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link to="/services">View Services</Link>
            </Button>
          </motion.div>
        </div>
      </section>



      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Categories</h2>
            <p className="mt-4 text-lg text-muted-foreground">Find exactly what you need for your next build.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={category}
              >
                <Link to={`/components?category=${category}`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full group bg-card">
                    <CardHeader className="p-6">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {category}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Components */}
      <section className="py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Popular Components</h2>
              <p className="mt-2 text-muted-foreground">Highest rated components this week.</p>
            </div>
            <Link to="/components" className="hidden sm:flex text-primary font-medium hover:underline items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredComponents.map((component, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={component.id}
              >
                <Link to={`/components/${component.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all border-border bg-card h-full flex flex-col group">
                    <div className="aspect-square overflow-hidden bg-muted relative">
                      <img 
                        src={component.image} 
                        alt={component.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-primary font-medium mb-2">{component.category}</div>
                      <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{component.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{component.manufacturer}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                        <span className="font-bold text-lg">₹{component.price.toFixed(2)}</span>
                        <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          {component.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every component is sourced from authorized distributors and undergoes strict quality checks before shipping.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Next-day delivery available on all orders placed before 8 PM. Keep your projects moving without delay.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Engineering Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Stuck on a design? Our team of electrical engineers is available 24/7 to help you choose the right parts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your next project?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of engineers and makers who trust Amaze Services for their hardware needs.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg" asChild>
            <Link to="/components">Explore Catalog</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}