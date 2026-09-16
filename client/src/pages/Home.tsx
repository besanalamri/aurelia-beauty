import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Instagram,
  Menu,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

type Product = {
  id: number;
  brand: string;
  name: string;
  shade: string;
  price: string;
  category: "Face" | "Lips" | "Eyes";
  badge?: string;
  image?: string;
  gradient: string;
  productClass: string;
};

const products: Product[] = [
  {
    id: 1,
    brand: "Charlotte Tilbury",
    name: "Airbrush Flawless Lip Blur",
    shade: "Berry Blur",
    price: "$35",
    category: "Lips",
    badge: "Just in",
    gradient: "linear-gradient(135deg, #e8c2bd 0%, #a02f48 100%)",
    productClass: "lipstick",
  },
  {
    id: 2,
    brand: "NARS",
    name: "Light Reflecting Foundation",
    shade: "Barcelona",
    price: "$52",
    category: "Face",
    badge: "Bestseller",
    image: "/manus-storage/XueKUdSgz73r_497bc225.jpg",
    gradient: "linear-gradient(135deg, #d9b29a 0%, #8b4e36 100%)",
    productClass: "bottle",
  },
  {
    id: 3,
    brand: "Pat McGrath Labs",
    name: "Mothership XI Palette",
    shade: "Sunlit Seduction",
    price: "$128",
    category: "Eyes",
    badge: "Iconic",
    gradient: "linear-gradient(135deg, #c59b52 0%, #4c1d2b 100%)",
    productClass: "palette",
  },
  {
    id: 4,
    brand: "Rare Beauty",
    name: "Soft Pinch Liquid Blush",
    shade: "Believe",
    price: "$23",
    category: "Face",
    gradient: "linear-gradient(135deg, #f3b3a3 0%, #ad4f6a 100%)",
    productClass: "blush",
  },
  {
    id: 5,
    brand: "Dior Beauty",
    name: "Addict Lip Glow Oil",
    shade: "Mahogany",
    price: "$40",
    category: "Lips",
    gradient: "linear-gradient(135deg, #d4b29c 0%, #5f2937 100%)",
    productClass: "gloss",
  },
  {
    id: 6,
    brand: "Westman Atelier",
    name: "Face Trace Contour Stick",
    shade: "Truffle",
    price: "$48",
    category: "Face",
    gradient: "linear-gradient(135deg, #bb8066 0%, #4e2a27 100%)",
    productClass: "stick",
  },
];

const stories = [
  {
    number: "01",
    title: "The art of the undone lip",
    copy: "A veil of color, a touch of shine, and nothing that feels overworked. Meet the new ritual for a lived-in pout.",
    tag: "Beauty note / 04",
  },
  {
    number: "02",
    title: "Skin, but more luminous",
    copy: "The modern base is sheer where it can be, polished where it counts — built for real light and real life.",
    tag: "Beauty note / 05",
  },
  {
    number: "03",
    title: "A little drama, daily",
    copy: "From smoked plum to liquid gold, discover the edit that makes even a Tuesday feel like an occasion.",
    tag: "Beauty note / 06",
  },
];

const brands = ["NARS", "DIOR", "GIVENCHY", "GUCCI", "PAT McGRATH", "R.E.M.", "TOM FORD"];

function ProductVisual({ product }: { product: Product }) {
  return (
    <div
      className="product-visual"
      style={{ background: product.gradient }}
      aria-label={`${product.name} product visual`}
    >
      {product.image ? <img src={product.image} alt="" className="product-photo" /> : null}
      <div className={`fake-product ${product.productClass}`} aria-hidden="true">
        <span className="fake-product-shine" />
        {product.productClass === "palette" ? (
          <>
            <span className="palette-lid" />
            <span className="palette-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <i key={index} />
              ))}
            </span>
          </>
        ) : null}
      </div>
      <span className="visual-grain" />
      {product.badge ? <span className="product-badge">{product.badge}</span> : null}
    </div>
  );
}

