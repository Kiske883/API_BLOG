##############################
##         API Authors      ##
##############################

## Recuperar todos los Authors
Metodo : GET 
URL : /api/authors
Headers : no
Body: no

Response: 
- Array con todos lo Authors 

## Creación de un cliente
Metodo : POST
URL : /api/authors
Headers : no
Body: { nombre, email, imagen }

Response: 
- Array con el author añadido

## Recuperar los datos de un author
Metodo : GET
URL : /api/authors/:id
Headers : no
Body: no 

Response: 
- Array con el author seleccionado

## Actualizar datos de un author
Metodo : PUT
URL : /api/authors/:id
Headers : no
Body: { nombre, email, imagen }

Response: 
- Array con el author actualizado

## eliminar un author
Metodo : DELETE
URL : /api/authors/:id
Headers : no
Body: no

Response: 
- Array con el author eliminado

##############################
##         API Posts        ##
##############################
