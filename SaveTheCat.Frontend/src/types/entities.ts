export interface Entity {
    id: string;
    name: string;
}

export interface Character extends Entity {}

export interface Location extends Entity {}
