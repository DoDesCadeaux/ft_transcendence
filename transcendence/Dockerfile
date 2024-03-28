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


COPY requirements.txt /transcendence/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /transcendence/

# Run Ganache CLI in the background
RUN ganache-cli &

# Check if the lock file exists, if not, migrate the contract
#RUN if [ ! -f "blockchain/migration.lock" ]; then \
#    cd blockchain && truffle migrate && touch migration.lock ; \
#    fi

EXPOSE 8000

CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000