export interface Category {
    name: string;
    children: { [key: string]: string };
}