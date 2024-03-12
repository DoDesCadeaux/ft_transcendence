FROM python:3.8

WORKDIR /transcendence

COPY requirements.txt /transcendence/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /transcendence/

EXPOSE 8000

CMD python manage.py collectstatic --noinput && python manage.py makemigrations && python manage.py migrate && daphne -e ssl:8000:privateKey=key.pem:certKey=cert.pem transcendence.asgi:application

