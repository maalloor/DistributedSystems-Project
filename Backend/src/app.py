from asyncio.windows_events import NULL
from flask import Flask, request
from flask.json import jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo, ObjectId

name_reviewer = "Nancy C. Johnson"

# Se crea la conexion con la Base de Datos
app = Flask(__name__)
# URI a la BD real con todos los elementos del dataset
# Nota: Los metodos Create y PUT no funcionan debido a que se excedio el limite de datos permitido, DELETE y GET funcionan correctamente.
app.config['MONGO_URI'] = 'mongodb+srv://admin1:admin1@cluster0.jt61sio.mongodb.net/electronics?retryWrites=true&w=majority'
# mongodb+srv://admin1:admin1@cluster0.jt61sio.mongodb.net/?retryWrites=true&w=majority
# mongodb+srv://admin1:admin1@cluster0.jt61sio.mongodb.net/electronics?retryWrites=true&w=majority
## app.config['MONGO_URI'] = 'mongodb://localhost/Electronics'
# URI a la BD de prueba, en esta solo existen 20 elementos del dataset original
# Nota: Todos los metodos funcionan como deberian
# app.config['MONGO_URI'] = 'mongodb+srv://admin:admin@cluster0.qzfqq.mongodb.net/Electronics?retryWrites=true&w=majority'


app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={r"/*": {"origins": "*"}})
mongo = PyMongo(app)
db = mongo.db.electronicos



# CRUD: Añadir un nuevo elemento
@app.route('/electronics', methods=['POST'])
def createElectronic():
    id = db.insert_one({
        'reviewerID': request.get_json(force=True)['reviewerID'],
        'asin': request.get_json(force=True)['asin'],
        'reviewerName': request.get_json(force=True)['reviewerName'],
        'helpful': request.get_json(force=True)['helpful'],
        'reviewText': request.get_json(force=True)['reviewText'],
        'overall': request.get_json(force=True)['overall'],
        'summary': request.get_json(force=True)['summary'],
        'unixReviewTime': request.get_json(force=True)['unixReviewTime'],
        'reviewTime': request.get_json(force=True)['reviewTime'],
        'category': request.get_json(force=True)['category'],
        'class': request.get_json(force=True)['class']
    })
    return jsonify({'msg': 'Electronic created'})

# CRUD: Pedir todos los elementos
# @app.route('/electronics/<initialPage>/<endPage>', methods=['GET'])
# def getElectronics(initialPage, endPage):
#     electronics = []
#     for index in range(int(initialPage), int(endPage)):
#         electronic = db.find()[index]
#         if(not 'reviewerName' in electronic):
#             electronic['reviewerName'] = "NULL"

#         electronics.append({
#             '_id': str(ObjectId(electronic['_id'])),
#             'reviewerID': electronic['reviewerID'],
#             'asin': electronic['asin'],
#             'reviewerName':  electronic['reviewerName'],
#             'helpful': electronic['helpful'],
#             'reviewText': electronic['reviewText'],
#             'overall': electronic['overall'],
#             'summary': electronic['summary'],
#             'unixReviewTime': electronic['unixReviewTime'],
#             'reviewTime': electronic['reviewTime'],
#             'category': electronic['category'],
#             'class': electronic['class'],
#         })
#     return jsonify(electronics)

@app.route('/electronics', methods=['GET'])
def getElectronics():
    electronics = []
    for electronic in db.find().limit(3000):
        if(not 'reviewerName' in electronic):
            electronic['reviewerName'] = "NULL"
        electronics.append({
            '_id': str(ObjectId(electronic['_id'])),
            'reviewerID': electronic['reviewerID'],
            'asin': electronic['asin'],
            'reviewerName': electronic['reviewerName'],
            'helpful': electronic['helpful'],
            'reviewText': electronic['reviewText'],
            'overall': electronic['overall'],
            'summary': electronic['summary'],
            'unixReviewTime': electronic['unixReviewTime'],
            'reviewTime': electronic['reviewTime'],
            'category': electronic['category'],
            'class': electronic['class'],
        })
    return jsonify(electronics)


# CRUD: Pedir un unico elemento
@app.route('/electronic/<id>', methods=['GET'])
def getElectronic(id):
    electronic = db.find_one({'_id': ObjectId(id)})
    print(electronic)
    return jsonify({
        '_id': str(ObjectId(electronic['_id'])),
        'reviewerID': electronic['reviewerID'],
        'asin': electronic['asin'],
        'reviewerName': electronic['reviewerName'],
        'helpful': electronic['helpful'],
        'reviewText': electronic['reviewText'],
        'overall': electronic['overall'],
        'summary': electronic['summary'],
        'unixReviewTime': electronic['unixReviewTime'],
        'reviewTime': electronic['reviewTime'],
        'category': electronic['category'],
        'class': electronic['class']
    })

# CRUD: Eliminar un unico elemento
@app.route('/electronics/<id>', methods=['DELETE'])
def deleteElectronic(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Electronic Deleted'})

# CRUD: Actualizar un unico elemento
@app.route('/electronics/<id>', methods=['PUT'])
def updateElectronic(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'reviewerID': request.get_json(force=True)['reviewerID'],
        'asin': request.get_json(force=True)['asin'],
        'reviewerName': request.get_json(force=True)['reviewerName'],
        'helpful': request.get_json(force=True)['helpful'],
        'reviewText': request.get_json(force=True)['reviewText'],
        'overall': request.get_json(force=True)['overall'],
        'summary': request.get_json(force=True)['summary'],
        'unixReviewTime': request.get_json(force=True)['unixReviewTime'],
        'reviewTime': request.get_json(force=True)['reviewTime'],
        'category': request.get_json(force=True)['category'],
        'class': request.get_json(force=True)['class']
    }})
    return jsonify({'msg': 'Electronic updated'})

@app.route('/electronics/result', methods=['POST'])
def createTask():
    global name_reviewer
    name_reviewer = request.get_json(force=True)['taskName']
    return jsonify(name_reviewer)

@app.route('/electronics/result', methods=['GET'])
def getresultTask():
    global name_reviewer
    result = []
    if name_reviewer != "":
        for index in db.aggregate([
            {"$match": {"reviewerName": name_reviewer}},
            {"$group": {"_id": "$reviewerID", "count": {"$sum":1}}}
        ]):
            result.append(index)
        name_reviewer = ""
    else:
        result = [{"_id": "None", "count": 0}]
    return jsonify(result)

# Estableciendo el debug
if __name__ == "__main__":
    app.run(debug=True)