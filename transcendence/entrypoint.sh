#!/bin/bash

cd blockchain
truffle migrate &
TRUFFLE_PID=$!

wait $TRUFFLE_PID

chmod +x getContractAddress.py && \
python /transcendence/blockchain/getContractAddress.py && \
python /transcendence/manage.py makemigrations && \
python /transcendence/manage.py migrate && \
python /transcendence/manage.py runserver 0.0.0.0:8000