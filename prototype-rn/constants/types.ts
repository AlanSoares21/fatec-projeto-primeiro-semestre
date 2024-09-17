export type TLastLiteraryWorkChapter = {
    chapter: number;
    title: string;
    filePath: string;
}

export type TLastLiteraryWork = {
    title: string;
    chapter: TLastLiteraryWorkChapter;
}


// api types
export type TStdList<T> = {
    start: number;
    count: number;
    total: number;
    data: T[];
}

export type TStdPaginationQuery = {
    start: number;
    count: number;
}

export type TLiteraryWorkChapter = {
    title: string;
    filePath: string;
    size: number;
    source: string;
}

export type TLiteraryWork = {
    id: string;
    title: string;
    author: string;
    type: string;
    source: string;
    chapters: TLiteraryWorkChapter[];
}

export type TApiError = {
    message: string;
    StatusCode: number;
}