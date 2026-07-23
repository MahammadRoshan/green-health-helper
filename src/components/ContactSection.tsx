import { Mail, Phone, MapPin } from "lucide-react";
import handsSoil from "@/assets/hands-soil.jpg";

const ContactSection = () => {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <figure className="lg:col-span-6 relative aspect-[4/3] overflow-hidden border border-foreground/10">
          <img
            src={handsSoil}
            alt="Farmer's hands holding seedlings in fresh soil"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1600}
            height={1000}
          />
          <figcaption className="absolute bottom-4 left-4 right-4 text-background eyebrow">
            Fig. 04 · From our farm to yours
          </figcaption>
        </figure>

        <div className="lg:col-span-6">
          <p className="eyebrow text-primary mb-4">Section VI · Contact</p>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] mb-6">
            Real farmers.<br />
            <span className="italic">Real support.</span>
          </h2>
          <p className="text-foreground/70 mb-10 max-w-md">
            Our agronomy team answers within one business day. Reach us any time
            for a diagnosis review, treatment plan, or subscription help.
          </p>

          <div className="space-y-6">
            <a
              href="tel:+918500956337"
              className="flex items-start gap-5 group border-t border-foreground/15 pt-6"
            >
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="eyebrow opacity-50 mb-1">Call us</p>
                <p className="font-serif text-2xl italic group-hover:text-primary transition-colors">
                  +91 8500 956 337
                </p>
              </div>
            </a>
            <a
              href="mailto:mahammadroshan72@gmail.com"
              className="flex items-start gap-5 group border-t border-foreground/15 pt-6"
            >
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="eyebrow opacity-50 mb-1">Email us</p>
                <p className="font-serif text-2xl italic group-hover:text-primary transition-colors break-all">
                  mahammadroshan72@gmail.com
                </p>
              </div>
            </a>
            <div className="flex items-start gap-5 border-t border-b border-foreground/15 py-6">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="eyebrow opacity-50 mb-1">Serving</p>
                <p className="font-serif text-2xl italic">Farmers across India & beyond</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
