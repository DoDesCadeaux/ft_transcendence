FROM python:3.8

WORKDIR /transcendence

COPY requirements.txt /transcendence/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /transcendence/

EXPOSE 8000

CMD ["python3 manage.py runserver 0.0.0.0:8000"]