function ProductCard({
  product,
  saved,
  inBag,
  onSave,
  onAdd,
  onQuickView,
}: {
  product: Product;
  saved: boolean;
  inBag: boolean;
  onSave: () => void;
  onAdd: () => void;
  onQuickView: () => void;
}) {
  return (
    <article className="product-card reveal-item">
      <div className="product-card-media">
        <ProductVisual product={product} />
        <button
          className={`icon-button save-button ${saved ? "is-saved" : ""}`}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={onSave}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} strokeWidth={1.7} />
        </button>
        <button className="quick-view" onClick={onQuickView}>
          Quick view <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="product-card-copy">
        <div>
          <p className="product-brand">{product.brand}</p>
          <h3>{product.name}</h3>
          <p className="product-shade">{product.shade}</p>
        </div>
        <div className="product-buy-row">
          <strong>{product.price}</strong>
          <button className={`add-button ${inBag ? "added" : ""}`} onClick={onAdd}>
            {inBag ? <Check size={15} /> : <ShoppingBag size={15} />}
            {inBag ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedProducts, setSavedProducts] = useState<number[]>([]);
  const [bagProducts, setBagProducts] = useState<number[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredProducts = useMemo(
    () => (activeCategory === "All" ? products : products.filter((product) => product.category === activeCategory)),
    [activeCategory],
  );
  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return query ? products.filter((product) => `${product.brand} ${product.name} ${product.category}`.toLowerCase().includes(query)) : products.slice(0, 3);
  }, [searchValue]);

  const toggleSaved = (id: number, name: string) => {
    setSavedProducts((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    toast(savedProducts.includes(id) ? `${name} removed from your edit` : `${name} saved to your edit`, { duration: 1800 });
  };

  const toggleBag = (id: number, name: string) => {
    setBagProducts((current) => (current.includes(id) ? current : [...current, id]));
    toast(`${name} added to your bag`, { duration: 1800 });
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast("Enter a valid email to join the edit", { duration: 2200 });
      return;
    }
    setSubscribed(true);
    toast("Welcome to the inner circle", { duration: 2200 });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        <span>Complimentary shipping on orders over $100</span>
        <button onClick={() => scrollTo("collection")}>Explore the edit <ArrowRight size={13} /></button>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu-trigger" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <button className="wordmark" onClick={() => scrollTo("top")} aria-label="Aurelia Beauty home">AURELIA <span>BEAUTY</span></button>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <button onClick={() => scrollTo("collection")}>Shop</button>
            <button onClick={() => scrollTo("brands")}>Brands</button>
            <button onClick={() => scrollTo("story")}>The journal</button>
            <button onClick={() => scrollTo("about")}>Our world</button>
          </nav>
          <div className="header-actions">
            <button className="header-action search-trigger" onClick={() => setSearchOpen(true)}><Search size={17} /><span>Search</span></button>
            <button className="header-action bag-trigger" onClick={() => toast(bagProducts.length ? `${bagProducts.length} piece${bagProducts.length > 1 ? "s" : ""} in your bag` : "Your bag is waiting for something beautiful", { duration: 2200 })}><ShoppingBag size={17} /><span>Bag</span>{bagProducts.length > 0 ? <b>{bagProducts.length}</b> : null}</button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="mobile-menu-head"><button className="wordmark" onClick={() => { scrollTo("top"); setMobileOpen(false); }}>AURELIA <span>BEAUTY</span></button><button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
          <nav><button onClick={() => scrollTo("collection")}>Shop <ArrowUpRight size={17} /></button><button onClick={() => scrollTo("brands")}>Brands <ArrowUpRight size={17} /></button><button onClick={() => scrollTo("story")}>The journal <ArrowUpRight size={17} /></button><button onClick={() => scrollTo("about")}>Our world <ArrowUpRight size={17} /></button></nav>
          <p>Curated beauty for the considered ritual.</p>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search the edit">
          <div className="search-panel">
            <div className="search-panel-head"><span>Find your next signature</span><button className="icon-button" onClick={() => { setSearchOpen(false); setSearchValue(""); }} aria-label="Close search"><X size={20} /></button></div>
            <div className="search-input-wrap"><Search size={19} /><input autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search products, brands, rituals..." /></div>
            <div className="search-results">
              <p className="eyebrow">{searchValue ? "Matching the edit" : "Trending now"}</p>
              {searchResults.length ? searchResults.map((product) => <button key={product.id} className="search-result" onClick={() => { setQuickView(product); setSearchOpen(false); }}><span className="search-result-swatch" style={{ background: product.gradient }} /><span><strong>{product.name}</strong><small>{product.brand} / {product.category}</small></span><ArrowUpRight size={15} /></button>) : <p className="empty-search">Nothing found yet — try a brand or category.</p>}
            </div>
          </div>
        </div>
      ) : null}

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> The new beauty standard</p>
            <h1>Beauty,<br /><em>considered.</em></h1>
            <p className="hero-description">A considered collection of the world’s most exceptional makeup — chosen for the way it makes you feel.</p>
            <div className="hero-cta-row"><button className="primary-button" onClick={() => scrollTo("collection")}>Shop the edit <ArrowUpRight size={16} /></button><button className="text-button" onClick={() => scrollTo("story")}>Read our point of view <ArrowRight size={15} /></button></div>
          </div>
          <div className="hero-visual-wrap">
            <div className="hero-image"><img src="/manus-storage/aurelia-hero_5d606645.jpg" alt="Luxury lipstick, perfume and compact arranged on silk" /><div className="hero-image-shade" /></div>
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-caption"><span>01 — 03</span><span>Chapter one / Objects of desire</span></div>
          </div>
          <div className="hero-side-note"><span>Scroll to discover</span><span className="scroll-line" /></div>
        </section>

        <section className="brand-strip" id="brands"><div className="brand-strip-label">The world’s finest<br />beauty houses</div><div className="brand-list">{brands.map((brand, index) => <span key={brand} className={index === 1 ? "brand-highlight" : ""}>{brand}</span>)}</div></section>

        <section className="collection-section section-wrap" id="collection">
          <div className="section-heading"><div><p className="eyebrow">The current edit / 01</p><h2>Pieces worth<br /><em>pausing for.</em></h2></div><p className="section-intro">From cult classics to new discoveries, these are the formulas, finishes and shades currently living rent-free in our minds.</p></div>
          <div className="collection-toolbar"><div className="category-tabs" role="tablist" aria-label="Product categories">{["All", "Face", "Lips", "Eyes"].map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div><button className="view-all-button" onClick={() => { setActiveCategory("All"); toast("Showing the full Aurelia edit", { duration: 1800 }); }}>View all <ArrowUpRight size={15} /></button></div>
          <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} saved={savedProducts.includes(product.id)} inBag={bagProducts.includes(product.id)} onSave={() => toggleSaved(product.id, product.name)} onAdd={() => toggleBag(product.id, product.name)} onQuickView={() => setQuickView(product)} />)}</div>
        </section>

        <section className="story-section section-wrap" id="story">
          <div className="story-image-wrap"><img src="/manus-storage/aurelia-story_692299b8.jpg" alt="Editorial portrait with glossy berry lip" /><div className="story-image-note">Aurelia / Face study<br /><span>Volume 01</span></div></div>
          <div className="story-copy"><p className="eyebrow">Aurelia journal / 02</p><div className="story-progress"><span>{stories[storyIndex].number}</span><div><span style={{ width: `${((storyIndex + 1) / stories.length) * 100}%` }} /></div><span>0{stories.length}</span></div><h2>{stories[storyIndex].title}</h2><p>{stories[storyIndex].copy}</p><button className="text-button" onClick={() => toast("The full journal is coming soon", { duration: 1800 })}>Read the story <ArrowRight size={15} /></button><div className="story-controls"><button className="icon-button" aria-label="Previous story" onClick={() => setStoryIndex((index) => (index - 1 + stories.length) % stories.length)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Next story" onClick={() => setStoryIndex((index) => (index + 1) % stories.length)}><ChevronRight size={18} /></button></div><span className="story-tag">{stories[storyIndex].tag}</span></div>
        </section>

        <section className="ritual-banner" id="about"><div className="ritual-mark"><Sparkles size={22} strokeWidth={1.3} /><span>A</span></div><div><p className="eyebrow">The Aurelia ritual</p><h2>Less, but better.<br /><em>Always.</em></h2></div><p>We believe beauty is a daily act of attention. Every object here is selected for its texture, its intelligence, and the small pleasure it brings to the mirror.</p><button className="circle-arrow" aria-label="Learn more about Aurelia" onClick={() => toast("Our curation philosophy is arriving soon", { duration: 1800 })}><ArrowUpRight size={22} /></button></section>

        <section className="newsletter-section"><div><p className="eyebrow">A note from Aurelia</p><h2>Stay in the<br /><em>know.</em></h2></div><div className="newsletter-content"><p>Private edits, first access and the occasional note on the art of getting ready. No noise, ever.</p>{subscribed ? <div className="subscribed-state"><Check size={17} /> You’re on the list — welcome in.</div> : <form onSubmit={submitNewsletter}><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Your email address" aria-label="Your email address" /><button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button></form>}<span className="fine-print">By subscribing, you agree to receive our considered correspondence.</span></div></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><button className="wordmark" onClick={() => scrollTo("top")}>AURELIA <span>BEAUTY</span></button><p>Curated beauty for the<br />considered ritual.</p><div className="footer-social"><span>Follow the edit</span><button aria-label="Instagram" onClick={() => toast("Instagram link coming soon", { duration: 1800 })}><Instagram size={17} /></button></div></div><div className="footer-bottom"><span>© 2026 Aurelia Beauty</span><div><button onClick={() => toast("Privacy policy coming soon", { duration: 1800 })}>Privacy</button><button onClick={() => toast("Shipping details coming soon", { duration: 1800 })}>Shipping</button><button onClick={() => toast("Contact details coming soon", { duration: 1800 })}>Contact</button></div><span>Made for the ritual</span></div></footer>

      {quickView ? <div className="quick-view-overlay" role="dialog" aria-modal="true" aria-label={`Quick view of ${quickView.name}`} onClick={() => setQuickView(null)}><div className="quick-view-modal" onClick={(event) => event.stopPropagation()}><button className="icon-button modal-close" aria-label="Close quick view" onClick={() => setQuickView(null)}><X size={19} /></button><div className="modal-visual"><ProductVisual product={quickView} /></div><div className="modal-copy"><p className="product-brand">{quickView.brand}</p><h2>{quickView.name}</h2><p className="modal-shade">{quickView.shade} / {quickView.category}</p><div className="modal-rating"><Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <span>Curator’s pick</span></div><p className="modal-description">A beautiful everyday essential with the kind of finish that catches the light — and keeps your attention.</p><div className="modal-buy"><strong>{quickView.price}</strong><button className="primary-button" onClick={() => { toggleBag(quickView.id, quickView.name); setQuickView(null); }}>Add to bag <ShoppingBag size={16} /></button></div></div></div></div> : null}
    </div>
  );
}
