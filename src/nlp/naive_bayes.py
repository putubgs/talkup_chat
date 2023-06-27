import os
import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

import nltk
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.corpus import wordnet

# Specifying the absolute path to the CSV file
base_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(base_dir, 'problem_stories.csv')

# Reading the CSV file
data = pd.read_csv(csv_file_path)

X = data['Stories']  # Input text (problem stories)
y = data['Label']  # Corresponding category labels

lemmatizer = WordNetLemmatizer()
stemmer = PorterStemmer()

def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN

def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens_pos = nltk.pos_tag(tokens)
    tokens_lem = [lemmatizer.lemmatize(token, pos=get_wordnet_pos(pos)) for token, pos in tokens_pos]
    tokens_stem = [stemmer.stem(token) for token in tokens_lem]
    return ' '.join(tokens_stem)

X = X.apply(preprocess_text)

vectorizer = CountVectorizer()  # You can customize this further if needed
X = vectorizer.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

nb_model = MultinomialNB()
nb_model.fit(X_train, y_train)

y_pred = nb_model.predict(X_test)
# print(classification_report(y_test, y_pred))

# Classify an inputted story
input_story = sys.argv[1]

input_story = preprocess_text(input_story)
input_story = vectorizer.transform([input_story])

predicted_category = nb_model.predict(input_story)[0]
print(predicted_category, end="")