interface ProductExt {
    id: FirestoreString;
    name?: FirestoreString;
    photoPath?: FirestoreString;
    price?: FirestoreDouble;
    description?: FirestoreString;
    shopId: FirestoreString;
    archivedAt: FirestoreInteger;
    isArchive: FirestoreBoolean;
    category1: FirestoreString;
    subcategory1: FirestoreString;
    category2: FirestoreString;
    subcategory2: FirestoreString;
    normalPrice: FirestoreInteger;
    quantityAvailable: FirestoreInteger;
}