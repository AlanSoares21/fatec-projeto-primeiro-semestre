export type TLastLectureChapter = {
    chapter: number;
    title: string;
}

export type TLastLecture = {
    title: string;
    chapter: TLastLectureChapter;
}