# API Reference

Base URL: `http://localhost:4000/api`

## Auth

`POST /auth/register`

```json
{
  "name": "Aarav Singh",
  "email": "aarav@example.com",
  "password": "StrongPass1"
}
```

`POST /auth/login`

```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

`GET /auth/me`

Header: `Authorization: Bearer <token>`

## Plants

`GET /plants?q=snake&category=Indoor&minPrice=200&maxPrice=600&inStock=true&page=1&limit=9&sort=priceAsc`

`GET /plants/:plantId`

`POST /plants` `ADMIN`

Content type: `multipart/form-data`

Fields:

- `name`
- `description`
- `category`
- `price`
- `stock`
- `imageUrl` or `image`
- `isActive`

`PUT /plants/:plantId` `ADMIN`

`DELETE /plants/:plantId` `ADMIN`

## Cart

`GET /cart`

`POST /cart/items`

```json
{
  "plantId": 2,
  "quantity": 1
}
```

`PATCH /cart/items/:itemId`

```json
{
  "quantity": 3
}
```

`DELETE /cart/items/:itemId`

## Orders

`GET /orders`

`GET /orders/:orderId`

`POST /orders/checkout`

```json
{
  "shippingName": "Maya Green",
  "shippingEmail": "customer@example.com",
  "shippingPhone": "+91-9876543210",
  "shippingAddressLine1": "42 Green Avenue",
  "shippingAddressLine2": "Near Cedar Park",
  "shippingCity": "Dehradun",
  "shippingState": "Uttarakhand",
  "shippingPostalCode": "248001"
}
```

## Wishlist

`GET /wishlist`

`POST /wishlist/items`

```json
{
  "plantId": 7
}
```

`DELETE /wishlist/items/:plantId`

## Admin

`GET /admin/analytics`

`GET /admin/plants?page=1&limit=9`

`GET /admin/orders?page=1&limit=10&status=PENDING&q=maya`

`PATCH /admin/orders/:orderId/status`

```json
{
  "status": "SHIPPED"
}
```

`GET /admin/users?page=1&limit=10`

## Sample cURL

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"password\":\"your-password\"}"
```

Create a plant with upload:

```bash
curl -X POST http://localhost:4000/api/plants \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -F "name=Bird of Paradise" \
  -F "description=Large tropical statement plant" \
  -F "category=Indoor" \
  -F "price=950" \
  -F "stock=8" \
  -F "image=@C:/path/to/plant.jpg"
```

Checkout:

```bash
curl -X POST http://localhost:4000/api/orders/checkout \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"shippingName\":\"Maya Green\",\"shippingEmail\":\"customer@example.com\",\"shippingPhone\":\"+91-9876543210\",\"shippingAddressLine1\":\"42 Green Avenue\",\"shippingCity\":\"Dehradun\",\"shippingState\":\"Uttarakhand\",\"shippingPostalCode\":\"248001\"}"
```
