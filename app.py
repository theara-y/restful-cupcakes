"""Flask app for Cupcakes"""
from flask import Flask, render_template, jsonify, request
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = 'secret'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.app_context().push()

connect_db(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/cupcakes')
def get_cupcakes():
    """ Get all cupcakes. """
    return jsonify(cupcakes=[Cupcake.serialize(cupcake) for cupcake in db.session.query(Cupcake).order_by(Cupcake.id).all()])


@app.route('/api/cupcakes/<int:id>')
def get_cupcake(id):
    """ Get cupcake by id. """
    return jsonify(cupcake=Cupcake.serialize(db.session.query(Cupcake).filter_by(id=id).one_or_404()))


@app.route('/api/cupcakes', methods=['POST'])
def post_cupcake():
    """ Create cupcake. """
    cupcake = Cupcake(
        flavor=request.json['flavor'],
        size=request.json['size'],
        rating=request.json['rating'],
        image=request.json['image']
    )
    db.session.add(cupcake)
    db.session.commit()
    return (jsonify(cupcake=Cupcake.serialize(cupcake)), 201)


@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def patch_cupcake(id):
    """ Update cupcake. """
    cupcake = db.session.query(Cupcake).filter_by(id=id).one_or_404()
    cupcake.flavor = request.json['flavor']
    cupcake.size = request.json['size']
    cupcake.rating = request.json['rating']
    cupcake.image = request.json['image']
    db.session.commit()
    return jsonify(cupcake=Cupcake.serialize(cupcake))


@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    """ Update cupcake. """
    cupcake = db.session.query(Cupcake).filter_by(id=id).one_or_404()
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message='Deleted')
