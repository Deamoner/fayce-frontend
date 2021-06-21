export interface JobDetail {
    data : {
        output : string;
        photos : string[];
        status : string;
        token : string;
    };
    id : string;
}

export interface JobSubject {
    jobId : string;
    isFinished : boolean;
    progress : string;
}

export interface Jobs {
    id : number;
    name : string;
    photo : string;
}
