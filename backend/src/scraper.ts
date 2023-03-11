import * as cheerio from 'cheerio'
import got from 'got'
import { getAPIResponse } from './util.js'

export async function scrapeProducts(searchTerm: string): Promise<ProductList> {
    return {
        colruyt: removeFalses(await scrapeProductsColruyt(searchTerm), 'colruyt'),
        ah: removeFalses(await scrapeProductsAH(searchTerm), 'ah')
    }
}

export async function scrapeProductsColruyt(searchTerm: string): Promise<Product[]> {
    const selector = '#plpProducts > div.plp__items > div.plp-products > div'

    const response = await got(`https://www.collectandgo.be/colruyt/nl/zoek?searchTerm=${searchTerm}`, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
        },
    })
    const $ = cheerio.load(response.body)

    const products = [] as Product[]

    for (let i = 1; i < 11; i++) {
        const price =
            normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.c-price__euro`,
                ).html(),
            ) +
            normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.c-price__cent`,
                ).html(),
            )
        products.push({
            title: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.c-tile__data > div > div.c-product-name__long.--plp`,
                ).html(),
            ),
            brand: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.c-tile__data > div > div.c-product-name__brand.--plp`,
                ).html(),
            ),
            priceKilo: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.product__price__weight-price > span.product__price__volume-price.s-volume-price`,
                ).html(),
            ),
            image: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.plp-item-top__image-banner-wrap > a > img`,
                ).attr('src'),
            ),
            price,
        })
    }

    return products
}

export async function scrapeProductsAH(searchTerm: string): Promise<Product[]> {
    const selector = '#search-lane > div'

    const response = await got(`https://www.ah.be/zoeken?query=${searchTerm}`, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
        },
    })
    const $ = cheerio.load(response.body)

    const products = [] as Product[]

    for (let i = 1; i < 11; i++) {
        const price =
            normalize(
                $(`${selector} > article:nth-child(${i}) > div > a > div > div > div > span:nth-child(1)`).html(),
            ) +
            ',' +
            normalize($(`${selector} > article:nth-child(${i}) > div > a > div > div > div > span:nth-child(3)`).html())

        products.push({
            title: normalize($(`${selector} > article:nth-child(${i}) > div > div > a > strong > span`).html()),
            image: normalize($(`${selector} > article:nth-child(${i}) > div > a > figure > div > img`).attr('src')),
            weight: normalizeWeight($(`${selector} > article:nth-child(${i}) > div > a > div > div > span`).html()),
            price,
        })
    }
    return products
}

export async function scrapeProductsDelhaize(searchTerm: string): Promise<Product[]> {
    const res = await getAPIResponse(searchTerm)
    console.log(JSON.stringify(res, null, 2))
    const products = res.data.productSearch.products
    return products.map(product => {
        return {
            priceKilo: product.price.supplementaryPriceLabel1,
            image: `https://static.delhaize.be${product.images.filter(image => image.format == 'respListGrid')[0].url}`,
            title: product.name,
            price: product.price.unitPriceFormatted
        }
    })
}

function normalize(data: string | null | undefined): string {
    return (data || '')
        .trim()
        .replace(/&nbsp;/g, '')
        .replace(/€/, '')
}

function normalizeWeight(data: string | null | undefined): number {
    const weight = (data || '').trim().match(/\d+/) ? (data || '').trim().match(/\d+/)![0] : '0'
    return parseInt(weight)
}



function removeFalses(data: Product[], shop: 'colruyt' | 'ah'): Product[] {
    if (shop == 'colruyt') {
        return data.filter(
            product =>
                product.price && product.brand && product.weight && product.title && product.priceKilo && product.image,
        )
    }
    return data.filter(product => product.price && product.brand && product.weight && product.title && product.image)
}

type Product = {
    title: string
    price: number
    weight?: number 
    brand?: string
    priceKilo?: string
    image?: string
}

type ProductList = {
    colruyt: Product[]
    ah: Product[]
    delhaize: Product[]
}

export type DelhaizeAPIResponse = {
    data: APIData
}

type APIData = {
    productSearch: APIProductSearch
}

type APIProductSearch = {
    products: APIProduct[]
}

type APIProduct = {
    images: APIImage[]
    name: string
    price: APIPrice
}

type APIImage = {
    format: string
    url: string
}

type APIPrice = {
    unitPriceFormatted: string
    supplementaryPriceLabel1: string
}
