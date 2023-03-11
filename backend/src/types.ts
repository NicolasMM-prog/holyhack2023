// Types
export type Product = {
    title: string
    price: number
    brand?: string
    priceKilo: number
    image: string
}

export type ProductList = {
    colruyt: Product[]
    ah: Product[]
    delhaize: Product[]
}

export type DelhaizeAPIResponse = {
    data: APIData
}

export type APIData = {
    productSearch: APIProductSearch
}

export type APIProductSearch = {
    products: APIProduct[]
}

export type APIProduct = {
    images: APIImage[]
    name: string
    price: APIPrice
    manufacturerName: string
}

export type APIImage = {
    format: string
    url: string
}

export type APIPrice = {
    unitPriceFormatted: string
    supplementaryPriceLabel1: string
}
