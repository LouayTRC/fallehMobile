

export class Transaction{
    constructor(
        public id:string,
        public name:string,
        public type:string,
        public kilos:number,
        public boxes:number,
        public kgf:number,
        public litres:number,
        public prixBase:number,
        public price:number,
        public paid:boolean,
        public created_at:Date,
        public comment:string,
    ){}
}