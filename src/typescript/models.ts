import { z } from "zod";

const CategoryModelZod = z.object({
    id: z.number(),
    universe: z.string(),
    name: z.string(),
    active: z.boolean(),
    fixed: z.boolean(),
    visible_in_navigation: z.boolean(),
    visible_in_all_games: z.boolean(),
    game_ids: z.array(z.number())
});

const GameModelZod = z.object({
    id: z.number(),
    universe: z.string(),
    name: z.string(),
    launch_game_id: z.string(),
    provider: z.string(),
    studio_id: z.string(),
    studio_name: z.string(),
    image: z.string(),
    image_square: z.string(),
    image_vertical: z.string(),
    published: z.boolean(),
    demo: z.boolean(),
    description: z.string(),
    jackpot_amount: z.string(),
    max_bet: z.string(),
    min_bet: z.string(),
    max_win: z.string(),
    return_to_player: z.string()        
});

export const CategoriesAndGamesModelZod = z.object({
    categories: z.array(CategoryModelZod),
    games: z.array(GameModelZod),
});

export type CategoriesAndGamesModel = z.TypeOf<typeof CategoriesAndGamesModelZod>;

export type GetResponseType<T> = 
    | {
        type : 'success';
        data: T
    } | {
        type: 'error';
        msg: string;
    } 
    // | {
    //     type: 'httpError';
    //     status: number;
    //     msg: string;
    // }
    ; 