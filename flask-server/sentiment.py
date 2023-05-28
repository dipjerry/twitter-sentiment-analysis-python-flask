from flask import Flask, request , send_file
from flask_restful import Resource, Api
import tweepy
from textblob import TextBlob
from flask_cors import CORS
from pymongo import MongoClient
from wordcloud import WordCloud
from nltk.corpus import stopwords
from bson import json_util
import time
import json
import copy
stopwords = set(stopwords.words('english'))
# from flask_images import Images
# app = Flask(__name__)
# images = Images(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['twitter']
# Twitter API Credentials
consumer_key = 'Qbf72GnBptGZ8TTWTo0Y8AyVd'
consumer_secret = 'Tpv5fTNy8MHfgM7jPCuopGUFvTQLEG7wzZc03ZYIGUaTOE32Q3'
access_token = '1584924957716676608-lsu78tHONtzOlGlzqni76K4pMkXEiN'
access_token_secret = 'kMKd5ybRIWq9WgB7GBO62BWGOwSqYJmgSYYd6lvURj44S'
print(consumer_key)
app = Flask(__name__)
CORS(app)
api = Api(app)
tweets = []
t_data = {} #dictionary for twitter data
my_json = {"tweets": []} 
lang_data = {} #dictionary for language data
import re
def tweet_cleaner(x):
    text=re.sub("[@&][A-Za-z0-9_]+","", x)     # Remove mentions
    text=re.sub(r"http\S+","", text)           # Remove media links
    return text
def generate_lang_data(lang):
    global lang_data
    if lang in lang_data:
        val = lang_data[lang]
        lang_data[lang] = val + 1
    else:
        lang_data[lang] = 1
def fetch_tweets(keyword):
    global tweets, consumer_key, consumer_secret, access_token, access_token_secret, t_data, my_json
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    tweet_api = tweepy.API(auth)
    public_tweets = tweet_api.search_tweets(q=keyword, count=80000)
    my_json["tweets"].clear()
    for tweet in public_tweets:
        tweets.append(tweet_cleaner(tweet.text))
        t_data = {
            "query":keyword,
            "text": tweet.text,
            "username": tweet.user.name,
            "date": str(tweet.created_at),
            "hashtags": [hashtag["text"] for hashtag in tweet.entities["hashtags"]],
            "mentions": [mention["screen_name"] for mention in tweet.entities["user_mentions"]],
            "retweet_count": tweet.retweet_count,
            "favorite_count": tweet.favorite_count,
            "url": 'https://twitter.com/' + str(tweet.user.id) + '/status/' + str(tweet.id),
            "location": tweet.user.location,
            "screen_name": tweet.user.screen_name,
            "profile_image":tweet.user.profile_image_url_https
        }
        # Insert the tweet into the MongoDB collection
        db.sentiment.insert_one(t_data)
        generate_lang_data(tweet.lang)
    return tweets
def sentiment(text):
    analysis = TextBlob(text)
    # print(text)
    # print(analysis.sentiment)
    if analysis.sentiment.polarity > 0:
        return "Positive"
    if analysis.sentiment.polarity == 0:
        return "Neutral"
    if analysis.sentiment.polarity < 0:
        return "Negative"
def filter_grammar(text):
    grammer_words =  ["a","rt","ft","an", "the", "and", "or", "but", "for", "nor", "so", "yet", "of", "in", "on", "at", "to", "from", "by", "with", "about", "as", "into", "is", "are", "was", "were", "be", "being", "been", "has", "have", "had", "will", "shall", "do", "does", "did", "can", "could", "may", "might", "must", "would", "should", "it", "he", "she", "they", "we", "you", "i", "me", "my", "your", "our", "their", "its", "his", "her", "their" , "that" , "who" , "i" , "how"]
    text = text.lower() # convert text to lowercase
    text = re.sub(r'[^a-z ]', '', text) # remove all non-alphabetic characters except spaces
    text = text.split() # split text into list of words
    word_counts = {}
    for word in text:
        if word in grammer_words:
            continue
        if word in word_counts:
            word_counts[word] += 1
        else:
            word_counts[word] = 1
    sorted_words = sorted(word_counts, key=word_counts.get, reverse=True)
    return text
    # return text
class QueryData(Resource):
    def get(self):
        # Get all unique queries from the database
        queries = db.sentiment.distinct("query")
        # Count total available data in the database
        total_data = db.sentiment.count_documents({})
        query_counts = {}
        for query in queries:
            count = db.sentiment.count_documents({"query": query})
            query_counts[query] = count

        # Prepare the response
        response = {
            "queries": query_counts,
            "total_data": total_data
        }
        return response

def get_polarity(fetched_tweets , query , jsonFetchTweet):
    global my_json, lang_data
    pos = 0
    neg = 0
    neu = 0
    wordlist = filter_grammar(" ".join(fetched_tweets))
    print("wordlist")   
    # print(wordlist)
    for tw in fetched_tweets:
        pol = sentiment(tw)
        # pol = sentiment(tw)
        if pol == 'Positive':
            pos = pos + 1
        if pol == 'Neutral':
            neu = neu + 1
        if pol == 'Negative':
            neg = neg + 1
    try:
        pos_p = (pos / len(fetched_tweets)) * 100
    except:
        pos_p = 0
    try:
        neg_p = (neg / len(fetched_tweets)) * 100
    except:
        neg_p = 0
    try:
        neu_p = (neu / len(fetched_tweets)) * 100
    except:
        neu_p = 0
    timestr = time.strftime("%Y%m%d-%H%M%S")
    filename = timestr+query+".png"    
    tweets_string = " ".join(wordlist)
    stopwords.update(["rt", "https" , "http"])
    WordCloud(width = 800, height = 800, 
                background_color ='white', 
                stopwords = stopwords, 
                min_font_size = 10).generate(tweets_string).to_file("img/"+filename)
    pol_dict_data = {"positive": pos_p, "negative": neg_p, "neutral": neu_p}
    sent_dict = {"Sentiment": pol_dict_data, "Tweets": jsonFetchTweet, "Languages": lang_data , "wordlist":filename}
    return sent_dict

def get_tweet(query):
    tweet = db.sentiment.find({"query": query})
    return (tweet) 

class Sentiment(Resource):
    def get(self):
        query = request.args.get('query')
        fetched_tweets = fetch_tweets(query)
        tweets = get_tweet(query)
        tweets2 =copy.deepcopy(tweets)
        tweetlist =  [tweet["text"] for tweet in tweets]
        jsonFetchTweet = json.loads(json_util.dumps(tweets2))
        print("jsonFetch")
        print(tweetlist)
        print(jsonFetchTweet)
        pol = get_polarity(tweetlist , query , jsonFetchTweet)
        return pol
    
class ImageResource(Resource):
    def get(self):
        image_name = request.args.get('query')
        print(image_name)
        if image_name:
            try:
                image_path = f'img/{image_name}'  # Replace 'path_to_images' with the actual path to your images directory
                return send_file(image_path, mimetype='image/png')
            except Exception as e:
                return str(e)
        else:
            return "Image name not provided."

api.add_resource(ImageResource, '/image')
api.add_resource(Sentiment, '/')
api.add_resource(QueryData, '/get_sentiment')
if __name__ == '__main__':
    app.run(debug=True)