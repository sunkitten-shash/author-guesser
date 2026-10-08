create database "author-guesser"
    with owner "podfic-tracker-db_owner";

create table public.event
(
    event_id serial
        constraint event_pk
            primary key,
    name     text not null,
    link     text,
    archived boolean
);

alter table public.event
    owner to "podfic-tracker-db_owner";

create table public.author
(
    author_id      serial
        constraint author_pk
            primary key,
    name           text    not null,
    link           text,
    has_valid_link boolean,
    twitter        text,
    notes          text,
    day            integer,
    week           integer,
    number         integer,
    event          integer not null
        constraint author_event_event_id_fk
            references public.event
);

alter table public.author
    owner to "podfic-tracker-db_owner";

create table public.fic
(
    fic_id      serial
        constraint fic_pk
            primary key,
    title       text    not null,
    link        text    not null,
    day         integer,
    week        integer default 1,
    notes       text,
    wordcount   integer,
    real_author integer
        constraint fic_author_author_id_fk
            references public.author,
    correct     boolean,
    event       integer not null
        constraint fic_event_event_id_fk
            references public.event
);

alter table public.fic
    owner to "podfic-tracker-db_owner";

create table public.tag
(
    tag_id   serial
        constraint tag_pk
            primary key,
    name     text not null,
    category text,
    constraint tag_uk
        unique (name, category)
);

alter table public.tag
    owner to "podfic-tracker-db_owner";

create table public.tag_fic
(
    tag_id integer not null
        constraint tag_fic_tag_tag_id_fk
            references public.tag,
    fic_id integer not null
        constraint tag_fic_fic_fic_id_fk
            references public.fic,
    constraint tag_fic_pk
        primary key (tag_id, fic_id)
);

alter table public.tag_fic
    owner to "podfic-tracker-db_owner";

create table public.tag_author
(
    tag_id    integer not null
        constraint tag_author_tag_tag_id_fk
            references public.tag,
    author_id integer not null
        constraint tag_author_author_author_id_fk
            references public.author,
    constraint tag_author_pk
        primary key (tag_id, author_id)
);

alter table public.tag_author
    owner to "podfic-tracker-db_owner";

create table public.match
(
    match_id  serial
        constraint match_pk
            primary key,
    fic_id    integer not null
        constraint match_fic_fic_id_fk
            references public.fic,
    author_id integer not null
        constraint match_author_author_id_fk
            references public.author,
    strength  text,
    notes     text,
    constraint match_uk
        unique (fic_id, author_id)
);

alter table public.match
    owner to "podfic-tracker-db_owner";

create table public.tag_match
(
    tag_id   integer not null
        constraint tag_match_tag_tag_id_fk
            references public.tag,
    match_id integer not null
        constraint tag_match_match_match_id_fk
            references public.match,
    strength text,
    notes    text,
    constraint tag_match_pk
        primary key (tag_id, match_id)
);

alter table public.tag_match
    owner to "podfic-tracker-db_owner";

