:- use_module(swish:library(pengines_io)).
:- use_module(library(pengines)).
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).

:- initialization(server).

server :-
    http_server(http_dispatch, [port(8080)]),
    thread_get_message(_).