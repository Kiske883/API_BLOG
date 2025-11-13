##############################
##         API Posts        ##
##############################

## Recuperar todos los Posts
Metodo : GET 
URL : /api/posts
Headers : no
Body: no

Response: 
- Array con todos lo Posts , hay que añadir datos de paginación

## Creación de un Post
Metodo : POST
URL : /api/posts
Headers : no
Body: { titulo, descripcion, categoria_id, imagen, autor_id }

Response: 
- Array con el Posts añadido { titulo, descripcion, categoria_id, imagen, autor_id } además de los datos de author y descripcion en lugar del id

## Recuperar los datos de un Posts
Metodo : GET
URL : /api/posts/author/:id
Headers : no
Body: no 

Response: 
- Array con los posts del author seleccionado. añadir opcion de paginación

## Recuperar los posts de un author
Metodo : GET
URL : /api/posts/:id
Headers : no
Body: no 

Response: 
- Array con el Posts seleccionado ademas de los datos de author y la descripcion de la categoria

## Actualizar datos de un Posts
Metodo : PUT
URL : /api/posts/:id
Headers : no
Body: { titulo, descripcion, categoria_id, imagen, autor_id }

Response: 
- Array con el Posts actualizado { titulo, descripcion, categoria_id, imagen, autor_id }, añadiendo los datos de author asignado al igual que la descripcion de la categoria

## eliminar un Posts
Metodo : DELETE
URL : /api/posts/:id
Headers : no
Body: no

Response: 
- Array con el Posts eliminado

##############################
##         API Posts        ##
##############################
