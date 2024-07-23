import { CategoriesAndGamesModel, CategoriesAndGamesModelZod, GetResponseType } from "../models";
import { getParam } from "../utils";

export const getBearerToken = async(): Promise<GetResponseType<string>> => {
    const auth_response = await fetch('https://backoffice-rhino.stg.rhino-multi.tup-cloud.com/api/session', {
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
        //console.error('get_bearer_token error -> ', auth_response);
        return {
            type: 'error',
            msg: await auth_response.text()
        };
    }

    const bearer_token = auth_response.headers.get('set-cookie');

    if (bearer_token === null) {
        //console.error('get_bearer_token error -> `set-cookie` header not found');
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

export const getCategoriesAndGames = async(): Promise<GetResponseType<CategoriesAndGamesModel>> => {
    const bearerTokenResponse = await getBearerToken();

    if (bearerTokenResponse.type === 'error') {
        return bearerTokenResponse;
    }

    const response = await fetch('https://webapi.backoffice-rhino.stg.rhino-multi.pbe-cloud.com/ins/socket-api/api-proxy/staff/casino/management/categories-and-games/casino', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerTokenResponse.data}`
        },
    });

    const categoriesAndGames = await response.json();

    const data = CategoriesAndGamesModelZod.safeParse(categoriesAndGames);

    if (data.success) {
        return {
            type: 'success',
            data: data.data
        }
    }

    console.error('Invalid data type has been returned.');

    return {
        type: 'error',
        msg: 'Invalid data type has been returned.'
    }
}