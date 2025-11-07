CREATE SCHEMA practica08;

USE practica08;

CREATE TABLE autores ( 
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    nombre VARCHAR(100) NOT NULL, 
    email VARCHAR(140) NOT NULL, 
    imagen VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;


CREATE TABLE categorias (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    descripcion VARCHAR(40) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;


CREATE TABLE posts ( 
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    titulo VARCHAR(100) NOT NULL, 
    descripcion VARCHAR(140) NOT NULL, 
    categoria_id INT UNSIGNED NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    autor_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (autor_id) REFERENCES autores(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

-- Tabla: autores
INSERT INTO autores (nombre, email, imagen) VALUES
('Laura Gómez', 'laura.gomez@example.com', 'https://randomuser.me/api/portraits/women/1.jpg'),
('Carlos Pérez', 'carlos.perez@example.com', 'https://randomuser.me/api/portraits/men/2.jpg'),
('Marta Ruiz', 'marta.ruiz@example.com', 'https://randomuser.me/api/portraits/women/3.jpg'),
('Javier López', 'javier.lopez@example.com', 'https://randomuser.me/api/portraits/men/4.jpg');

-- Tabla: categorias
INSERT INTO categorias (descripcion) VALUES
('Tecnología'),
('Cultura'),
('Deportes'),
('Viajes'),
('Salud');

-- Tabla: posts
INSERT INTO posts (titulo, descripcion, categoria_id, imagen, autor_id) VALUES
('Novedades en Inteligencia Artificial', 'Un repaso por los últimos avances en IA y su impacto en la sociedad.', 1, 'https://picsum.photos/seed/ia/600/400', 1),
('10 libros que deberías leer este año', 'Una selección de obras que te harán reflexionar y disfrutar de la lectura.', 2, 'https://picsum.photos/seed/libros/600/400', 3),
('Cómo preparar tu primera maratón', 'Consejos prácticos para iniciarte en el mundo del running.', 3, 'https://picsum.photos/seed/maraton/600/400', 2),
('Los destinos más sorprendentes de Asia', 'Explora lugares únicos y poco conocidos del continente asiático.', 4, 'https://picsum.photos/seed/asia/600/400', 4),
('Hábitos saludables para mejorar tu bienestar', 'Pequeños cambios diarios que pueden transformar tu salud.', 5, 'https://picsum.photos/seed/salud/600/400', 1),
('Tendencias tecnológicas 2025', 'Qué tecnologías marcarán el futuro cercano.', 1, 'https://picsum.photos/seed/tecnologia/600/400', 2),
('Cómo mantenerte motivado en el deporte', 'Estrategias para no abandonar tu entrenamiento.', 3, 'https://picsum.photos/seed/motivacion/600/400', 3),
('Ciudades europeas con más encanto', 'Una guía rápida para tus próximas vacaciones.', 4, 'https://picsum.photos/seed/europa/600/400', 4);