# Music Api 

Use framework HapiJS

## The API can store songs

The API you create should be able to store songs via routes :

- Method : POST

- URL : /songs

- Body Request: 
```
{
    "title": string,
    "year": number,
    "performer": string,
    "genre": string,
    "duration": number
}
```

Response to be returned :

- Status Code : 201
- Response Body : 
``` json
{
    "status": "success",
    "message": "Lagu berhasil ditambahkan",
    "data": {
        "songId": "song-Qbax5Oy7L8WKf74l"
    }
} 
```

## API can display the whole song

The API you create should be able to display all the songs stored via the route :

- Method: GET
- URL: /songs

Response to be returned:

- Status Code: 200
- Response Body:

```json
{
    "status": "success",
    "data": {
        "songs": [
            {
                "id": "song-Qbax5Oy7L8JKf74l",
                "title": "Kenangan Mantan",
                "performer": "Band Indo"
            },
            {
                "id": "song-poax5Oy7L8WKljkw",
                "title": "Kau Terindah",
                "performer": "Band Indo"
            },
            {
                "id": "song-Qalokam7L8JKf74l",
                "title": "Tulus Padamu",
                "performer": "Band Indo"
            }
        ]
    }
}
```

If no songs have been entered, the server can respond with an empty songs array.

```json
{
    "status": "success",
    "data": {
        "songs": []
    }
}
```

## API can display song details

The API you create should be able to display all songs stored via the route:

- Method: GET
- URL: /songs/{songId}

Response to be returned:

- Status Code: 200
- Response Body:
```json
{
    "status": "success",
    "data": {
        "song": {
            "id": "song-Qbax5Oy7L8WKf74l",
            "title": "Kenangan Mantan",
            "year": 2021,
            "performer": "Band Indo",
            "genre": "Indie",
            "duration": 120,
            "insertedAt": "2021-03-05T06:14:28.930Z",
            "updatedAt": "2021-03-05T06:14:30.718Z"
        }
    }
}
```

## API can change song data

The API you create should be able to modify song data by id via route:

- Method: PUT
- URL: /songs/{songId}
- Body Request:

```
{
    "title": string,
    "year": number,
    "performer": string,
    "genre": string,
    "duration": number
}
```

Response returned:
- Status code: 200
- Response Body:
```json
{
    "status": "success",
    "message": "lagu berhasil diperbarui"
}
```

## API can delete song data

The API you create should be able to modify song data by id via route :

- Method : DELETE
- URL : /songs/{songId}

When the song is updated successfully, the server should return a response with:

- Status Code : 200
- Response Body:
```
{
    "status": "success",
    "message": "lagu berhasil dihapus"
}
```