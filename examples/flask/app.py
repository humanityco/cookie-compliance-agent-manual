from flask import Flask, render_template

app = Flask(__name__)


@app.get("/")
def home():
    return render_template("home.html")


@app.get("/about")
def about():
    return render_template("about.html")


@app.get("/product")
def product():
    return render_template("product.html")
