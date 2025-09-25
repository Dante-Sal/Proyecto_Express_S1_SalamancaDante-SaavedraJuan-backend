//users schema

db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["first_name", "first_surname", "second_surname", "email", "username", "password_hash", "password_updated_at", "role", "avatar_url", "status_code", "created_at", "updated_at"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                first_name: {
                    bsonType: "string",
                    pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,50}$"
                },
                second_name: {
                    bsonType: "string",
                    pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,50}$"
                },
                first_surname: {
                    bsonType: "string",
                    pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,50}$"
                },
                second_surname: {
                    bsonType: "string",
                    pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,50}$"
                },
                email: {
                    bsonType: "string",
                    pattern: "^(?!.*\\.\\.)([a-z0-9]|[a-z0-9][a-z0-9._+-]*[a-z0-9])@([a-z0-9]|[a-z0-9][a-z0-9.-]*[a-z0-9])\.[a-z]{2,}$"
                },
                username: {
                    bsonType: "string",
                    pattern: "^[a-z0-9._]{3,30}$"
                },
                password_hash: {
                    bsonType: "string",
                    //Insertar la siguiente línea en el JSON schema tras hashear las contraseñas
                    //proveídas en dml.js
                    
                    //pattern: "^\\$2[aby]\\$(0[4-9]|1\\d|2\\d|3[01])\\$[./A-Za-z0-9]{53}$"
                    
                    //Para hashear la contraseña inicie la ejecución de la aplicación con el
                    //comando: npm i && npm start
                },
                password_updated_at: {
                    bsonType: "date"
                },
                role: {
                    bsonType: "string",
                    enum: [
                        "admin",
                        "user"
                    ]
                },
                avatar_url: {
                    bsonType: "string",
                    pattern: "^https?:\\/\\/[^\\s?#]+?\\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff)(\\?[^#\\s]*)?(#\\S*)?$"
                },
                status_code: {
                    bsonType: "int",
                    minimum: 0
                },
                created_at: {
                    bsonType: "date"
                },
                updated_at: {
                    bsonType: "date"
                }
            },
            additionalProperties: false
        }
    }
});

//users indexes

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

//users status schema

db.createCollection("users_status", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['code', 'status'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                code: {
                    bsonType: 'int',
                    minimum: 0
                },
                status: {
                    bsonType: 'string',
                    'enum': [
                        'active',
                        'suspended'
                    ]
                }
            },
            additionalProperties: false
        }
    }
});

//users status indexes

db.users_status.createIndex({ code: 1 }, { unique: true });
db.users_status.createIndex({ status: 1 }, { unique: true });

//reviews schema

db.createCollection("reviews", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "score", "review", "catalog_id", "user_id", "likes", "dislikes"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                title: {
                    bsonType: "string",
                    minLength: 2,
                    maxLength: 80
                },
                score: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 5
                },
                review: {
                    bsonType: "string",
                    minLength: 3,
                    maxLength: 1000
                },
                catalog_id: {
                    bsonType: "objectId"
                },
                user_id: {
                    bsonType: "objectId"
                },
                likes: {
                    bsonType: "int",
                    minimum: 0
                },
                dislikes: {
                    bsonType: "int",
                    minimum: 0
                }
            },
            additionalProperties: false
        }
    }
});

//reviews indexes

db.reviews.createIndex({ catalog_id: 1, user_id: 1 }, { unique: true });

//catalog schema

