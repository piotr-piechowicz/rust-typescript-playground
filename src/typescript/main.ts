import fs from "fs";
import { getCategoriesAndGames } from "./requests/backoffice";
import { convertMicrosecondsToDate, getParam } from "./utils";
import { CollectionType, OutputGameModelType } from "./models";

const fetchCollectionGames = async(collection: CollectionType): Promise<Array<OutputGameModelType>> => {
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

const runMain = async (): Promise<void> => {
 
    const casino = await fetchCollectionGames('casino');
    const liveCasino = await fetchCollectionGames('live-casino');
    const virtuals = await fetchCollectionGames('virtuals');
    const bingo = await fetchCollectionGames('bingo');

    const allGames = [...casino, ...liveCasino, ...virtuals, ...bingo];

    // sorting by game.id asc
    allGames.sort((a, b) => {
        return a.id - b.id;
    });

    try {
        fs.writeFileSync('./src/data/output.txt', JSON.stringify(allGames));
    } catch (err) {
        console.error(err);
    }

};

runMain()
    .then(() => {
        console.log("Program executed successfully!");
    })
    .catch((error: unknown) => {
        console.error("Problem occured -> ", error);
    });
