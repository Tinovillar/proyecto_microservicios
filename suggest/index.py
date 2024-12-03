import pika, json, requests, pandas as pd, numpy as np
from fastapi import FastAPI

app = FastAPI()

QUEUE_NAME = 'movie_history'
RECORD = []

@app.get("/recommendations")
async def get_recommendations():
    connection = pika.BlockingConnection(pika.ConnectionParameters('amqp://rabbitmq:5672'))
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    while True:
        method_frame, properties, body = channel.basic_get(queue=QUEUE_NAME, auto_ack=False)
        if method_frame:
            RECORD.append(json.loads(bytes.decode(body)))
            channel.basic_ack(method_frame.delivery_tag)
        else:
            break

    connection.close()
    return RECORD

def generate_recommendations():
    return

# res = requests.get('http://random_movies:4000/movies/all')
# response = res.json()
# df = pd.DataFrame(response)
# print(df.shape)


# if __name__ == "__main__":
    # books['authors_clean'] = books['authors'].apply(lambda x: ', '.join(str.lower(i.replace(" ", "")) for i in x.split(', ')))
    # books['soup'] = books.apply(lambda x: ' '.join([str(x['title']), str(x['authors_clean'] or ''), str(x['genres'] or '')]), axis=1)
    # count = CountVectorizer(analyzer='word',ngram_range=(1, 2),min_df=0.0, stop_words='english')
    # count_matrix = count.fit_transform(books['soup'])
    