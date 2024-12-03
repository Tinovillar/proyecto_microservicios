FROM python:3.10
WORKDIR /
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY . .
EXPOSE 8000
CMD fastapi run index.py --port 80