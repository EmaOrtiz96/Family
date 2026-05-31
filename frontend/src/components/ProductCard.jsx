import { useState } from 'react'
import { useCart, useAuth } from '../context'
import { api } from '../api'
import s from './ProductCard.module.css'

const emo = n => {
  const l = (n||'').toLowerCase()
  if(l.includes('sticker')) return '🎨'
  if(l.includes('3d')||l.includes('llavero')||l.includes('figura')) return '🖨️'
  if(l.includes('corte')) return '✂️'
  if(l.includes('grabado')) return '🔥'
  if(l.includes('taza')) return '☕'
  if(l.includes('remera')) return '👕'
  if(l.includes('sublim')) return '🎁'
  if(l.includes('fotocopia')||l.includes('impresion')) return '📄'
  return '✨'
}

function Stars({v}) {
  return <span>{[1,2,3,4,5].map(i=><span key={i} className={i<=Math.round(v)?'stars':'star-empty'}>★</span>)}</span>
}

export default function ProductCard({product, onOpen, favIds=[], onFavToggle}) {
  const {dispatch} = useCart()
  const {user} = useAuth()
  const [added, setAdded] = useState(false)
  const [isFav, setIsFav] = useState(favIds.includes(product.id))
  const price = product.precio_oferta ?? product.precio

  function handleAdd(e) {
    e.stopPropagation()
    dispatch({type:'ADD', item:product})
    setAdded(true); setTimeout(()=>setAdded(false),1500)
  }

  async function handleFav(e) {
    e.stopPropagation()
    if(!user){alert('Inicia sesión para guardar favoritos');return}
    const r = await api.toggleFavorito(product.id).catch(()=>null)
    if(r){setIsFav(r.favorito);onFavToggle?.()}
  }

  return (
    <div className={s.card} onClick={()=>onOpen(product)}>
      {product.precio_oferta && <span className={s.badgeOferta}>🔥 Oferta</span>}
      {product.destacado===1 && !product.precio_oferta && <span className={s.badgeDest}>⭐ Destacado</span>}

      <div className={s.imgWrap}>
        {product.imagen
          ? <img src={'/api'+product.imagen} alt={product.nombre} className={s.prodImg}/>
          : <span className={s.emoji}>{emo(product.nombre)}</span>}
        <div className={s.overlay}>
          <button className={s.addOverlay} onClick={handleAdd}>
            {added ? '✓ Agregado' : '+ Al carrito'}
          </button>
        </div>
        <button className={`${s.favBtn} ${isFav?s.favActive:''}`} onClick={handleFav}>
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      <div className={s.info}>
        <div className={s.cat}>{product.categoria_nombre}</div>
        <div className={s.name}>{product.nombre}</div>
        {product.calificacion_promedio>0 && (
          <div className={s.rating}>
            <Stars v={product.calificacion_promedio}/>
            <span className={s.ratingN}>({product.total_resenas})</span>
          </div>
        )}
        {product.tiempo_produccion && <div className={s.tiempo}>⏱ {product.tiempo_produccion}</div>}
        <div className={s.footer}>
          <div className={s.price}>
            {product.precio_oferta && <span className={s.old}>${parseFloat(product.precio).toFixed(2)}</span>}
            <span>${parseFloat(price).toFixed(2)}</span>
          </div>
          <button className={s.addBtn} onClick={handleAdd}>{added?'✓':'+'}</button>
        </div>
      </div>
    </div>
  )
}
