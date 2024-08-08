import { CategoriesAndGamesModel, CategoriesAndGamesModelZod, CollectionType, GetResponseType, OutputGameModelType } from "../models";
import { convertMicrosecondsToDate, getParam } from "../utils";

/**
// Star
// const hostBO = 'https://backoffice.starsports.bet';
// const hostProxy = 'https://socket-api-star.prod.sherbetcloud.com';
// 
// McBookie
// const hostBO = 'https://backoffice.mcbookie.com';
// const hostProxy = 'https://webapi.backoffice.mcbookie.com/ins/socket-api';
// 
// Nebet
// const hostBO = 'https://backoffice.ne-bet.com';
// const hostProxy = 'https://webapi.backoffice.ne-bet.com/ins/socket-api';
// 
// Rhino
// const hostBO = 'https://backoffice.rhino.bet';
// const hostProxy = 'https://webapi.backoffice.rhino.bet/ins/socket-api';
// 
// Vickers
// const hostBO = 'https://backoffice.vickers.bet';
// const hostProxy = 'https://webapi.backoffice.vickers.bet/ins/socket-api';
// 
// Betzone
// const hostBO = 'https://backoffice.betzone.co.uk';
// const hostProxy = 'https://webapi.backoffice.betzone.co.uk/ins/socket-api';
// 
// Planet
// const hostBO = 'https://backoffice.planetsportbet.com';
// const hostProxy = 'https://webapi.backoffice.planetsportbet.com/ins/socket-api';
// 
// Bresbet
// const hostBO = 'https://backoffice.bresbet.com';
// const hostProxy = 'https://webapi.backoffice.bresbet.com/ins/socket-api';
// 
// AkBets
// const hostBO = 'https://backoffice.akbets.bet';
// const hostProxy = 'https://socket-api-akbets.prod.star-multi.pbe-cloud.com';
// 
// Dragonbet
// const hostBO = 'https://backoffice.dragonbet.co.uk';
// const hostProxy = 'https://webapi.backoffice.dragonbet.co.uk/ins/socket-api';
// 
// GJ
// const hostBO = 'https://backoffice.gentlemanjim.bet';
// const hostProxy = 'https://webapi.backoffice.gentlemanjim.bet/ins/socket-api';
// 
// Energy
// const hostBO = 'https://backoffice.nrg.bet';
// const hostProxy = 'https://webapi.backoffice.nrg.bet/ins/socket-api';
// 
// PricedUp
// const hostBO = 'https://backoffice.pricedup.bet';
// const hostProxy = 'https://webapi.backoffice.pricedup.bet/ins/socket-api';
 *
 */

const hostBO = 'https://backoffice.pricedup.bet';
const hostProxy = 'https://webapi.backoffice.pricedup.bet/ins/socket-api';

export const getBearerToken = async(): Promise<GetResponseType<string>> => {
    const auth_response = await fetch(`${hostBO}/api/session`, { 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'piotr.piechowicz@playbookengineering.com',
            password: 'Play,b00k'
        })
    });

    if (auth_response.status !== 200) {
        console.error('getBearerToken error -> ', auth_response.status, '; response: ', auth_response);
        return {
            type: 'error',
            msg: await auth_response.text()
        };
    }

    const bearer_token = auth_response.headers.get('set-cookie');

    if (bearer_token === null) {
        console.error('getBearerToken error -> `set-cookie` header not found');
        return {
            type: 'error',
            msg: '`set-cookie` header not found'
        };
    }

    const param = getParam(bearer_token, 'backoffice.sid');

    if (param === null) {
        return {
            type: 'error',
            msg: 'backoffice.sid not found'
        };
    }

    return {
        type: 'success',
        data: param
    }
};

export const getCategoriesAndGames = async(collection: CollectionType): Promise<GetResponseType<CategoriesAndGamesModel>> => {
    const bearerTokenResponse = await getBearerToken();

    if (bearerTokenResponse.type === 'error') {
        return bearerTokenResponse;
    }

    const response = await fetch(`${hostProxy}/api-proxy/staff/casino/management/categories-and-games/${collection}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerTokenResponse.data}`
        },
    });

    if (response.status !== 200) {
        console.error('getCategoriesAndGames error -> ', response.status, '; response: ', response);
        return {
            type: 'error',
            msg: await response.text()
        };
    }

    try {
        const categoriesAndGames = await response.json(); // TODO: add function to safe parse json
        const data = CategoriesAndGamesModelZod.safeParse(categoriesAndGames);

        if (data.success) {
            return {
                type: 'success',
                data: data.data
            }
        }
    } catch (err) {
        console.error('Error - TODO: add function to safe parse json'); // TODO
    }
    
    console.error('Invalid data type has been returned.');

    return {
        type: 'error',
        msg: 'Invalid data type has been returned.'
    }
}

export const fetchCollectionGames = async(collection: CollectionType): Promise<Array<OutputGameModelType>> => {
   const response = await getCategoriesAndGames(collection);
    
    if (response.type === 'error') {
        console.error('Error in getCategoriesAndGames ->', response.msg);
        return [];
    }

    const output: Array<OutputGameModelType> = [];

    for (const game of response.data.games) {

        const generation1 = getParam(game.image, "generation", "?")?.split("&")[0] ?? null;
        const generation2 = getParam(game.image_vertical, "generation", "?")?.split("&")[0] ?? null;
        const generation3 = getParam(game.image_vertical, "generation", "?")?.split("&")[0] ?? null;

        const generationDate1 = generation1 === null ? '' : convertMicrosecondsToDate(generation1);
        const generationDate2 = generation2 === null ? '' : convertMicrosecondsToDate(generation2);
        const generationDate3 = generation3 === null ? '' : convertMicrosecondsToDate(generation3);

        output.push({
            id: game.id,
            collection: collection,
            status: game.published === true ? 'Published' : 'Not Published',
            launch_game_id: game.launch_game_id,
            name: game.name,
            provider: game.provider,
            studio_id: game.studio_id,
            studio_name: game.studio_name,
            upload_date_image_1: generationDate1,
            upload_date_image_2: generationDate2,
            upload_date_image_3: generationDate3,
        });
    }

    return output;
};
