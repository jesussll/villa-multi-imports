import { useMemo, useState } from 'react'
import './App.css'

const categories = [
  {
    title: 'Hogar',
    text: 'Artículos prácticos y decorativos para tu casa.',
  },
  {
    title: 'Belleza y cuidado personal',
    text: 'Productos seleccionados para tu rutina diaria.',
  },
  {
    title: 'Tecnología y accesorios',
    text: 'Accesorios útiles y gadgets para todos los días.',
  },
  {
    title: 'Regalos y novedades',
    text: 'Opciones especiales para regalar o sorprender.',
  },
]

const products = [
  {
    id: 1,
    name: 'Set de hogar premium',
    category: 'Hogar',
    price: 18,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Kit beauty essentials',
    category: 'Belleza',
    price: 22,
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Auriculares inalámbricos',
    category: 'Tecnología',
    price: 35,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Box regalo especial',
    category: 'Regalos',
    price: 27,
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80',
  },
]

function formatPrice(value) {
  return `$${value}`
}

export default function App() {
  const [cart, setCart] = useState([])

  const phoneNumber = '584247534282'

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const whatsappCatalogLink = useMemo(() => {
    const message = encodeURIComponent(
      'Hola Ana Villa, quiero consultar por productos y encargos de Villa Multi-Imports.'
    )
    return `https://wa.me/${phoneNumber}?text=${message}`
  }, [])

  const whatsappCartLink = useMemo(() => {
    if (cart.length === 0) {
      const message = encodeURIComponent(
        'Hola Ana Villa, quiero consultar por productos de Villa Multi-Imports.'
      )
      return `https://wa.me/${phoneNumber}?text=${message}`
    }

    const itemsText = cart
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = $${item.price * item.quantity}`
      )
      .join('\n')

    const message = encodeURIComponent(
      `Hola Ana Villa, quiero hacer este pedido:\n\n${itemsText}\n\nTotal: $${totalPrice}`
    )

    return `https://wa.me/${phoneNumber}?text=${message}`
  }, [cart, totalPrice])

  return (
    <div className="page">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <img src="/logo-villa.jpg" alt="Villa Multi-Imports" className="brand-logo" />
            <div>
              <p className="brand-kicker">Villa Multi-Imports</p>
              <h1 className="brand-title">Variedad sin límites</h1>
            </div>
          </div>

          <nav className="nav">
            <a href="#categorias">Categorías</a>
            <a href="#productos">Productos</a>
            <a href="#servicios">Servicios</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge">Productos + encargos desde afuera</span>

            <h2 className="hero-title">
              Tu tienda de confianza en <span>El Vigía</span>
            </h2>

            <p className="hero-text">
              Ana Villa ofrece productos de diversas categorías y también brinda
              el servicio de compra por encargo desde afuera si no tiene el
              producto disponible.
            </p>

            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href={whatsappCatalogLink}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>

              <a className="btn btn-secondary" href="#productos">
                Ver productos
              </a>
            </div>

            <div className="hero-cards">
              <div className="info-card">
                <h3>Catálogo variado</h3>
                <p>Distintas categorías para encontrar de todo en un solo lugar.</p>
              </div>
              <div className="info-card">
                <h3>Encargos personalizados</h3>
                <p>Si no está disponible, se puede pedir desde afuera.</p>
              </div>
              <div className="info-card">
                <h3>Atención directa</h3>
                <p>Comunicación rápida y simple por WhatsApp.</p>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <img
              src="/logo-villa.jpg"
              alt="Logo Villa Multi-Imports"
              className="hero-logo"
            />

            <div className="contact-box">
              <p><strong>WhatsApp:</strong> +58 424-7534282</p>
              <p><strong>Ubicación:</strong> El Vigía, Edo. Mérida, La Carabobo</p>
              <p><strong>Modalidad:</strong> Ventas directas y encargos especiales</p>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="section">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Categorías</p>
            <h2>Productos para distintos gustos y necesidades</h2>
          </div>

          <div className="category-grid">
            {categories.map((item) => (
              <article key={item.title} className="category-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" className="section section-dark">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Productos</p>
            <h2>Algunos productos destacados</h2>
          </div>

          <div className="products-layout">
            <div className="products-grid">
              {products.map((product) => (
                <article key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-body">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <button
                      className="btn btn-primary full"
                      onClick={() => addToCart(product)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart">
              <div className="cart-head">
                <h3>Carrito</h3>
                <span>{totalItems} item(s)</span>
              </div>

              {cart.length === 0 ? (
                <p className="cart-empty">Todavía no agregaste productos.</p>
              ) : (
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{formatPrice(item.price)} c/u</p>
                      </div>

                      <div className="cart-actions">
                        <div className="qty-box">
                          <button onClick={() => decreaseQty(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increaseQty(item.id)}>+</button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="cart-footer">
                <p className="cart-total">
                  <strong>Total:</strong> {formatPrice(totalPrice)}
                </p>

                <a
                  className={`btn btn-primary full ${cart.length === 0 ? 'disabled' : ''}`}
                  href={whatsappCartLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (cart.length === 0) e.preventDefault()
                  }}
                >
                  Finalizar pedido por WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="servicios" className="section">
        <div className="container">
          <div className="services-grid">
            <div className="service-main">
              <p className="section-kicker">Servicios</p>
              <h2>Más que una tienda</h2>
              <p>
                Villa Multi-Imports también ayuda a conseguir productos por
                encargo cuando no están disponibles en stock local.
              </p>
            </div>

            <div className="service-card">
              <h3>Compra desde afuera</h3>
              <p>
                Si buscás un producto específico y no está disponible, se puede
                gestionar la compra externa según disponibilidad.
              </p>
            </div>

            <div className="service-card">
              <h3>Atención personalizada</h3>
              <p>
                Podés consultar precios, disponibilidad, encargos y tiempos de
                entrega directamente por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="section section-dark">
        <div className="container">
          <div className="contact-panel">
            <div>
              <p className="section-kicker">Contacto</p>
              <h2>Consultá por productos o encargos especiales</h2>
              <p>
                Si querés pedir algo puntual o consultar por compras desde
                afuera, escribí directamente y coordiná tu pedido.
              </p>
            </div>

            <div className="contact-side">
              <a
                className="btn btn-primary full"
                href={whatsappCatalogLink}
                target="_blank"
                rel="noreferrer"
              >
                Escribir por WhatsApp
              </a>

              <div className="contact-data">
                <p><strong>Teléfono:</strong> +58 424-7534282</p>
                <p><strong>Ubicación:</strong> El Vigía, Edo. Mérida, La Carabobo</p>
                <p><strong>Horario:</strong> A definir</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} Villa Multi-Imports · Diseñado para mostrar
          productos, atención directa y encargos especiales.
        </div>
      </footer>
    </div>
  )
}