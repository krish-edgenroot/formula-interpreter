module.exports={
    "CONCATSTR": {
        "params": [
            {
                "name": "args",
                "type": "...args",
                "min":1,
                "required": true
            }
        ],
        "return": "string | object"
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