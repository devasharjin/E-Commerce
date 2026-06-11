

export class AppError extends Error{
    public readonly statuscode : number 

    constructor(statuscode : number,message : string){
        super(message)
       this.statuscode = statuscode
    }
}