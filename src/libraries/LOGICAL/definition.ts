module.exports={
    "IF": {
        "params": [
            {
                "name": "condition",
                "type": "any",
                "required": true
            },
            {
                "name": "trueValue",
                "type": "any",
                "required": true
            },
            {
                "name": "falseValue",
                "type": "any",
                "required": false
            },
        ],
        "return": "any"
    },
    "AND": {
        "params": [
            {
                "name": "...args",
                "type": "any",
                "min":1,
                "required": true
            },
        ],
        "return": "boolean"
    },
    "OR": {
        "params": [
            {
                "name": "...args",
                "type": "any",
                "min":1,
                "required": true
            },
        ],
        "return": "boolean"
    },
}