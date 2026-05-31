CREATE DATABASE IF NOT EXISTS familyprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE familyprint;

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50),
    orden INT DEFAULT 0,
    activo TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT,
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    descripcion_corta VARCHAR(300),
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2) DEFAULT NULL,
    stock INT DEFAULT 0,
    imagen VARCHAR(255),
    material VARCHAR(100),
    medidas VARCHAR(100),
    tiempo_produccion VARCHAR(100),
    destacado TINYINT(1) DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) DEFAULT NULL,
    google_id VARCHAR(100) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    rol ENUM('cliente','admin') DEFAULT 'cliente',
    reset_token VARCHAR(100) DEFAULT NULL,
    reset_expiry DATETIME DEFAULT NULL,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (usuario_id, producto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    calificacion TINYINT NOT NULL,
    comentario TEXT,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (usuario_id, producto_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT DEFAULT NULL,
    nombre_cliente VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    codigo_postal VARCHAR(20),
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente','pagado','preparando','enviado','entregado','cancelado') DEFAULT 'pendiente',
    mp_preference_id VARCHAR(255) DEFAULT NULL,
    mp_payment_id VARCHAR(255) DEFAULT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    nombre_producto VARCHAR(200),
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT NOT NULL,
    leido TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suscriptores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO categorias (nombre,slug,descripcion,icono,orden) VALUES
('Stickers','stickers','Stickers en vinilo, holográfico y más','🎨',1),
('Impresión 3D','impresion-3d','Objetos y piezas en 3D','🖨️',2),
('Corte Láser','corte-laser','Corte de precisión en múltiples materiales','✂️',3),
('Grabado Láser','grabado-laser','Grabado en madera, cuero, vidrio y más','🔥',4),
('Sublimación','sublimacion','Tazas, remeras, almohadas y más','👕',5),
('Fotocopias e Impresiones','fotocopias','Fotocopias y trabajos de impresión','📄',6);

INSERT IGNORE INTO productos (categoria_id,nombre,slug,descripcion_corta,descripcion,precio,precio_oferta,stock,material,medidas,tiempo_produccion,destacado) VALUES
(1,'Pack Stickers Vinilo x10','pack-stickers-vinilo','10 stickers personalizados en vinilo','Stickers de alta calidad en vinilo resistente al agua y UV. Perfectos para notebooks, autos, motos y más.',800.00,650.00,100,'Vinilo resistente','5x5cm aprox','2-3 días hábiles',1),
(1,'Sticker Holográfico','sticker-holografico','Efecto holográfico premium','Stickers con efecto holográfico único. Se ven diferentes según el ángulo de la luz.',150.00,NULL,80,'Vinilo holográfico','Hasta 10x10cm','3-4 días hábiles',1),
(1,'Sticker Transparente','sticker-transparente','Fondo transparente profesional','Sticker con fondo transparente, ideal para vidrios y superficies lisas.',120.00,NULL,90,'Vinilo transparente','Hasta 10x10cm','2-3 días hábiles',0),
(2,'Llavero 3D Personalizado','llavero-3d','Llavero impreso en 3D a tu diseño','Llavero totalmente personalizable. Podés elegir forma, color y texto.',600.00,NULL,50,'PLA/PETG','Hasta 6cm','3-5 días hábiles',1),
(2,'Figura Decorativa 3D','figura-3d','Figuras impresas en 3D','Figuras decorativas personalizadas. Ideal para regalos únicos y originales.',1500.00,1200.00,30,'PLA colores','Variable','5-7 días hábiles',1),
(3,'Corte Láser Madera','corte-laser-madera','Corte de precisión en madera','Corte láser en MDF, terciado y maderas naturales. Ideal para artesanías y decoración.',900.00,NULL,40,'MDF / Madera','Hasta 40x60cm','3-5 días hábiles',1),
(3,'Corte Láser Acrílico','corte-laser-acrilico','Corte en acrílico de colores','Corte preciso en acrílico de múltiples colores y espesores.',1200.00,NULL,35,'Acrílico','Hasta 40x60cm','3-5 días hábiles',0),
(4,'Grabado en Madera','grabado-madera','Grabado personalizado en madera','Grabado láser en tablas, cortes y piezas de madera. Ideal para regalos personalizados.',700.00,550.00,60,'Madera natural','Variable','2-4 días hábiles',1),
(4,'Grabado en Cuero','grabado-cuero','Grabado fino en cuero genuino','Grabado de alta precisión en cuero. Billeteras, cinturones, accesorios.',850.00,NULL,40,'Cuero genuino','Variable','3-5 días hábiles',1),
(5,'Taza Sublimada','taza-sublimada','Taza personalizada con tu foto o diseño','Taza de cerámica sublimada con foto, frase o diseño a elección. Apta lavavajillas.',900.00,750.00,70,'Cerámica','Estándar 325ml','2-3 días hábiles',1),
(5,'Remera Sublimada','remera-sublimada','Remera con diseño full color','Remera 100% poliéster con sublimación full color. Colores vibrantes que no se borran.',1800.00,NULL,50,'Poliéster 100%','S al XL','3-5 días hábiles',0),
(6,'Fotocopias A4','fotocopias-a4','Fotocopias en blanco y negro','Fotocopias de alta calidad en papel A4 80g. Precio por hoja.',15.00,NULL,999,'Papel A4 80g','A4','Inmediato',0);

INSERT IGNORE INTO usuarios (nombre,email,password_hash,rol) VALUES
('Administrador','admin@familyprint.com','$2b$12$0/5Pa0jF3hd6.gyaQ8kTA.uSJiGpX7dl3.mk4FV/eAvmpQcjeKZFa','admin');
