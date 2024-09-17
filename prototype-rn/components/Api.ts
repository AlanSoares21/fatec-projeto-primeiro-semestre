import { TApiError, TLiteraryWork, TStdList, TStdPaginationQuery } from "@/constants/types";
import {
    createDownloadResumable, documentDirectory, 
    makeDirectoryAsync, getInfoAsync
} from 'expo-file-system'

const url = process.env.API_URL || 'http://10.0.2.2:5018';

function handleError(e: any): TApiError {
    console.log({error: e, keys: Object.keys(e)})
    return {
        message: 'error on requesting api',
        StatusCode: 400
    }
}

export function listWorks(pgQuery: Partial<TStdPaginationQuery>) {
    const qs = Object
        .keys(pgQuery)
        .map((k) => `${k}=${pgQuery[k as keyof TStdPaginationQuery]}`)
        .join("&");
    let targetUrl = `${url}/LiteraryWork?${qs}`;
    console.log("requesting", targetUrl)
    return fetch(targetUrl)
        .then(r => r.json() as Promise<TStdList<TLiteraryWork>>)
        .catch(handleError)
}

export function isApiError(value: any): value is TApiError {

    return typeof value['message'] === 'string'
        && typeof value['StatusCode'] === 'number'
}

export async function getChapter(work: TLiteraryWork, chapterIndex: number) {
    let targetUrl = `${url}/LiteraryWork/${work.id}/chapter/${chapterIndex}`;
    let workPath =  documentDirectory + work.chapters[chapterIndex].filePath.split('/')[0];
    console.log("requesting", targetUrl);
    if (!(await getInfoAsync(workPath)).exists) {
        await makeDirectoryAsync(workPath);
    }
    let path =  documentDirectory + work.chapters[chapterIndex].filePath;
    return createDownloadResumable(
        targetUrl,
        path,
        {},
        () => {}
    );
}