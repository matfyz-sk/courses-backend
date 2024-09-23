import { UGQL_ENDPOINT } from "../constants/index.js"
import fetch from 'node-fetch';

export const runQuery = async (query) => {
    const response = await fetch(UGQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query})
    })
    const data = await response.json()
    return data
}