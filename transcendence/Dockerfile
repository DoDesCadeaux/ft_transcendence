FROM python:3.8

WORKDIR /transcendence

# Install curl
RUN apt-get update && apt-get install -y curl

# Install Node.js LTS version 20.11.1 and Install Truffle, Ganache-cli and ethers.js for Blockchain
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g truffle
RUN npm install -g ganache-cli
RUN npm install --save ethers

COPY requirements.txt /transcendence/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /transcendence/

EXPOSE 8000

CMD python manage.py collectstatic --noinput && python manage.py makemigrations && python manage.py migrate && daphne -e ssl:8000:privateKey=key.pem:certKey=cert.pem transcendence.asgi:application
