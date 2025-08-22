deserialize(content, strippedContent); // tymczasowe wracają
const { strippedContent: newStripped } = serialize(content); // znowu usuwasz
setStrippedContent(newStripped); // stan jest aktualny
save(content); // zapis bez tymczasowych
