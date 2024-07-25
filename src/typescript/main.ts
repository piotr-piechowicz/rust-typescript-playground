import fs from "fs";
import { json2csv } from 'json-2-csv';
import { fetchCollectionGames } from "./requests/backoffice";

const runMain = async (): Promise<void> => {
 
    const casino = await fetchCollectionGames('casino');
    const liveCasino = await fetchCollectionGames('live-casino');
    const virtuals = await fetchCollectionGames('virtuals');
    const bingo = await fetchCollectionGames('bingo');

    const allGames = [...casino, ...liveCasino, ...virtuals, ...bingo];

    // sorting by game.id asc
    allGames.sort((a, b) => {
        return b.id - a.id;
    });


    try {
        const csv = await json2csv(allGames);
        fs.writeFileSync('./src/data/output.txt', csv);
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
