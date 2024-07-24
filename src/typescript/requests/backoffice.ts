import { CategoriesAndGamesModel, CategoriesAndGamesModelZod, CollectionType, GetResponseType } from "../models";
import { getParam } from "../utils";

const hostBO = 'https://backoffice.starsports.bet'; // https://backoffice-rhino.stg.rhino-multi.tup-cloud.com/api/session
const hostProxy = 'https://socket-api-star.prod.sherbetcloud.com'; // /ins/socket-api/api-proxy/staff/casino/management/categories-and-games/${collection}

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
        const categoriesAndGames = await response.json();
        console.log(categoriesAndGames);
        const data = CategoriesAndGamesModelZod.safeParse(categoriesAndGames);

        if (data.success) {
            return {
                type: 'success',
                data: data.data
            }
        }
    } catch (err) {
        console.error('-----tu sie wywala');
    }
    
    console.error('Invalid data type has been returned.');

    return {
        type: 'error',
        msg: 'Invalid data type has been returned.'
    }
}