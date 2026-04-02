import { useEffect, useMemo, useState } from 'react'
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

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-dnax_ak9agd2A0B8AjnNbMaavX5_ulPdptAnAIolNXUjgWcY6LlkXFHVQRX7yj8gmeEgzrpQLKcP/pub?gid=1238923771&single=true&output=csv'

function formatPrice(value) {
  return `$${value}`
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function parseCSV(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    const row = {}

    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : ''
    })

    return {
      id: Number(row.id),
      name: row.nombre,
      category: row.categoria,
      price: Number(row.precio),
      image: row.imagen,
      description: row.descripcion,
      stockInitial: Number(row.stock_inicial || 0),
      sold: Number(row.vendido || 0),
      stock: Number(row.stock_actual || 0),
      status: row.estado,
    }
  })
}

export default function App() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [cart, setCart] = useState([])

  const phoneNumber = '584247534282'

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true)
        setProductsError('')

        const response = await fetch(CSV_URL)
        const csvText = await response.text()
        const parsedProducts = parseCSV(csvText)

        const cleanedProducts = parsedProducts.filter(
          (product) => product.id && product.name
        )

        setProducts(cleanedProducts)
      } catch (error) {
        console.error(error)
        setProductsError('No se pudieron cargar los productos.')
      } finally {
        setLoadingProducts(false)
      }
    }

    loadProducts()
  }, [])

  const addToCart = (product) => {
    if (product.stock <= 0 || product.status === 'Producto no disponible') {
      return
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing) {
        if (existing.quantity >= product.stock) return prev

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
      prev.map((item) => {
        const originalProduct = products.find((p) => p.id === id)
        if (!originalProduct) return item

        if (item.quantity >= originalProduct.stock) return item

        return item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      })
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
            <img
              src="/logo-villa.jpg"
              alt="Villa Multi-Imports"
              className="brand-logo"
            />
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
            <h2>Catálogo conectado a Google Sheets</h2>
          </div>

          {loadingProducts && (
            <p className="cart-empty">Cargando productos...</p>
          )}

          {productsError && (
            <p className="cart-empty">{productsError}</p>
          )}

          {!loadingProducts && !productsError && (
            <div className="products-layout">
              <div className="products-grid">
                {products.map((product) => {
                  const unavailable =
                    product.stock <= 0 ||
                    product.status === 'Producto no disponible'

                  return (
                    <article key={product.id} className="product-card">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />

                      <div className="product-body">
                        <span className="product-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p className="product-price">{formatPrice(product.price)}</p>

                        <p
                          className={
                            unavailable ? 'stock-label no-stock' : 'stock-label'
                          }
                        >
                          {unavailable
                            ? 'Producto no disponible'
                            : `Stock disponible: ${product.stock}`}
                        </p>

                        <button
                          className={`btn full ${
                            unavailable ? 'btn-disabled' : 'btn-primary'
                          }`}
                          onClick={() => addToCart(product)}
                          disabled={unavailable}
                        >
                          {unavailable ? 'No disponible' : 'Agregar al carrito'}
                        </button>
                      </div>
                    </article>
                  )
                })}
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
                    className={`btn btn-primary full ${
                      cart.length === 0 ? 'disabled' : ''
                    }`}
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
          )}
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
          © {new Date().getFullYear()} Villa Multi-Imports · Catálogo conectado a Google Sheets.
        </div>
      </footer>
    </div>
  )
}