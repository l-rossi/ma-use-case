FROM swipl:latest

WORKDIR /

COPY server.pl server.pl

CMD ["swipl", "-g", "server(8080), thread_get_message(_)", "-s", "server.pl"]
