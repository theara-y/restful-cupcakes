const URL = 'http://127.0.0.1:5000/api/cupcakes'
const headers = {
    headers: {
        'Content-Type': 'application/json'
    }
}

async function getCupcakes() {
    resp = await axios.get(URL);
    if (resp.status == 200) {
        const ul = $('<ul></ul');
        cupcakes = resp.data.cupcakes;
        for (let { id, flavor, size, rating, image } of cupcakes) {
            $(`<li class='get-cupcake' data-id='${id}'>${flavor}</li>`).appendTo(ul);
        }
        $('#app').empty();
        $('#app').append(ul);
    }
}

async function getCupcake(id) {
    resp = await axios.get(URL + `/${id}`);
    if (resp.status == 200) {
        cupcake = resp.data.cupcake;
        const { id, flavor, size, rating, image } = cupcake;
        const cupcakeDiv = $(
            `
            <label for='inputFlavor'>Flavor</label>
            <input id='inputFlavor' type='text' value='${flavor}'>
            <label for='inputSize'>Size</label>
            <input id='inputSize' type='text' value='${size}'>
            <label for='inputRating'>Rating</label>
            <input id='inputRating' type='number' value='${rating}'>
            <img src='${image}' alt='Cupcake Image'>
            <label for='inputImage'>Image</label>
            <input id='inputImage' type='text' value='${image}'>
            <button data-id='${id}' class='post-cupcake'>Create</button>
            <button data-id='${id}' class='patch-cupcake'>Update</button>
            <button data-id='${id}' class='delete-cupcake'>Delete</button>
            <a href="/">Back</a>
            `
        )
        $('#app').empty()
        $('#app').append(cupcakeDiv)
    }
}

async function postCupcake(json) {
    resp = await axios.post(URL, json, headers);
    if (resp.status == 201) {
        getCupcakes()
    }
}

async function patchCupcake(id, json) {
    resp = await axios.patch(URL + `/${id}`, json, headers);
    if (resp.status == 200) {
        getCupcakes()
    }
}

async function deleteCupcake(id) {
    resp = await axios.delete(URL + `/${id}`);
    if (resp.status == 200) {
        getCupcakes()
    }
}

$(document).ready(function () {
    getCupcakes();
})

$(document).on('click', '.get-cupcake', function () {
    getCupcake($(this).data('id'));
})

$(document).on('click', '.post-cupcake', function () {
    const json = {
        'flavor': $('#inputFlavor').val(),
        'size': $('#inputSize').val(),
        'rating': $('#inputRating').val(),
        'image': $('#inputImage').val()
    }
    postCupcake(json);
})

$(document).on('click', '.patch-cupcake', function () {
    const json = {
        'flavor': $('#inputFlavor').val(),
        'size': $('#inputSize').val(),
        'rating': $('#inputRating').val(),
        'image': $('#inputImage').val()
    }
    patchCupcake($(this).data('id'), json);
})

$(document).on('click', '.delete-cupcake', function () {
    deleteCupcake($(this).data('id'));
})