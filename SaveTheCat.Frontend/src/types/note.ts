export type EmotionalCharge = '+/+' | '-/-' | '+/-' | '-/+';

export interface Note {
    id: string;
    x: number;
    y: number;
    sceneHeading: string;
    description: string;
    emotionalCharge: EmotionalCharge;
    emotionalDescription: string;
    conflict: string;
    color: string;
    beatItem?: string;
    projectId: string;
}
