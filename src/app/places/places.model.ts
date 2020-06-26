export class Place {
    constructor(
        public id: string,
        public title: string,
        public location: string,
        public description: string,
        public image: string,
        public price: number,
        public availableFrom: Date,
        public availableTo: Date,
        public userId: string
    ) {}
}
