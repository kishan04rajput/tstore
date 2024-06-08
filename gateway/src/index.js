import dotenv from "dotenv"
import express from 'express'
import {createProxyMiddleware} from 'http-proxy-middleware'

dotenv.config({
    path: './.env'
})

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);


app.use(
    '/order', createProxyMiddleware({
        target: `http://127.0.0.1:${process.env.ORDER_PORT}`,
        pathRewrite: {
            '^/order': ''
        }
    })
)

app.use(
    '/product', createProxyMiddleware({
        target: `http://127.0.0.1:${process.env.PRODUCT_PORT}`,
        pathRewrite: {
            '^/product': ''
        }
    })
)

app.use(
    '/user', createProxyMiddleware({
        target: `http://127.0.0.1:${process.env.USER_PORT}`,
        pathRewrite: {
            '^/user': ''
        }
    })
)

app.use(
    '/payment', createProxyMiddleware({
        target: `http://127.0.0.1:${process.env.PAYMENT_PORT}`,
        pathRewrite: {
            '^/payment': ''
        }
    })
)


const port = process.env.GATEWAY_PORT;
app.listen(port, () => {
    console.log(`Gateway Service Listening on http://localhost:${port}`)
})