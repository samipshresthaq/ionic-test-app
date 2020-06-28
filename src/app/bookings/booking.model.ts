export class Booking {
    constructor(
        public id: string,
        public placeId: string,
        public firstName: string,
        public lastName: string,
        public userId: string,
        public placeTitle: string,
        public placeImage: string,
        public guestNumber: number,
        public startDate: Date,
        public endDate: Date,
    ) {

    }
}