db.createCollection("catalog", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["code", "type", "title", "overview", "original_language", "adult", "status_code", "avg_score", "score_count", "ranking", "popularity", "created_by", "approved_by", "created_at", "updated_at"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                code: {
                    bsonType: "int",
                    minimum: 0
                },
                type: {
                    bsonType: "string",
                    enum: [
                        "movie",
                        "serie"
                    ]
                },
                title: {
                    bsonType: "string",
                    minLength: 1,
                    maxLength: 80,
                },
                overview: {
                    bsonType: "string",
                    minLength: 0,
                    maxLength: 2000
                },
                poster_url: {
                    bsonType: "string",
                    pattern: "^https?:\\/\\/[^\\s?#]+?\\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff)(\\?[^#\\s]*)?(#\\S*)?$"
                },
                backdrop_url: {
                    bsonType: "string",
                    pattern: "^https?:\\/\\/[^\\s?#]+?\\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff)(\\?[^#\\s]*)?(#\\S*)?$"
                },
                original_language: {
                    bsonType: "string",
                    pattern: "^[a-z]{2}$"
                },
                adult: {
                    bsonType: "bool"
                },
                status_code: {
                    bsonType: "int",
                    minimum: 0
                },
                release_date: {
                    bsonType: "date"
                },
                runtime: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 180
                },
                first_air_date: {
                    bsonType: "date"
                },
                episode_runtime_avg: {
                    bsonType: "decimal",
                    minimum: 1,
                    maximum: 150
                },
                number_of_seasons: {
                    bsonType: "int",
                    minimum: 1
                },
                number_of_episodes: {
                    bsonType: "int",
                    minimum: 2
                },
                avg_score: {
                    bsonType: "decimal",
                    multipleOf: 0.1,
                    minimum: 1,
                    maximum: 5
                },
                score_count: {
                    bsonType: "int",
                    minimum: 0
                },
                ranking: {
                    bsonType: "decimal",
                    multipleOf: 0.01,
                    minimum: 0
                },
                popularity: {
                    bsonType: "decimal",
                    multipleOf: 0.01,
                    minimum: 0
                },
                created_by: {
                    bsonType: "objectId"
                },
                approved_by: {
                    bsonType: "objectId"
                },
                created_at: {
                    bsonType: "date"
                },
                updated_at: {
                    bsonType: "date"
                }
            },
            oneOf: [
                {
                    required: ["release_date", "runtime"],
                    properties: {
                        type: {
                            enum: ["movie"]
                        }
                    },
                    not: {
                        required: ["first_air_date", "episode_runtime_avg", "number_of_seasons", "number_of_episodes"]
                    }
                },
                {
                    required: ["first_air_date", "episode_runtime_avg", "number_of_seasons", "number_of_episodes"],
                    properties: {
                        type: {
                            enum: ["serie"]
                        }
                    },
                    not: {
                        required: ["release_date", "runtime"]
                    }
                }
            ],
            additionalProperties: false
        }
    }
});

//catalog indexes

db.catalog.createIndex({ code: 1 }, { unique: true });
db.catalog.createIndex({ poster_url: 1 }, { unique: true, partialFilterExpression: { poster_url: { $exists: true } } });
db.catalog.createIndex({ backdrop_url: 1 }, { unique: true, partialFilterExpression: { backdrop_url: { $exists: true } } });
db.catalog.createIndex({ title: 1 }, { unique: true, partialFilterExpression: { $and: [{ title: { $exists: true, $type: "string" } }, { $or: [{ title: { $gt: "Pending title" } }, { title: { $lt: "Pending title" } }] }] } });

//catalog status schema

db.createCollection("catalog_status", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["code", "status"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                code: {
                    bsonType: "int",
                    minimum: 0
                },
                status: {
                    bsonType: "string",
                    enum: [
                        "approved",
                        "pending_approval",
                        "rejected"
                    ]
                }
            },
            additionalProperties: false
        }
    }
});

//catalog status indexes

db.catalog_status.createIndex({ code: 1 }, { unique: true });
db.catalog_status.createIndex({ status: 1 }, { unique: true });

//titles-genres schema (intermediary collection between catalog and genres)

db.createCollection("titles_genres", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title_code", "genre_code"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                title_code: {
                    bsonType: "int",
                    minimum: 0
                },
                genre_code: {
                    bsonType: "int",
                    minimum: 0
                }
            }
        }
    }
});

//titles-genres indexes

db.titles_genres.createIndex({ title_code: 1, genre_code: 1 }, { unique: true });

//genres schema

db.createCollection("genres", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["code", "name"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                code: {
                    bsonType: "int",
                    minimum: 0
                },
                name: {
                    bsonType: "string",
                    pattern: "^(?=.{3,32}$)[a-zA-Z]+([ '-][a-zA-Z]+)*$"
                },
                icon: {
                    bsonType: "string",
                    pattern: "^https?:\\/\\/[^\\s?#]+?(\\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff)(\\?[^#\\s]*)?|\\?(?=[^#\\s]*\\bformat=(png|jpe?g|gif|webp|svg|bmp|ico|tiff))[^#\\s]*)(#\\S*)?$"
                }
            }
        }
    }
});

//genres indexes

db.genres.createIndex({ code: 1 }, { unique: true });
db.genres.createIndex({ name: 1 }, { unique: true });

//titles-networks schema (intermediary collection between catalog and networks)

db.createCollection("titles_networks", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title_code", "network_code"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                title_code: {
                    bsonType: "int",
                    minimum: 0
                },
                network_code: {
                    bsonType: "int",
                    minimum: 0
                }
            }
        }
    }
});

//titles-networks indexes

db.titles_networks.createIndex({ title_code: 1, network_code: 1 }, { unique: true });

//networks schema

db.createCollection("networks", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["code", "name"],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                code: {
                    bsonType: "int",
                    minimum: 0
                },
                name: {
                    bsonType: "string",
                    pattern: "^(?=.{2,30}$)[a-zA-Z0-9]+([ '-][a-zA-Z0-9]+)*$"
                }
            }
        }
    }
});

//networks indexes

db.networks.createIndex({ code: 1 }, { unique: true });
db.networks.createIndex({ name: 1 }, { unique: true });