import { User } from "./user-profile.models";

export class VariationImage {
    public pk: number;
    public image: string;
    
    constructor(image: string) {
        this.image = image;
    }
}

export class Variation {
    public pk: number;
    public title: string;
    public description: string;
    public price: number;
    public sale_price: number;
    public available: boolean;
    public inventory: number;
    public variationimages: VariationImage[];

}

export class Product {
    public pk: number;
    public title: string;
    public description: string;
    public price: number;
    public image: string;
    public tags: string[];
    public user: User;
    public variations: Variation[];

    constructor() {
        
    }
}



