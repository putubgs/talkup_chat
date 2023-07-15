import os
import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

import nltk
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.corpus import wordnet, words

# Specifying the absolute path to the CSV file
base_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path_problem_vs_nonproblem = os.path.join(base_dir, 'problem_vs_nonproblem.csv')
csv_file_path_problem_category = os.path.join(base_dir, 'problem_stories.csv')

# Reading the CSV files
data_problem_vs_nonproblem = pd.read_csv(csv_file_path_problem_vs_nonproblem)
data_problem_category = pd.read_csv(csv_file_path_problem_category)

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

def contains_real_words(text):
    english_words = set(words.words())
    tokens = word_tokenize(text.lower())
    return any(token in english_words for token in tokens)

# Preprocess and vectorize the problem_vs_nonproblem dataset
X_problem_vs_nonproblem = data_problem_vs_nonproblem['Stories'].apply(preprocess_text)
vectorizer_problem_vs_nonproblem = TfidfVectorizer()
X_problem_vs_nonproblem = vectorizer_problem_vs_nonproblem.fit_transform(X_problem_vs_nonproblem)
y_problem_vs_nonproblem = data_problem_vs_nonproblem['Label']

# Preprocess and vectorize the problem_category dataset
X_problem_category = data_problem_category['Stories'].apply(preprocess_text)
vectorizer_problem_category = TfidfVectorizer()
X_problem_category = vectorizer_problem_category.fit_transform(X_problem_category)
y_problem_category = data_problem_category['Label']

# Train the problem_vs_nonproblem classifier
X_train, X_test, y_train, y_test = train_test_split(X_problem_vs_nonproblem, y_problem_vs_nonproblem, test_size=0.2, random_state=42)
svm_model_problem_vs_nonproblem = LogisticRegression()
svm_model_problem_vs_nonproblem.fit(X_train, y_train)

# Train the problem_category classifier
X_train, X_test, y_train, y_test = train_test_split(X_problem_category, y_problem_category, test_size=0.2, random_state=42)
svm_model_problem_category = LogisticRegression()
svm_model_problem_category.fit(X_train, y_train)

# Classify an inputted story
input_story = sys.argv[1]

if not contains_real_words(input_story):
    print("Others", end="")
else:
    input_story_preprocessed = preprocess_text(input_story)
    input_story_vectorized_problem_vs_nonproblem = vectorizer_problem_vs_nonproblem.transform([input_story_preprocessed])

    predicted_problem_vs_nonproblem = svm_model_problem_vs_nonproblem.predict(input_story_vectorized_problem_vs_nonproblem)[0]

    if predicted_problem_vs_nonproblem == "Problem":
        input_story_vectorized_problem_category = vectorizer_problem_category.transform([input_story_preprocessed])
        predicted_category = svm_model_problem_category.predict(input_story_vectorized_problem_category)[0]
    else:
        predicted_category = "Others"

    print(predicted_category, end="")
