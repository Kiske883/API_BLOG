##############################
##         API Posts        ##
##############################

## Recuperar todos los Posts
Metodo : GET 
URL : /api/Posts
Headers : no
Body: no

Response: 
- Array con todos lo Posts 

## Creación de un cliente
Metodo : POST
URL : /api/Posts
Headers : no
Body: { titulo, descripcion, categoria_id, imagen, created_at, updated_at, autor_id, categoria, Author.nombre, Author.email, Author.imagen }

Response: 
- Array con el Posts añadido

## Recuperar los datos de un Posts
Metodo : GET
URL : /api/Posts/:id
Headers : no
Body: no 

Response: 
- Array con el Posts seleccionado

## Actualizar datos de un Posts
Metodo : PUT
URL : /api/Posts/:id
Headers : no
Body: { titulo, descripcion, categoria_id, imagen, autor_id }

Response: 
- Array con el Posts actualizado

## eliminar un Posts
Metodo : DELETE
URL : /api/Posts/:id
Headers : no
Body: no

Response: 
- Array con el Posts eliminado
