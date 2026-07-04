import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getFeaturedLocations } from "@/data/locations";

const Locations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const featuredLocations = getFeaturedLocations();

  const renderCard = (location: ReturnType<typeof getFeaturedLocations>[number]) => (
    <Link to={`/location/${location.id}`} className="block">
      <div className="relative h-48 overflow-hidden">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-light text-xs">{location.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-base font-normal mb-1 text-card-foreground tracking-tight">{location.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-4 text-xs font-light">
          <MapPin className="h-3 w-3" />
          <span>{location.location}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {location.features.map((feature) => (
            <span key={feature} className="text-[10px] uppercase tracking-wide px-2 py-1 bg-accent text-accent-foreground rounded-sm font-light">{feature}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-light text-foreground">${location.price}</span>
            <span className="text-muted-foreground text-xs font-light">/night</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs font-light">
            View Details
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </Link>
  );

  return (
    <section id="locations" className="py-32 lg:py-40 bg-background" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
            Our Locations
          </span>
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground tracking-tight">
            Featured Spots
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
            Handpicked spots where nature's beauty meets sustainable comfort
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
            >
              <Card className="overflow-hidden border border-border bg-card shadow-lg h-full hover:shadow-2xl transition-shadow duration-300">
                {renderCard(location)}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;