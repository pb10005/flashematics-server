create table if not exists decks(
    id integer primary key autoincrement,
    name text unique not null,
    base64 text not null,
    created_at text,
    updated_at text
);