from flask import Flask, render_template, request, jsonify
from helper import *
from joblib import load


vectorizer = load('model_info/vectorizer.pkl')
ML_model = load(filename="model_info/RandomForestClassifier_url.joblib")
values_to_name = {
 2 : "Malware",
 0 : "Benign",
 3 : "Phishing",
 1 : "Defacement"
}


app = Flask(__name__)

# $env:FLASK_APP=main.py
# $env:FLASK_DEBUG=1

@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
@app.route('/index.html', methods=['GET'])
@app.route('/home', methods=['GET'])
def home():
    return render_template('index.html', title="URL Classification Tool")

@app.route('/classifications.html', methods=['GET'])
@app.route('/classifications', methods=['GET'])
def cls():
    return render_template('classifications.html', title="Model Classifications")

@app.route('/about.html', methods=['GET'])
@app.route('/about', methods=['GET'])
def abt():
    return render_template('about.html', title="About The Model")

@app.route('/proc_url', methods=["POST"])
def proc_url():
    if request.method == 'POST':
        json_url = request.get_json()

        url = process_url(json_url[0]["url_str"])
        no_scheme = json_url[1]["no_scheme"]
        results = {}

        if (url == 'inv'):
            results['url'] = url
        else:
            if (no_scheme == '0'):
                prediction, details_tpl = make_prediction(url, ML_model, vectorizer) # predicts with included scheme
            else:
                prediction, details_tpl = make_prediction(no_scheme.strip(), ML_model, vectorizer) # predicts without scheme
            results["mal"] = round((float(details_tpl[2]) * 100 ),2) #formats each probability as dd.dd
            results["ben"] = round((float(details_tpl[0]) * 100), 2)
            results["phish"] = round((float(details_tpl[3]) * 100), 2)
            results["def"] = round((float(details_tpl[1]) * 100), 2)
            if prediction[0] == 0:
                results['url'] = "Safe"
            else:
                results['url'] = "Unsafe"
    return jsonify(results)

if __name__ == '__main__':
   app.run(debug=True)