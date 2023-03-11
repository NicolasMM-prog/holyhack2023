import got from 'got'
import { DelhaizeAPIResponse, Product } from './scraper'

// Custom API call for Delhaize
export async function getAPIResponse(searchTerm: string): Promise<DelhaizeAPIResponse> {
    const variables = {
        lang: 'nl',
        searchQuery: `${searchTerm}:relevance`,
        sort: 'relevance',
        pageNumber: 0,
        pageSize: 10,
        filterFlag: true,
        useSpellingSuggestion: true,
    }

    const extensions = {
        persistedQuery: { version: 1, sha256Hash: 'c7899cf99d5932a1a9d81131cf4c620dc55a08d16d1260a173648a8d2a38f0b2' },
    }

    const headers = {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
    }

    const url = `https://api.delhaize.be/?operationName=GetProductSearch&variables=${JSON.stringify(
        variables,
    )}&extensions=${JSON.stringify(extensions)}`
    return await got(url, { headers }).json<DelhaizeAPIResponse>()
}

// Cleans the string to delete weird characters
export function normalize(data: string | null | undefined): string {
    return (data || '')
        .trim()
        .replace(/&nbsp;/g, '')
        .replace(/€/, '')
}

// Cleans the weight
export function normalizeWeight(data: string | null | undefined): number {
    const weight = (data || '').trim().match(/\d+/) ? (data || '').trim().match(/\d+/)![0] : '0'
    return parsePrice(weight)
}

// Remove empty products
export function removeFalses(data: Product[]): Product[] {
    return data.filter(product => product.price && product.priceKilo && product.title && product.image)
}

// Replaces price commas with dots
export function parsePrice(price: string): number {
    return +parseFloat(price.replace(/,/, '.')).toFixed(2)
}
