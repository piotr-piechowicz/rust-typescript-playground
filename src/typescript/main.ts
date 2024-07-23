import { getCategoriesAndGames } from "./requests/backoffice";

const runMain = async (): Promise<void> => {
    const response = await getCategoriesAndGames();
    
    if (response.type === 'success') {

        const games = response.data.games;

        console.log(games);
    } 

};

runMain()
    .then(() => {
        console.log("Program executed successfully!");
    })
    .catch((error: unknown) => {
        console.error("Problem occured -> ", error);
    });
