FROM swipl:latest


ARG BUST_CACHE=1
COPY server.pl .

# Run the Python Flask app using the virtual environment
CMD ["swipl", "server.pl"]
