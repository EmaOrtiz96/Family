import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { useCart, useAuth } from '../context'
import { useToast } from '../hooks/useToast.jsx'
import ProductCard from '../components/ProductCard'
import s from './Home.module.css'

const CATS = [
  {slug:'stickers',icon:'🎨',label:'Stickers',sub:'Vinilo, holo, transparente'},
  {slug:'impresion-3d',icon:'🖨️',label:'Impresión 3D',sub:'Objetos y piezas'},
  {slug:'corte-laser',icon:'✂️',label:'Corte Láser',sub:'Madera, acrílico y más'},
  {slug:'grabado-laser',icon:'🔥',label:'Grabado Láser',sub:'Madera, cuero, vidrio'},
  {slug:'sublimacion',icon:'👕',label:'Sublimación',sub:'Tazas, remeras y más'},
  {slug:'fotocopias',icon:'📄',label:'Fotocopias',sub:'Impresiones rápidas'},
]
const ORDERS = [{v:'nuevo',l:'Más nuevos'},{v:'precio_asc',l:'Precio ↑'},{v:'precio_desc',l:'Precio ↓'},{v:'nombre',l:'A-Z'}]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const [orden, setOrden] = useState('nuevo')
  const [modal, setModal] = useState(null)
  const [selectedProd, setSelectedProd] = useState(null)
  const [favIds, setFavIds] = useState([])
  const [resena, setResena] = useState({calificacion:5,comentario:''})
  const [contacto, setContacto] = useState({nombre:'',email:'',telefono:'',mensaje:''})
  const [contactMsg, setContactMsg] = useState(null)
  const [nlEmail, setNlEmail] = useState('')
  const {user} = useAuth()
  const {dispatch} = useCart()
  const {toast, ToastEl} = useToast()
  const buscar = searchParams.get('buscar')||''

  useEffect(()=>{loadProductos()},[filter,orden,page,buscar])
  useEffect(()=>{ if(user) api.getFavoritosIds().then(setFavIds).catch(()=>{}) },[user])

  async function loadProductos() {
    const params = {page,limit:12,orden}
    if(filter!=='all') params.categoria=filter
    if(buscar) params.buscar=buscar
    const r = await api.getProductos(params).catch(()=>({items:[],total:0,pages:1}))
    setProductos(r.items||[]); setTotal(r.total||0); setPages(r.pages||1)
  }

  async function openModal(p) {
    const full = await api.getProducto(p.id).catch(()=>p)
    setSelectedProd(full); setModal('product')
  }

  async function submitResena(e) {
    e.preventDefault()
    await api.crearResena(selectedProd.id,resena).catch(e=>{toast(e.message);return null})
    toast('¡Reseña enviada!')
    const fresh = await api.getProducto(selectedProd.id)
    setSelectedProd(fresh); setResena({calificacion:5,comentario:''})
  }

  async function sendContacto(e) {
    e.preventDefault()
    try{ await api.sendContacto(contacto); setContactMsg({ok:true,text:'¡Mensaje enviado! Te respondemos pronto.'}); setContacto({nombre:'',email:'',telefono:'',mensaje:''}) }
    catch(err){ setContactMsg({ok:false,text:err.message}) }
  }

  async function suscribir(e) {
    e.preventDefault()
    await api.suscribir(nlEmail).catch(()=>{}); toast('¡Gracias por suscribirte!'); setNlEmail('')
  }

  const FILTERS = [{v:'all',l:'Todos'},...CATS.map(c=>({v:c.slug,l:c.label}))]

  return (
    <>
      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroContent}>
          <span className="section-eyebrow">✨ Creamos lo que imaginás</span>
          <h1 className={s.heroTitle}>Tu idea,<br/><em>hecha realidad</em></h1>
          <p className={s.heroDesc}>Stickers, impresión 3D, corte láser, grabado y mucho más. Calidad premium, entrega rápida.</p>
          <div className={s.heroBtns}>
            <a href="#productos" className="btn-primary">Ver Productos</a>
            <a href="#como-funciona" className="btn-outline">¿Cómo funciona?</a>
          </div>
          <div className={s.heroStats}>
            {[['500+','Clientes felices'],['1000+','Productos hechos'],['48hs','Entrega express']].map(([n,l])=>(
              <div key={l} className={s.stat}><span className={s.statN}>{n}</span><span className={s.statL}>{l}</span></div>
            ))}
          </div>
        </div>
        <div className={s.heroVisual}>
          <div className={s.heroImgWrap}>
            <img src="/logo.png" alt="FamilyPrint" className={s.heroLogo}
              onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
            <div className={s.heroLogoFb} style={{display:'none'}}>
              <span>FP</span>
            </div>
          </div>
          <div className={s.floatingCards}>
            {CATS.slice(0,4).map(c=>(
              <div key={c.slug} className={s.floatCard}><span>{c.icon}</span><span>{c.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={s.marquee}>
        <div className={s.track}>
          {[...Array(2)].flatMap(()=>['Stickers Personalizados','Impresión 3D','Corte Láser','Grabado Láser','Sublimación','Fotocopias','Envío Rápido','Alta Calidad'].map((t,i)=>(
            <span key={t+i} className={s.mi}>{t} <span className={s.dot}>●</span></span>
          )))}
        </div>
      </div>

      {/* CATEGORÍAS */}
      <section id="categorias" className={s.catsSec}>
        <div className={s.secHead}>
          <span className="section-eyebrow">Nuestros Servicios</span>
          <h2 className="section-title">¿Qué podemos <em>hacer para vos</em>?</h2>
          <div className="section-line"/>
        </div>
        <div className={s.catsGrid}>
          {CATS.map((c,i)=>(
            <div key={c.slug} className={s.catCard} style={{'--clr':['var(--pink)','var(--cyan)','var(--yellow)','var(--green)','var(--purple)','var(--orange)'][i]}}
              onClick={()=>{setFilter(c.slug);setPage(1);setSearchParams({});document.getElementById('productos').scrollIntoView({behavior:'smooth'})}}>
              <span className={s.catIcon}>{c.icon}</span>
              <div className={s.catName}>{c.label}</div>
              <div className={s.catSub}>{c.sub}</div>
              <div className={s.catArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className={s.howSec}>
        <div className={s.secHead}>
          <span className="section-eyebrow">Simple y Rápido</span>
          <h2 className="section-title">¿Cómo <em>funciona</em>?</h2>
          <div className="section-line"/>
        </div>
        <div className={s.howGrid}>
          {[
            {n:'1',icon:'🛒',t:'Elegís tu producto',d:'Explorá nuestro catálogo y seleccioná lo que necesitás.'},
            {n:'2',icon:'✏️',t:'Nos enviás tu diseño',d:'Mandanos tu archivo o lo creamos nosotros. Te asesoramos.'},
            {n:'3',icon:'⚡',t:'Producimos con calidad',d:'Usamos equipos de última generación para el mejor resultado.'},
            {n:'4',icon:'🚀',t:'Te lo entregamos',d:'Entrega a domicilio o retiro en local. Rápido y seguro.'},
          ].map(s=>(
            <div key={s.n} className={s.howCard}>
              <div className={s.howNum}>{s.n}</div>
              <div className={s.howIcon}>{s.icon}</div>
              <h3 className={s.howTitle}>{s.t}</h3>
              <p className={s.howDesc}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" className={s.prodSec}>
        <div className={s.secHead}>
          <span className="section-eyebrow">Catálogo{buscar&&` — "${buscar}"`}</span>
          <h2 className="section-title">Nuestros <em>productos</em></h2>
          <div className="section-line"/>
        </div>
        <div className={s.prodControls}>
          <div className={s.filterTabs}>
            {FILTERS.map(f=>(
              <button key={f.v} className={`${s.ftab} ${filter===f.v?s.active:''}`}
                onClick={()=>{setFilter(f.v);setPage(1);setSearchParams({})}}>{f.l}</button>
            ))}
          </div>
          <select className={s.orderSel} value={orden} onChange={e=>{setOrden(e.target.value);setPage(1)}}>
            {ORDERS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        {buscar&&<p className={s.searchInfo}>{total} resultado{total!==1?'s':''} para "{buscar}" <button className={s.clearSearch} onClick={()=>{setSearchParams({});setFilter('all')}}>✕</button></p>}
        <div className={s.prodGrid}>
          {productos.length===0
            ? <div className={s.noProd}>No hay productos{buscar?` para "${buscar}"`:' en esta categoría'} 😔</div>
            : productos.map(p=><ProductCard key={p.id} product={p} onOpen={openModal} favIds={favIds} onFavToggle={()=>api.getFavoritosIds().then(setFavIds)}/>)
          }
        </div>
        {pages>1&&<div className={s.pagination}>{Array.from({length:pages},(_,i)=><button key={i} className={`${s.pgBtn} ${page===i+1?s.pgActive:''}`} onClick={()=>setPage(i+1)}>{i+1}</button>)}</div>}
      </section>

      {/* TESTIMONIOS */}
      <section className={s.testiSec}>
        <div className={s.secHead}>
          <span className="section-eyebrow">Lo que dicen</span>
          <h2 className="section-title">Clientes que nos <em>eligen</em></h2>
          <div className="section-line"/>
        </div>
        <div className={s.testiGrid}>
          {[
            {n:'Laura M.',t:'Los stickers quedaron increíbles, súper resistentes y con colores vibrantes. Los recomiendo!',s:5},
            {n:'Carlos R.',t:'Mandé a hacer una figura 3D personalizada y superó todas mis expectativas. Calidad top.',s:5},
            {n:'Sofía G.',t:'El grabado láser en madera quedó perfecto para el regalo. Muy prolijo y rápido.',s:5},
          ].map(t=>(
            <div key={t.n} className={s.tCard}>
              <div className={s.tStars}>{'★'.repeat(t.s)}</div>
              <p className={s.tTxt}>"{t.t}"</p>
              <div className={s.tName}>— {t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className={s.contSec}>
        <div className={s.secHead}>
          <span className="section-eyebrow">Hablemos</span>
          <h2 className="section-title">¿Tenés un <em>proyecto</em>?</h2>
          <div className="section-line"/>
        </div>
        <div className={s.contGrid}>
          <div>
            <h3 className={s.contTitle}>Contactanos y te ayudamos 😊</h3>
            <p className={s.contDesc}>Consultanos por presupuesto, archivos, tiempos o cualquier duda.</p>
            {[['📍','Mendoza, Argentina'],['📧','hola@familyprint.com'],['📱','Consultá por WhatsApp'],['🕐','Lun–Sáb, 9am–6pm']].map(([i,t])=>(
              <div key={t} className={s.contDetail}><span>{i}</span><span>{t}</span></div>
            ))}
          </div>
          <form onSubmit={sendContacto} className={s.contForm}>
            <div className={s.formRow}>
              <div className="form-group"><label>Nombre *</label><input required value={contacto.nombre} onChange={e=>setContacto(p=>({...p,nombre:e.target.value}))}/></div>
              <div className="form-group"><label>Email *</label><input type="email" required value={contacto.email} onChange={e=>setContacto(p=>({...p,email:e.target.value}))}/></div>
            </div>
            <div className="form-group"><label>Teléfono</label><input value={contacto.telefono} onChange={e=>setContacto(p=>({...p,telefono:e.target.value}))}/></div>
            <div className="form-group"><label>Mensaje *</label><textarea required value={contacto.mensaje} onChange={e=>setContacto(p=>({...p,mensaje:e.target.value}))} placeholder="Contanos tu proyecto..."/></div>
            <button type="submit" className="btn-primary" style={{width:'100%'}}>Enviar Mensaje 🚀</button>
            {contactMsg&&<div className={contactMsg.ok?'msg-success':'msg-error'}>{contactMsg.text}</div>}
          </form>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className={s.nl}>
        <h2>¿Querés enterarte de ofertas y novedades?</h2>
        <p>Suscribite y recibí descuentos exclusivos</p>
        <form onSubmit={suscribir} className={s.nlForm}>
          <input type="email" placeholder="tu@email.com" value={nlEmail} onChange={e=>setNlEmail(e.target.value)} required/>
          <button type="submit">Suscribirme 🎉</button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={s.fGrid}>
          <div>
            <div className={s.fBrand}>FamilyPrint</div>
            <p className={s.fDesc}>Stickers, impresión 3D, corte láser, grabado y más. Calidad premium en cada trabajo.</p>
          </div>
          {[{t:'Servicios',l:['Stickers','Impresión 3D','Corte Láser','Grabado','Sublimación']},{t:'Info',l:['Contacto','¿Cómo funciona?','Envíos','Devoluciones']}].map(c=>(
            <div key={c.t}><h4 className={s.fColT}>{c.t}</h4>{c.l.map(l=><a key={l} href="#" className={s.fLink}>{l}</a>)}</div>
          ))}
          <div><h4 className={s.fColT}>Contacto</h4><p className={s.fLink}>hola@familyprint.com</p><p className={s.fLink}>Mendoza, Argentina</p></div>
        </div>
        <div className={s.fBottom}><span>© 2025 FamilyPrint.</span><span>Hecho con ❤️ en Mendoza</span></div>
      </footer>

      {/* MODAL PRODUCTO */}
      {modal==='product'&&selectedProd&&(
        <div className={s.modalOverlay} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className={s.modalBox}>
            <button className={s.modalClose} onClick={()=>setModal(null)}>✕</button>
            <div className={s.modalGrid}>
              <div className={s.modalImg}>
                {selectedProd.imagen
                  ? <img src={'/api'+selectedProd.imagen} alt={selectedProd.nombre} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : <span style={{fontSize:'6rem'}}>🎨</span>}
              </div>
              <div className={s.modalInfo}>
                <div className={s.mCat}>{selectedProd.categoria_nombre}</div>
                <h2 className={s.mName}>{selectedProd.nombre}</h2>
                <div className={s.mPrice}>
                  {selectedProd.precio_oferta&&<span className={s.mOld}>${parseFloat(selectedProd.precio).toFixed(2)}</span>}
                  ${parseFloat(selectedProd.precio_oferta??selectedProd.precio).toFixed(2)}
                </div>
                {selectedProd.material&&<div className={s.mDetail}><strong>Material:</strong> {selectedProd.material}</div>}
                {selectedProd.medidas&&<div className={s.mDetail}><strong>Medidas:</strong> {selectedProd.medidas}</div>}
                {selectedProd.tiempo_produccion&&<div className={s.mDetail}><strong>⏱ Producción:</strong> {selectedProd.tiempo_produccion}</div>}
                <p className={s.mDesc}>{selectedProd.descripcion}</p>
                <button className="btn-primary" style={{width:'100%',marginTop:'.5rem'}} onClick={()=>{dispatch({type:'ADD',item:selectedProd});toast('¡Agregado al carrito!');setModal(null)}}>
                  🛒 Agregar al Carrito
                </button>
                <div className={s.resenas}>
                  <h4 className={s.resenasTitle}>Reseñas ({selectedProd.total_resenas||0})</h4>
                  {user&&(
                    <form onSubmit={submitResena} className={s.resenaForm}>
                      <div style={{display:'flex',gap:'.2rem',marginBottom:'.5rem'}}>
                        {[1,2,3,4,5].map(n=>(
                          <button type="button" key={n} onClick={()=>setResena(r=>({...r,calificacion:n}))}
                            style={{background:'none',border:'none',fontSize:'1.3rem',color:n<=resena.calificacion?'var(--yellow)':'#e5e7eb'}}>★</button>
                        ))}
                      </div>
                      <textarea placeholder="Tu opinión (opcional)" value={resena.comentario} onChange={e=>setResena(r=>({...r,comentario:e.target.value}))} style={{width:'100%',padding:'.5rem',border:'2px solid var(--border)',fontSize:'.82rem',resize:'none',height:'65px',fontFamily:'var(--font-b)',borderRadius:'8px'}}/>
                      <button type="submit" className="btn-outline" style={{fontSize:'.7rem',padding:'.4rem 1rem',marginTop:'.4rem',borderRadius:'8px'}}>Enviar Reseña</button>
                    </form>
                  )}
                  {(selectedProd.resenas||[]).slice(0,3).map(r=>(
                    <div key={r.id} style={{padding:'.6rem 0',borderBottom:'1px solid var(--border)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.2rem'}}>
                        <span style={{fontSize:'.78rem',fontWeight:700}}>{r.usuario_nombre}</span>
                        <span style={{color:'var(--yellow)',fontSize:'.75rem'}}>{'★'.repeat(r.calificacion)}</span>
                      </div>
                      {r.comentario&&<p style={{fontSize:'.78rem',color:'var(--gray)'}}>{r.comentario}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastEl/>
    </>
  )
}
