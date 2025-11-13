export interface BeatSheetDto {
    id: string;
    projectId: string;
    title: string;
    logline: string;
    genre: string;
    date: string;
    openingImage: string;
    themeStated: string;
    setUp: string;
    catalyst: string;
    debate: string;
    breakIntoTwo: string;
    bStory: string;
    funAndGames: string;
    midpoint: string;
    badGuysCloseIn: string;
    allIsLost: string;
    darkNightOfTheSoul: string;
    breakIntoThree: string;
    finale: string;
    finalImage: string;
}

export type UpdateBeatSheetDto = Omit<BeatSheetDto, 'id' | 'projectId' | 'title' | 'date'>;