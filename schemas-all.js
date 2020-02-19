const foodieSchema = {
    "id": "/Foodie",
    "type": "object",
    "properties":{
        "name": {"type":"string"},
        "cuisine": {"type": "array", "items": { "type": "string", "enum": ["Chinese","Indian","Western","Cantonese","Malay"]}},
        "cooking-type": {"type": "array", "items": { "type": "string", "enum": ["Braised","Steam","Fried"]}},
        "food-type": {"type": "array", "items": { "type": "string", "enum": ["Dinner","Appetizer","Dessert","Breakfast"]}},
        "address": {"$ref": "/Address"}
    },
    "required": ["name", "cuisine", "cooking-type", "food-type", "address"]
};

const addressSchema = {
    "id": "/Address",
    "type": "object",
    "properties":{
        "area": {"type":"string", "enum":["North", "South", "East", "West", "North-West", "North-East", "South-East","South-West"]},
        "street-address": {"type": "string"}
    },
    "required": ["area", "street-address"]
};

module.exports = {foodieSchema, addressSchema};
