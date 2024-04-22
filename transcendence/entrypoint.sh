#!/bin/bash

sleep 5
cd blockchain
truffle migrate &
TRUFFLE_PID=$!

wait $TRUFFLE_PID

chmod +x getContractAddress.py && \
python /transcendence/blockchain/getContractAddress.py && \
python /transcendence/manage.py collectstatic --noinput && \
python /transcendence/manage.py makemigrations && \
python /transcendence/manage.py migrate && \
daphne -e ssl:8000:privateKey=key.pem:certKey=cert.pem ./transcendence.asgi:application