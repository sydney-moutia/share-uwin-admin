export interface ProductMainCategory {
    name: FirestoreString;
    children: {
        mapValue: {
            fields: { [key: string]: FirestoreString }
        }
    };
}