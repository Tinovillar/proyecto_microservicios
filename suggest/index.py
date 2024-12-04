import pika, json, requests, pandas as pd, numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUEUE_NAME = 'movie_history'
RECORD = []

@app.get("/recommendations")
async def get_recommendations():
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    current_movies = []
    
    while True:
        method_frame, properties, body = channel.basic_get(queue=QUEUE_NAME, auto_ack=False)
        if method_frame:
            # current_movies.append(json.loads(bytes.decode(body)))
            RECORD.append(json.loads(bytes.decode(body)))
            channel.basic_ack(method_frame.delivery_tag)
        else:
            break

    connection.close()
    
    # current_movies_titles = [movie['movieTitle'] for movie in current_movies]
    
    # return generate_recommendations(current_movies_titles)
    
    return RECORD

async def generate_recommendations(current_movies_titles):
    response = await requests.get('http://movies:4000/movies/all') 
    data = response.json()
    movies = pd.DataFrame(data)

    movies['directors_clean'] = movies['directors'].apply(string_converter)
    movies['genres_clean'] = movies['genres'].apply(string_converter)
    movies['cast_clean'] = movies['cast'].apply(string_converter)

    movies['soup'] = movies.apply(lambda x: ' '.join([str(x['genres_clean']), str(x['cast_clean'] or ''), str(x['directors_clean'] or '')]), axis=1)
    
    recommended_df = recommend_movies(movies, movies['title'][0])
    recommended_df = pd.concat(recommended_df, ignore_index=True)
    recommended_df = recommended_df.sort_values(by="sim_score", ascending=False)
    dict_recommended_df = recommended_df.to_dict(orient='records')
    json_recommended_df = json.dumps(dict_recommended_df)

    return json_recommended_df

def string_converter(nombres):
        if isinstance(nombres, list):  # Verificar si es una lista
            return ', '.join(nombres).lower()
        return ''

def recommend_movies(movies, record):
    recommended_movies = []
    for title in record:
        recommended_movie = recommend_movie(movies, title)
        recommended_movies.append(recommended_movie)
    return recommended_movies

def recommend_movie(movies, title, n=5):
    # Calculate cosine similarity matrix
    count = CountVectorizer(analyzer='word',ngram_range=(1, 2),min_df=0.0, stop_words='english')
    count_matrix = count.fit_transform(movies['soup'])
    cosine_sim = cosine_similarity(count_matrix, count_matrix)

    # Calculate index
    indices = pd.Series(movies.index, index=movies['title'])
    try:
        idx = indices[title]
    except KeyError:
        idx = max(cosine_sim, key=lambda x: max(x[1]))[0]

    # Calculate similar scores
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # sim_scores = sorted(sim_scores, key=lambda x: x[1].item() if isinstance(x[1], np.ndarray) else x[1], reverse=True)
    sim_scores = sim_scores[1:n+1]

    # Movies indices
    movie_indices = [i[0] for i in sim_scores]
    scores = [i[1] for i in sim_scores]

    # Recommended movies
    recommended_movies = movies.iloc[movie_indices].copy()
    recommended_movies['sim_score'] = scores

    return recommended_movies