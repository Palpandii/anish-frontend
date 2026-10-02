import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { useProducts } from '../hooks/useProducts.js'
import { buildWhatsAppOrderUrl } from '../utils/whatsapp.js'
import './Home.css'

// Names of products to feature under "Popular this Season".
// Using names instead of IDs so this keeps working even if the
// products table gets re-seeded and IDs change.
const FEATURED_PRODUCT_NAMES = [
  '6" Mega DLX Rider',
  'Bada Peacock',
  '7 Step Wedding (Special) (Suryakala)',
  '120 Shot Multicolour (AK)',
  'Master Bomb (10 Pcs)',
  'Merry Go Round Sparklers (Umbrella)',
  'Gift Box Premium',
  '60 Items',
]

// Brand logos shown below the WhatsApp order section.
// These files should already be sitting in the /public/brands folder —
// rename the "src" paths and "name" labels below to match your actual files/brands.
const BRAND_LOGOS = [
  { src: '/brands/brands1.jpeg', name: 'STARVELL' },
  { src: '/brands/brands2.jpeg', name: 'RAVIKANNAN' },
  { src: '/brands/brands3.jpeg', name: "AK" },
  { src: '/brands/brands4.jpeg', name: 'VADIVEL' },
  { src: '/brands/brands5.jpeg', name: "SURYAKALAA'S" },
  { src: '/brands/brands6.jpeg', name: "PANDIYAN" },
]

export default function Home() {
  const { t, lang } = useLanguage()
  const { categories, loading: categoriesLoading } = useCategories()
  const { products, loading: productsLoading } = useProducts()

  const featured = products
    .filter((p) => FEATURED_PRODUCT_NAMES.includes(p.name_en))
    .slice(0, 8)

  // Fallback: if none of the named products are found (e.g. names changed),
  // just show the first 8 products so the section is never empty.
  const featuredToShow = featured.length > 0 ? featured : products.slice(0, 8)

  const enquiryUrl = buildWhatsAppOrderUrl([], 0, lang)

  return (
    <div className="page-shell">
      <Hero />

      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <h2>{t('home.categoriesTitle')}</h2>
            <Link to="/categories" className="see-all">{t('cta.viewAll')}</Link>
          </div>
          {categoriesLoading ? (
            <p>Loading…</p>
          ) : (
            <div className="cat-rail">
              {categories.slice(0, 12).map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section tinted">
        <div className="container">
          <div className="section-head">
            <h2>{t('home.featuredTitle')}</h2>
            <Link to="/products" className="see-all">{t('cta.viewAll')}</Link>
          </div>
          {productsLoading ? (
            <p>Loading…</p>
          ) : (
            <div className="product-grid">
              {featuredToShow.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 24 }}>
            <h2>{t('home.whyTitle')}</h2>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="num">1</div>
              <h3>{t('home.why1t')}</h3>
              <p>{t('home.why1d')}</p>
            </div>
            <div className="why-card">
              <div className="num">2</div>
              <h3>{t('home.why2t')}</h3>
              <p>{t('home.why2d')}</p>
            </div>
            <div className="why-card">
              <div className="num">3</div>
              <h3>{t('home.why3t')}</h3>
              <p>{t('home.why3d')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-strip">
            <div>
              <h3>{t('cta.whatsapp')}</h3>
              <p>{t('home.heroSub')}</p>
            </div>
            <a href={enquiryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              {t('cta.whatsapp')}
            </a>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {BRAND_LOGOS.map((brand, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--sand-dim)',
                  borderRadius: 12,
                  padding: 12,
                  width: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}