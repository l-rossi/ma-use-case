% Disclaimer: This is written by an LLM. This is not meant to be secure or production-ready.

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(readutil)).  % for reading from string
:- use_module(library(sandbox)).

% HTTP endpoint
:- http_handler('/eval', eval_prolog_code, []).

server(Port) :-
    http_server(http_dispatch, [port(Port)]).

% Main endpoint handler
eval_prolog_code(Request) :-
    http_parameters(Request, [
        code(CodeString, [string])
    ]),
    catch(run_code(CodeString, Result), Error, Result = error(Error)),
    reply_json_dict(_{result:Result}).

% Safe evaluation wrapper
run_code(CodeString, Result) :-
    string_to_term(CodeString, Term, VarNames),
    allow_term(Term),
    sandbox:safe_goal(Term),
    term_variables(Term, Vars),
    (   Vars = []
    ->  once(sandbox:safe_call(Term)),
        Result = true
    ;   findall(binding(VarNames, Vars), sandbox:safe_call(Term), Bindings),
        maplist(vars_to_dict, Bindings, Solutions),
        Result = Solutions
    ).

% Convert variable bindings to a dictionary
vars_to_dict(binding(VarNames, Vars), Dict) :-
    maplist(extract_var_name, VarNames, Names),
    pairs_keys_values(Pairs, Names, Vars),
    dict_create(Dict, json, Pairs).

% Extract just the variable name from a Name=Value term
extract_var_name(Name=_, Name).

% Read a term from a string
string_to_term(String, Term, VarNames) :-
    open_string(String, Stream),
    read_term(Stream, Term, [syntax_errors(error), variable_names(VarNames)]),
    close(Stream).

% Only allow atoms, goals, or horn clauses (no directives, modules, etc.)
allow_term((Head :- Body)) :- !,
    callable(Head),
    callable(Body).
allow_term(Term) :-
    callable(Term),
    Term \= (:- _),
    Term \= (:-(_, _)).
