API Clientes

## Recuperar todos los clientes
Metodo : GET 
URL : /api/clientes
Headers : no
Body: no

Response: 
- Array con todos lo clientes 

## Creación de un cliente
Metodo : POST
URL : /api/clientes
Headers : no
Body: nombre, apellidos, direccion, email... 

Response: 
- Array con el cliente añadido

## Recuperar los datos de un cliente
Metodo : GET
URL : /api/clientes/:id
Headers : no
Body: no 

Response: 
- Array con el cliente seleccionado

## Actualizar datos de un cliente
Metodo : PUT
URL : /api/clientes/:id
Headers : no
Body: nombre, apellidos, direccion, email...

Response: 
- Array con el cliente actualizado

## eliminar un cliente
Metodo : DELETE
URL : /api/clientes/:id
Headers : no
Body: no

Response: 
- Array con el cliente eliminado