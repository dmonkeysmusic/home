const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Configura tu Access Token de producción o credenciales de Mercado Pago de Dirty Monkeys
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-tu-access-token-real-de-mercadopago-aqui' });

app.post('/crear-preferencia', async (req, res) => {
    try {
        const { items, payer, shipments } = req.body;

        // Armamos la preferencia oficial para Mercado Pago
        const preference = new Preference(client);
        
        const result = await preference.create({
            body: {
                items: items,
                payer: payer,
                shipments: {
                    cost: shipments.cost,
                    mode: "not_specified"
                },
                back_urls: {
                    success: "https://tusitio.com/gracias.html",
                    failure: "https://tusitio.com/checkout.html",
                    pending: "https://tusitio.com/gracias.html"
                },
                auto_return: "approved",
                statement_descriptor: "DIRTY MONKEYS"
            }
        });

        // Le devolvemos el link de pago (init_point) al HTML
        res.json({ init_point: result.init_point });

    } catch (error) {
        console.error("Error al crear la preferencia en Mercado Pago:", error);
        res.status(500).json({ error: "No se pudo procesar el pago con Mercado Pago" });
    }
});

app.listen(3000, () => {
    console.log('Servidor de Dirty Monkeys corriendo en el puerto 3000 🚀');
});
