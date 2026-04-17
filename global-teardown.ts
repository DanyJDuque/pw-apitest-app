import { request, expect } from '@playwright/test'

async function globalTeardown() {
    const context = await request.newContext()
    console.log('Deleting article with slug: ', process.env.SLUG_ID)
    const deleteArticleResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUG_ID}`, {
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
    })
    expect(deleteArticleResponse.status()).toEqual(204)
}

export default globalTeardown;