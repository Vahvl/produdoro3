from flask import Flask, render_template

app = Flask(__name__)

@app.route('/teine')
def teine():
    link = '<p><a href="/">Koju tagasi</a></p>'
    return("See on see teine" + link)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/pomodoro')
def pomodoro():
    return render_template('pomodoro.html')

@app.route('/settings')
def settings():
    return render_template("settings.html")

if __name__ == '__main__':
    app.run(debug=True)

