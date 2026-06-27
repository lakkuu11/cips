import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/cips-logo.jpeg";
import campus from "@/assets/cips-campus.jpg";
import lab from "@/assets/cips-lab.jpg";
import research from "@/assets/cips-research.jpg";
import library from "@/assets/cips-library.jpg";
import principal from "@/assets/cips-principal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CIPS — Chaudhary Institute of Pharmaceutical Science, Lakhimpur Kheri" },
      {
        name: "description",
        content:
          "PCI-approved pharmacy college in Lakhimpur Kheri, UP offering D.Pharm and B.Pharm. Affiliated to BTE UP and AKTU. Admissions open for 2026-27.",
      },
      { property: "og:title", content: "Chaudhary Institute of Pharmaceutical Science (CIPS)" },
      {
        property: "og:description",
        content:
          "Premier pharmacy institute in Lakhimpur Kheri. D.Pharm & B.Pharm programs. Approved by PCI, affiliated to BTE UP & AKTU Lucknow.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const program = String(data.get("course") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !email) {
      setErrorMsg("Please fill in name, phone and email.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    const { error } = await supabase.from("enquiries").insert({
      name: name.slice(0, 120),
      email: email.slice(0, 254),
      phone: phone.slice(0, 30),
      program: program ? program.slice(0, 60) : null,
      message: message ? message.slice(0, 2000) : null,
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg("Could not submit. Please try again or call us.");
      return;
    }
    setSubmitted(true);
    form.reset();
  };

  const nav = [
    { id: "about", label: "About" },
    { id: "programs", label: "Programs" },
    { id: "why", label: "Why CIPS" },
    { id: "facilities", label: "Facilities" },
    { id: "principal", label: "Principal" },
    { id: "apply", label: "Admissions" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="bg-background text-foreground antialiased">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5">
            <img src={logo} alt="CIPS logo" className="size-10 rounded-md object-contain bg-white ring-1 ring-border" />
            <div className="text-left leading-tight">
              <div className="font-bold text-sm tracking-tight text-brand uppercase">CIPS</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">Lakhimpur Kheri</div>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-brand transition-colors"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("apply")}
              className="ml-2 bg-brand text-brand-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
            >
              Apply Now
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-foreground transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-6 h-0.5 bg-foreground my-1.5 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-6 h-0.5 bg-foreground transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-3 flex flex-col">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="text-left py-3 text-base font-medium text-foreground border-b border-border last:border-0"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative min-h-[640px] md:min-h-[720px] flex flex-col justify-end p-6 md:p-12 overflow-hidden">
        <img src={campus} alt="CIPS campus" className="absolute inset-0 w-full h-full object-cover" width={1536} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-5">
          <span className="inline-block px-3 py-1.5 bg-accent-green-soft text-brand-dark text-xs font-bold rounded-full uppercase tracking-widest">
            Admissions Open 2026-27
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.05] max-w-3xl text-balance">
            Shaping the future of <span className="text-accent-green">Pharmacy</span> in Lakhimpur Kheri
          </h1>
          <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xl">
            Chaudhary Institute of Pharmaceutical Science — approved by the Pharmacy Council of India and affiliated to BTE Uttar Pradesh and AKTU Lucknow.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => scrollTo("apply")}
              className="bg-brand text-brand-foreground font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-brand/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Apply for 2026-27
            </button>
            <button
              onClick={() => scrollTo("programs")}
              className="bg-white/10 text-white border border-white/30 backdrop-blur-sm font-semibold px-6 py-3.5 rounded-lg hover:bg-white/20 transition-all"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "PCI", v: "Approved" },
            { k: "BTE UP", v: "Affiliated" },
            { k: "AKTU", v: "Affiliated" },
            { k: "2026-27", v: "Admissions Open" },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-lg md:text-xl font-extrabold text-brand">{s.k}</div>
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-3xl mx-auto opacity-0 translate-y-4 transition-all duration-700" data-reveal>
          <div className="w-12 h-1 bg-accent-green mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">A warm welcome to CIPS</h2>
          <p className="text-lg text-foreground/75 leading-relaxed mb-4">
            For families in Lakhimpur Kheri and across Uttar Pradesh, choosing where to study pharmacy is a deeply personal decision. At CIPS, we treat that trust with the seriousness it deserves.
          </p>
          <p className="text-lg text-foreground/75 leading-relaxed">
            Our campus in Sherpur, Dhaurahra brings together experienced faculty, well-equipped laboratories, and an academic culture that prepares young pharmacists to serve communities with skill and integrity.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 opacity-0 translate-y-4 transition-all duration-700" data-reveal>
            <div className="w-12 h-1 bg-accent-green mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Programs</h2>
            <p className="text-foreground/70 mt-3 max-w-xl">Two PCI-approved pathways into a meaningful pharmacy career.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "D.Pharm",
                duration: "2 Year Diploma",
                img: lab,
                desc: "Diploma in Pharmacy — practical, foundational training for students who want to begin their careers as licensed pharmacists in hospitals, retail, and community settings.",
                points: ["Pharmaceutics & Pharmacology", "Hospital & Clinical Pharmacy", "Eligible for D-Reg with State Pharmacy Council"],
              },
              {
                title: "B.Pharm",
                duration: "4 Year Degree",
                img: research,
                desc: "Bachelor of Pharmacy — a comprehensive degree covering medicinal chemistry, pharmacology, research, and drug manufacturing, with pathways into M.Pharm and industry roles.",
                points: ["AKTU affiliated curriculum", "Industrial training & internships", "Research-led laboratory practice"],
              },
            ].map((p) => (
              <article
                key={p.title}
                className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-4"
                data-reveal
              >
                <div className="aspect-video overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy" width={1024} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-brand">{p.title}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-accent-green-soft text-brand-dark rounded uppercase tracking-wider">{p.duration}</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{p.desc}</p>
                  <ul className="space-y-1.5 pt-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="text-sm text-foreground/80 flex gap-2">
                        <span className="text-accent-green mt-0.5">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollTo("apply")}
                    className="w-full mt-4 bg-brand text-brand-foreground font-semibold py-3 rounded-lg hover:bg-brand-dark transition-colors"
                  >
                    Apply for {p.title}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why CIPS */}
      <section id="why" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 opacity-0 translate-y-4 transition-all duration-700" data-reveal>
            <div className="w-12 h-1 bg-accent-green mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose CIPS</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🎓", title: "PCI Approved", desc: "Programs approved by the Pharmacy Council of India for nationwide recognition." },
              { icon: "🔬", title: "Modern Labs", desc: "Pharmaceutics, pharmacology, chemistry, and analysis labs fully stocked for hands-on learning." },
              { icon: "👩‍🏫", title: "Experienced Faculty", desc: "Qualified teachers led by Principal Dr. Anupam Sharma — committed to student outcomes." },
              { icon: "🤝", title: "Career Support", desc: "Guidance for D.Reg, internships, and onward placement in hospitals, retail, and industry." },
            ].map((c) => (
              <div
                key={c.title}
                className="p-6 bg-white rounded-2xl border border-border hover:border-brand/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-4"
                data-reveal
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 opacity-0 translate-y-4 transition-all duration-700" data-reveal>
            <div className="w-12 h-1 bg-accent-green mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Infrastructure & Facilities</h2>
            <p className="text-foreground/70 mt-3">A learning environment built for serious pharmacy education.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { img: lab, title: "Laboratories", desc: "Dedicated pharmaceutics, pharmacology, and analytical chemistry labs." },
              { img: library, title: "Library", desc: "Reference textbooks, pharmacopoeias, journals, and quiet reading space." },
              { img: research, title: "Equipment & Research", desc: "Modern analytical instruments supporting practical coursework and projects." },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-4"
                data-reveal
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={f.img} alt={f.title} loading="lazy" width={1024} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1.5">{f.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section id="principal" className="py-20 px-6">
        <div className="max-w-6xl mx-auto opacity-0 translate-y-4 transition-all duration-700" data-reveal>
          <div className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-accent-green mb-3">Principal's Message</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">A Word From Our Principal</h2>
            <div className="w-16 h-1 bg-accent-green mx-auto mt-4" />
          </div>

          <div className="bg-brand text-brand-foreground rounded-3xl p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-10 items-start shadow-xl">
            <div className="text-center md:text-left">
              <img
                src={principal}
                alt="Dr. Anupam Sharma, Principal of CIPS"
                loading="lazy"
                width={512}
                height={512}
                className="size-36 md:size-48 rounded-full object-cover border-4 border-white/20 shadow-2xl mx-auto md:mx-0"
              />
              <div className="mt-5">
                <div className="font-semibold text-lg">Dr. Anupam Sharma</div>
                <div className="text-sm opacity-75">Principal, CIPS</div>
              </div>
            </div>

            <div className="relative">
              <span aria-hidden className="absolute -top-6 -left-2 text-7xl leading-none text-accent-green/60 font-serif select-none">“</span>
              <p className="text-base md:text-lg leading-relaxed opacity-95 mb-4 relative">
                Dear students and parents, welcome to the Chaudhary Institute of Pharmaceutical Science. Pharmacy is more than a profession — it is a promise of care, precision, and trust placed in our hands by every patient and community we serve.
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-95 mb-4">
                At CIPS, we are committed to building that promise into every student. Through modern laboratories, an experienced faculty, and an environment that values discipline as much as curiosity, we prepare graduates who are not only skilled but also ethical and compassionate.
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-95 mb-6">
                I invite you to join our family of learners — to dream boldly, work diligently, and step into a future where you make a real difference in people's lives.
              </p>
              <div className="pt-4 border-t border-white/15">
                <div className="font-serif italic text-xl">— Dr. Anupam Sharma</div>
                <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Principal · CIPS, Lakhimpur Kheri</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply / Contact */}
      <section id="apply" className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div id="contact" className="opacity-0 translate-y-4 transition-all duration-700" data-reveal>
            <div className="w-12 h-1 bg-accent-green mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Admissions Open 2026-27</h2>
            <p className="text-foreground/70 mb-8 leading-relaxed">
              Send us your details and our admissions team will reach out with eligibility, fees, and the next steps for your chosen course.
            </p>
            <div className="space-y-4 text-sm">
              <a href="tel:7080863309" className="flex items-start gap-3 group">
                <span className="text-xl shrink-0">📞</span>
                <div>
                  <div className="font-semibold">Call us</div>
                  <div className="text-foreground/70">7080863309</div>
                </div>
              </a>
              <a href="mailto:jitendraayu@gmail.com" className="flex items-start gap-3 group">
                <span className="text-xl shrink-0">✉️</span>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-foreground/70">jitendraayu@gmail.com</div>
                </div>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Sherpur+Dhaurahra+Lakhimpur+Kheri"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 group"
              >
                <span className="text-xl shrink-0">📍</span>
                <div>
                  <div className="font-semibold">Campus</div>
                  <div className="text-foreground/70">Vill & Post Sherpur, Dhaurahra,<br />Lakhimpur Kheri, UP – 262722</div>
                </div>
              </a>
            </div>
            <div className="mt-6 rounded-xl overflow-hidden border border-border aspect-video">
              <iframe
                title="CIPS location"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Sherpur+Dhaurahra+Lakhimpur+Kheri&output=embed"
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-xl shadow-slate-200/60 space-y-4 opacity-0 translate-y-4 transition-all duration-700 self-start"
            data-reveal
          >
            <h3 className="text-xl font-bold mb-2">Send us a message</h3>
            {submitted && (
              <div className="bg-accent-green-soft text-brand-dark text-sm rounded-lg p-3 border border-accent-green/30">
                Thank you! Your enquiry has been received. Our admissions team will contact you shortly.
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-200">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold uppercase text-foreground/60 mb-1 block">Full Name</label>
              <input name="name" required maxLength={100} className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-foreground/60 mb-1 block">Phone</label>
                <input name="phone" type="tel" required maxLength={15} className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-foreground/60 mb-1 block">Email</label>
                <input name="email" type="email" required maxLength={120} className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-foreground/60 mb-1 block">Course Interested</label>
              <select name="course" required defaultValue="D.Pharm" className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
                <option>D.Pharm</option>
                <option>B.Pharm</option>
                <option>Both</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-foreground/60 mb-1 block">Message</label>
              <textarea name="message" rows={4} maxLength={1000} className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand text-brand-foreground font-semibold py-3.5 rounded-lg shadow-lg shadow-brand/20 hover:bg-brand-dark hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="CIPS" className="size-12 rounded-md object-contain bg-white p-1" />
              <div>
                <div className="text-white font-bold uppercase tracking-wider text-sm">CIPS</div>
                <div className="text-xs">Lakhimpur Kheri</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed">Chaudhary Institute of Pharmaceutical Science. Approved by PCI, affiliated to BTE UP & AKTU Lucknow.</p>
          </div>
          <div className="text-sm space-y-2">
            <div className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Contact</div>
            <div>Vill & Post Sherpur, Dhaurahra,<br />Lakhimpur Kheri, UP – 262722</div>
            <div>📞 <a href="tel:7080863309" className="hover:text-white transition-colors">7080863309</a></div>
            <div>✉️ <a href="mailto:jitendraayu@gmail.com" className="hover:text-white transition-colors">jitendraayu@gmail.com</a></div>
          </div>
          <div className="text-sm space-y-2">
            <div className="text-white font-semibold uppercase text-xs tracking-wider mb-3">Quick Links</div>
            {nav.map((n) => (
              <div key={n.id}>
                <button onClick={() => scrollTo(n.id)} className="hover:text-white transition-colors">{n.label}</button>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
          © {new Date().getFullYear()} Chaudhary Institute of Pharmaceutical Science. All rights reserved.
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 size-12 bg-brand text-brand-foreground rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-dark transition-all ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
