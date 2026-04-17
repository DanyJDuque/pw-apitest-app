import { request, expect } from '@playwright/test'
import user from './.auth/user.json'
import fs from 'fs'


async function globalSetup() {
    const authFile = '.auth/user.json'
    const context = await request.newContext()

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            user: { email: "pwtest_90@test.com", password: "welcome123" }
        }
    })
    const responseBody = await responseToken.json()
    const accessToken = responseBody.user.token
    // luego de obtener el token, lo guardamos en un archivo para que pueda ser utilizado por los tests que dependan de esta autenticación
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))
    // process.env['ACCESS_TOKEN'] = accessToken
    process.env.ACCESS_TOKEN = accessToken

    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            article: { "tagList": [], "title": "Global Likes test article", description: "This is a test description", "body": "This is a test body" }
        },
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
    })
    expect(articleResponse.status()).toBe(201)
    const response = await articleResponse.json()
    const slugId = response.article.slug
    process.env.SLUG_ID = slugId
}

export default globalSetup;