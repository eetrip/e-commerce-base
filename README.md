## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the packages

```bash
npm ci
```

## Usage

to run server on local use

```bash
npm run dev
```

for custom ports and databse config change the required values in the attched env file

You can either use the attched postamn collection to run the API's 
Or use the following end points

```javascript

# Auth
/api/seller/register
/api/seller/login

# Seller
/api/seller/createCatalog
/api/seller/addItems
/api/seller/orders

# Buyer
/api/buyer/listSellers
/api/buyer/getCatalog
/api/buyer/order
/api/buyer/listOrders
