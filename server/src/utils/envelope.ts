
export type ApiEnvelope<T> = {
    status : 'success' | 'errror',
    data : T | null,
    meta ? : Record<string,unknown>,
    errors ? : Array<{message: string ; code ? : string}>
}

export function ok<T>(data : T, meta ?: Record<string,unknown>): ApiEnvelope<T> {
    return  {
            status : 'success',
            data,
            meta
        }
    
}

export function fail<T> (message : string , code ?: string) : ApiEnvelope<T> {
    return {
        status : 'errror',
        data : null,
        errors : [{
            message ,code
        }]
    }
}