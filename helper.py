from validators import url as validate_url

def process_url(url_str):
    # strip whitespace
    url_str = url_str.strip()

    # add scheme if not in there
    if not url_str.startswith(('http://', 'https://', 'ftp://')): # most common url schemes
        url_str = 'http://' + url_str #safe to assume most sites can be accessed through http
    # more validation in case user intercepted packet
    if validate_url(url_str) is True:
        url = url_str
    else:
        url = 'inv'
    return url

def make_prediction(input, model, vectorizer):
    transformed_input=vectorizer.transform([input])
    prediction = model.predict(transformed_input)
    proba = model.predict_proba(transformed_input)
    return prediction, tuple(map(tuple, proba))[0] # tuple transforms a numpy array for access later on
