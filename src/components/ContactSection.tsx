import { Mail, Phone, MapPin } from "lucide-react";
import handsSoil from "@/assets/hands-soil.jpg";

const ContactSection = () => {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
      <div className="glass rounded-3xl p-6 md:p-10 grid lg:grid-cols-12 gap-10 items-center">
        <figure className="lg:col-span-5 relative aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src={handsSoil}
            alt="Farmer's hands holding seedlings in fresh soil"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1600}
            height={1000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <figcaption className="absolute bottom-4 left-4 right-4 eyebrow text-foreground/90">
            From our farm to yours
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <p className="eyebrow text-primary mb-4">Contact</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-[0.98] mb-5">
            Real farmers. <span className="italic text-gradient">Real support.</span>
          </h2>
          <p className="text-foreground/65 mb-9 max-w-md">
            Our agronomy team answers within one business day — for a diagnosis review,
            treatment plan, or subscription help.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="tel:+918500956337"
              className="glass glass-hover rounded-2xl p-5 flex items-start gap-4"
            >
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="eyebrow text-muted-foreground mb-1">Call us</p>
                <p className="font-serif text-xl">+91 8500 956 337</p>
              </div>
            </a>
            <a
              href="mailto:mahammadroshan72@gmail.com"
              className="glass glass-hover rounded-2xl p-5 flex items-start gap-4"
            >
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="eyebrow text-muted-foreground mb-1">Email us</p>
                <p className="font-serif text-lg break-all">mahammadroshan72@gmail.com</p>
              </div>
            </a>
            <div className="glass rounded-2xl p-5 flex items-start gap-4 sm:col-span-2">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="eyebrow text-muted-foreground mb-1">Serving</p>
                <p className="font-serif text-xl">Farmers across India & beyond</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
