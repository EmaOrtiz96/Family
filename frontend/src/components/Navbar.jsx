import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../context'
import CartSidebar from './CartSidebar'
import s from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const { count } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef()
  const searchRef = useRef()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const h = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (!searchQ.trim()) return
    navigate(`/?buscar=${encodeURIComponent(searchQ.trim())}`)
    setSearchOpen(false); setSearchQ('')
  }

  return (
    <>
      <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
        <Link to="/" className={s.logo}>
          <img src="/logo.png" alt="FamilyPrint"
            onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
          <span className={s.logoFallback} style={{display:'none'}}>FP</span>
          <span className={s.logoText}>
            <span className={s.logoName}>FamilyPrint</span>
            <span className={s.logoSub}>Fotocopias e Impresiones</span>
          </span>
        </Link>

        <ul className={s.links}>
          {[['/#categorias','Servicios'],['/#productos','Productos'],['/#como-funciona','¿Cómo funciona?'],['/#contacto','Contacto']].map(([h,l])=>(
            <li key={h}><a href={h}>{l}</a></li>
          ))}
          {isAdmin && <li><Link to="/admin" style={{color:'var(--pink)',fontWeight:700}}>⚙️ Admin</Link></li>}
        </ul>

        <div className={s.actions}>
          <div className={s.searchWrap} ref={searchRef}>
            <button className={s.iconBtn} onClick={()=>setSearchOpen(o=>!o)}>🔍</button>
            {searchOpen && (
              <form className={s.searchBox} onSubmit={handleSearch}>
                <input autoFocus placeholder="Buscar productos..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
                <button type="submit">→</button>
              </form>
            )}
          </div>

          {user && <Link to="/favoritos" className={s.iconBtn} title="Favoritos">♡</Link>}

          <button className={s.cartBtn} onClick={()=>setCartOpen(true)}>
            🛒 {count > 0 && <span className={s.badge}>{count}</span>}
          </button>

          {user ? (
            <div className={s.userMenu} ref={menuRef}>
              <button className={s.userBtn} onClick={()=>setMenuOpen(o=>!o)}>
                {user.avatar
                  ? <img src={user.avatar} alt="" className={s.avatar}/>
                  : <span className={s.initial}>{user.nombre[0].toUpperCase()}</span>}
                <span className={s.uname}>{user.nombre.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className={s.dropdown}>
                  <div className={s.dropHead}>
                    <div className={s.dropName}>{user.nombre}</div>
                    <div className={s.dropEmail}>{user.email}</div>
                    {isAdmin && <span className={s.adminTag}>Admin</span>}
                  </div>
                  <Link to="/mis-pedidos" className={s.dropItem} onClick={()=>setMenuOpen(false)}>📦 Mis Pedidos</Link>
                  <Link to="/favoritos" className={s.dropItem} onClick={()=>setMenuOpen(false)}>♡ Favoritos</Link>
                  {isAdmin && <Link to="/admin" className={s.dropItem} onClick={()=>setMenuOpen(false)}>⚙️ Panel Admin</Link>}
                  <button className={s.dropItem} onClick={()=>{logout();setMenuOpen(false);navigate('/')}}>→ Cerrar Sesión</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={s.loginBtn}>Ingresar</Link>
          )}
        </div>
      </nav>
      <CartSidebar open={cartOpen} onClose={()=>setCartOpen(false)}/>
    </>
  )
}
