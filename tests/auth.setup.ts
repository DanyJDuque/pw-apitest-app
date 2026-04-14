import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'

setup('authentication', async ({ request }) => {
    //   await page.goto('https://conduit.bondaracademy.com/')
    //   await page.getByText('Sign in').click()
    //   await page.getByRole('textbox', { name: 'Email' }).fill('pwtest_90@test.com')
    //   await page.getByRole('textbox', { name: 'Password' }).fill('welcome123')
    //   await page.getByRole('button', { name: 'Sign in' }).click()

    //   await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    //   await page.context().storageState({ path: authFile })

    // 60. API Authentication using API request and saving the token in a file

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            user: { email: "pwtest_90@test.com", password: "welcome123" }
        }
    })

    const responseBody = await response.json()
    const accessToken = responseBody.user.token
    // luego de obtener el token, lo guardamos en un archivo para que pueda ser utilizado por los tests que dependan de esta autenticación
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))
    // process.env['ACCESS_TOKEN'] = accessToken
    process.env.ACCESS_TOKEN = accessToken
});