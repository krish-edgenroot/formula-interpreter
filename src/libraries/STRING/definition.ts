module.exports={
    "CONCATSTR": {
        "params": [
            {
                "name": "...args",
                "type": "string",
                "min":1,
                "required": true
            }
        ],
        "return": "string"
    },
    "STRLENGTH": {
        "params": [
            {
                "name": "str",
                "type": "string",
                "required": true
            }
        ],
        "return": "number"
    },
}