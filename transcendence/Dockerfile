FROM python:3.8

WORKDIR /transcendence

# Update and install curl
RUN apt-get update && apt-get install -y curl

COPY ./blockchain ./transcendence/blockchain

# Install Node.js LTS version 20.11.1 and Install Truffle, Ganache-cli and ethers.js for Blockchain
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g truffle
RUN npm install -g ganache-cli
RUN npm install --save ethers
RUN pip install web3

COPY requirements.txt /transcendence/
RUN pip install --no-cache-dir -r requirements.txt

# Set Python logging level
ENV PYTHONWARNINGS=default

COPY . /transcendence/

EXPOSE 8000

CMD ganache-cli -h 0.0.0.0 & sleep 10 && \
    cd blockchain && \
    truffle migrate && \
    chmod +x /transcendence/blockchain/getContractAddress.py && \
    python /transcendence/manage.py makemigrations && \
    python /transcendence/manage.py migrate && \
    python /transcendence/blockchain/getContractAddress.py && \
    python /transcendence/manage.py runserver 0.0.0.0:8000