import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response){
    if(request.method === 'POST'){
        const TOKEN = 'd3f2289c4093b2bc368c7ebcf49ccb'
        const client = SiteClient(TOKEN);

        // Validar os dados antes de cadastrar
        const registroCriado = await client.items.create({
            itemType: "971609", // ID do Model "Communities" criado pelo Dato
            ...request.body,
        })

        console.log(registroCriado);

        response.json({
            registroCriado: registroCriado,
        });

        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST  tem.'
    })
}
