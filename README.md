# Proyecto_Express_S1_SalamancaDante-SaavedraJuan-backend

<h3 align="center";>

**MOVIE WEBSITE KARENFLIX**

</h3>

<br>
<br>
<br>

<h3 align="center";>

**Juan David Saavedra Jaimez**

</h3>

<h3 align="center";>

**Simón Dante Salamanca Galvis**

</h3>

<br>x
<br>
<br>
<br>

<h3 align="center";>

**S1**

</h3>

<h3 align="center";>

**Pedro Felipe Gómez Bonilla**

</h3>

<br>
<br>
<br>
<br>

<h3 align="center";>

**CAMPUSLANDS**

</h3>

<h3 align="center";>

**RUTA NODE**

</h3>

<h3 align="center";>

**BUCARAMANGA, SANTANDER**

</h3>

<h3 align="center";>

**2025**

</h3>

---

## Descripción 

El objetivo de este proyecto es desarrollar una aplicación de línea de comandos (CLI) usando Node.js.

La aplicación debe:

- Estar desarrollada completamente en **Node.js**, aplicando **Programación Orientada a Objetos**.

- Aplicar **principios SOLID** y al menos **dos patrones de diseño.**

- Usar **librerías npm** que mejoren la experiencia por consola (como chalk, inquirer, dotenv, entre otras).

- Persistir los datos en **MongoDB**, usando el driver oficial mongodb (no mongoose), y realizar operaciones con **transacciones reales.**

- Contar con una carpeta específica /models con la **definición del modelo de datos**, usando objetos JavaScript que incluyan validaciones por campo (tipo de dato, requeridos, formatos, rangos, etc.).


## Instrucciones de Instalación y uso 

1. **Requisitos Previos**

Antes de instalar y ejecutar el proyecto asegúrate de tener:

- Node.js versión 16 o superior instalado.

- npm (se instala junto con Node.js).

- Una base de datos MongoDB (local o en la nube con MongoDB Atlas).

2. **Clonar el Repositorio**

Clona el proyecto desde GitHub: 

```
git clone https://github.com/Dante-Sal/Proyecto_Express_S1_SalamancaDante-SaavedraJuan-backend
```
```
cd Proyecto_Express_S1_SaavedraJuan_SalamancaDante
```
3. **Instalar Dependencias** 

Ejecuta el siguiente comando para instalar todas las librerías listadas en package.json:

```
npm install
```
Esto instalará:

- **argon2** → para encriptación de contraseñas.
- **chalk** → para dar color a los mensajes en consola.
- **dotenv** → para gestionar variables de entorno.
- **inquirer** → para menús y preguntas interactivas en consola.
- **mongodb** → para la conexión con la base de datos MongoDB.
- **nodemon** → para reiniciar automáticamente la app en desarrollo

4. **Configuración de Variables de Entorno**

Crea un archivo llamado .env en la raíz del proyecto con las credenciales necesarias:

```
URI='mongodb+srv://user:password@cluster/'
DATABASE="nombre_base_de_datos"
```

5. **Ejecutar la Aplicación**

Modo Normal: 

```
node app.js
```

Modo Atajo:

```
npm run .
```

6. **Uso del Proyecto**

- Al iniciar la aplicación se cargará el archivo app.js.

- Se podrá interactuar con el sistema desde la terminal mediante Inquirer (menús y opciones).

- Las operaciones estarán registradas en MongoDB.

- Las contraseñas de usuarios se guardarán encriptadas con argon2 para mayor seguridad.

## Estructura del Proyecto 

```
├── config
├── app.js
├── controllers
│   └── userController.js
├── db.js
├── ddl.js
├── dml.js
├── README.md
├── repositories
│   └── userRepository.js
├── routes
│   └── index.js
│   └── userRoutes.js
├── services
│   └── userService.js
├── swagger
│   └── swagger.js
├── utils
│   └── generalUtils.js
│   └── userUtils.js
└── env_example
    └── .gitignore
    └── app.js
    └── package-lock.json
    └── package.json
    └── README.md
```


## Principios SOLID Aplicados

**S – Single Responsibility Principle (SRP)**

Cada clase o módulo debe tener **una sola responsabilidad**. Esto significa que solo debe haber **una razón para cambiar** la clase.

**O – Open/Closed Principle (OCP)**

Las entidades deben estar **abiertas para extensión** (puedes agregar funcionalidades) pero **cerradas para modificación** (no modificar código existente).

**L – Liskov Substitution Principle (LSP)**

Las subclases deben poder **sustituir a su clase base** sin alterar el correcto funcionamiento del programa.

**I – Interface Segregation Principle (ISP)**

Las interfaces deben ser **específicas y pequeñas**, evitando que las clases implementen métodos que no necesitan.

**D – Dependency Inversion Principle (DIP)**

Las clases deben depender de **abstracciones** (interfaces o clases abstractas), no de implementaciones concretas.

**Aplicación en el código**

```
const jwt = require('jsonwebtoken');
const { UserRepository } = require('../repositories/userRepository');
const { UserUtils } = require('../utils/userUtils');
const { UsersStatusRepository } = require('../repositories/usersStatusRepository');

// ================================
// S – Single Responsibility Principle (SRP)
// Cada clase tiene una única responsabilidad.
// UserTypeValidator valida tipos de datos.
// UserPatternValidator valida formatos (regex).
// UserService gestiona la lógica de negocio de usuarios.
// ================================

class UserValidator {
    setNext(next) { this.next = next; return next; }
    async validate(ctx) {
        await this._validate(ctx);
        if (this.next) return this.next.validate(ctx);
    }
    async _validate(ctx) { } // Método abstracto
}

class UserTypeValidator extends UserValidator {
    constructor(schema) { super(); this.schema = schema; }
    async _validate(ctx) {
        for (const key in this.schema) {
            const expectedType = this.schema[key][0];
            if (Array.isArray(expectedType)) {
                if (!expectedType.includes(typeof ctx[key])) {
                    throw new Error(`Tipo de dato inválido en '${key}'`);
                }
            } else {
                if (typeof ctx[key] !== expectedType) {
                    throw new Error(`Tipo de dato inválido en '${key}'`);
                }
            }
        }
    }
}

class UserPatternValidator extends UserValidator {
    constructor(schema) { super(); this.schema = schema; }
    async _validate(ctx) {
        for (const key in this.schema) {
            if (ctx[key] === undefined) continue;
            if (!this.schema[key][1].test(ctx[key])) {
                throw new Error(`Formato inválido en '${key}'`);
            }
        }
    }
}

// ================================
// O – Open/Closed Principle (OCP)
// Las clases están abiertas a extensión pero cerradas a modificación.
// Se pueden crear nuevos validadores sin modificar las clases existentes.
// ================================

// Ejemplo: se podría agregar otro validador como UserLengthValidator heredando de UserValidator
class UserLengthValidator extends UserValidator {
    constructor(schema) { super(); this.schema = schema; }
    async _validate(ctx) {
        for (const key in this.schema) {
            if (ctx[key] && ctx[key].length > this.schema[key].maxLength) {
                throw new Error(`Longitud máxima excedida en '${key}'`);
            }
        }
    }
}

// ================================
// L – Liskov Substitution Principle (LSP)
// Las subclases UserTypeValidator y UserPatternValidator pueden reemplazar a UserValidator
// sin afectar la lógica del sistema.
// ================================

// ================================
// I – Interface Segregation Principle (ISP)
// Cada clase implementa solo los métodos que necesita (_validate y validate), evitando métodos innecesarios.
// ================================

// ================================
// D – Dependency Inversion Principle (DIP)
// UserService depende de abstracciones (UserValidator) y no de implementaciones concretas.
// Esto permite cambiar o extender validadores sin modificar UserService.
// ================================

class UserService {
    constructor() {
        this.repository = new UserRepository();
        this.statusRepository = new UsersStatusRepository();
        this.schema = {
            first_name: [`string`, /^[a-zA-Z]{2,50}$/],
            second_name: [[`string`, `undefined`], /^[a-zA-Z]{2,50}$/],
            first_surname: [`string`, /^[a-zA-Z]{2,50}$/],
            second_surname: [`string`, /^[a-zA-Z]{2,50}$/],
            email: [`string`, /^[^\s@]+@[^\s@]+\.[^\s@]+$/],
            username: [`string`, /^[a-zA-Z0-9._]{3,30}$/],
            password: [`string`, /^\S{8,}$/],
            avatar_url: [[`string`, `undefined`], /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i]
        };
        this.loginSchema = {
            email: [`string`, /^[^\s@]+@[^\s@]+\.[^\s@]+$/],
            password: [`string`, /^\S{8,}$/]
        };
    }

    async validateUser(user) {
        const userTypeV = new UserTypeValidator(this.schema);
        const userPattV = new UserPatternValidator(this.schema);
        
        // Chain of Responsibility: encadena validaciones
        userTypeV.setNext(userPattV);
        
        await userTypeV.validate(user);
    }

    async validateLogin(payload) {
        const userTypeV = new UserTypeValidator(this.loginSchema);
        const userPattV = new UserPatternValidator(this.loginSchema);
        
        // Chain of Responsibility: encadena validaciones
        userTypeV.setNext(userPattV);
        
        await userTypeV.validate(payload);
    }

    normalizeRegistrationFields(user) {
        user = UserUtils.trimAll(user);
        user.email = UserUtils.lowercase(user.email);
        user.username = UserUtils.lowercase(user.username);

        return user;
    }

    validateRegistrationRequiredFields(user) {
        const keys = Object.keys(user);

        if (!keys.length) UserUtils.throwError(400, 'Invalid request (insufficient data in the body)');
        if (!keys.includes('first_name')) UserUtils.throwError(400, 'Invalid request (body without \'first_name\' included)');
        if (!keys.includes('first_surname')) UserUtils.throwError(400, 'Invalid request (body without \'first_surname\' included)');
        if (!keys.includes('second_surname')) UserUtils.throwError(400, 'Invalid request (body without \'second_surname\' included)');
        if (!keys.includes('email')) UserUtils.throwError(400, 'Invalid request (body without \'email\' included)');
        if (!keys.includes('username')) UserUtils.throwError(400, 'Invalid request (body without \'username\' included)');
        if (!keys.includes('password')) UserUtils.throwError(400, 'Invalid request (body without \'password\' included)');
    }

    validateLoginRequiredFields(payload) {
        const keys = Object.keys(payload);

        if (!keys.length) UserUtils.throwError(400, 'Invalid request (insufficient data in the body)');
        if (!keys.includes('email')) UserUtils.throwError(400, 'Invalid request (body without \'email\' included)');
        if (!keys.includes('password')) UserUtils.throwError(400, 'Invalid request (body without \'password\' included)');
    }

    validateJWTparameters(secret, expiresIn) {
        if (!secret) UserUtils.throwError(400, 'Invalid request (undefined environment variable \'secret\')');
        expiresIn = UserUtils.isTimeString(expiresIn) ? (Number.isFinite(parseInt(expiresIn.trim())) ? parseInt(expiresIn) : expiresIn) : '1h';
        return { secret, expiresIn };
    }

    async validateRegistrationFieldsUniqueness(user) {
        const emailExists = await this.repository.findPublicByEmail(user.email);
        if (emailExists) UserUtils.throwError(409, 'Conflict (\'email\' already registered in the database)');

        const usernameExists = await this.repository.findPublicByUsername(user.username);
        if (usernameExists) UserUtils.throwError(409, 'Conflict (\'username\' already registered in the database)');
    }

    defineAvatar(user) {
        if (user.avatar_url == null || user.avatar_url == '') return user.role === 'admin' ? 'https://i.postimg.cc/XNHhZdnf/admin-purple.png' : 'https://i.postimg.cc/76qczNCV/user-purple.png';
        else return user.avatar_url;
    }

    async searchDefaultStatus(initialStatusName) {
        const statusDoc = await this.statusRepository.findByName(initialStatusName);
        if (!statusDoc) UserUtils.throwError(500, 'Database error (user status \'active\' does not exist)');
        if (!statusDoc.code) UserUtils.throwError(500, 'Database error (user status \'active\' does not have the \'code\' field)');

        return statusDoc.code;
    }

    async validateRegistration(user) {
        if (!UserUtils.isPlainObject(user)) UserUtils.throwError(400, 'Invalid request (bodiless)');
        this.validateRegistrationRequiredFields(user);
        await this.validateUser(user);
        user = this.normalizeRegistrationFields(user);
        await this.validateRegistrationFieldsUniqueness(user);

        return user;
    }

    async verifyCredentials(payload) {
        if (!UserUtils.isPlainObject(payload)) UserUtils.throwError(400, 'Invalid request (bodiless)');
        this.validateLoginRequiredFields(payload);
        await this.validateLogin(payload);

        const statusCode = await this.searchDefaultStatus('active');
        const credentials = await this.repository.findCredentialsByEmailStatusCode(payload.email, statusCode);
        if (!credentials) UserUtils.throwError(401, 'Invalid request (incorrect \'email\' or \'password\')');

        const authorized = await UserUtils.verify(payload.password, credentials.password_hash);
        if (!authorized) UserUtils.throwError(401, 'Invalid request (incorrect \'email\' or \'password\')');

        return credentials;
    }

    async register(user) {
        user = await this.validateRegistration(user);

        const names = { first_name: user.first_name };
        const creationDate = new Date();

        if (user.second_name) names.second_name = user.second_name;

        user = {
            ...names,
            first_surname: user.first_surname,
            second_surname: user.second_surname,
            email: user.email,
            username: user.username,
            password_hash: await UserUtils.hash(user.password),
            password_updated_at: creationDate,
            role: user.role,
            avatar_url: this.defineAvatar(user),
            status_code: await this.searchDefaultStatus('active'),
            created_at: creationDate,
            updated_at: creationDate
        };

        const InsertOneResult = await this.repository.create(user);
        const { password_hash, password_updated_at, status_code, updated_at, ...publicUser } = user;

        return { status: 201, data: { _id: InsertOneResult.insertedId, ...publicUser } };
    }

    async signIn(payload) {
        const { _id, role } = await this.verifyCredentials(payload);
        const { secret, expiresIn } = this.validateJWTparameters(process.env.JWT_SECRET, process.env.JWT_EXPIRES);
        const token = jwt.sign({ _id, role }, secret, { expiresIn });

        return { status: 200, token };
    }
}

module.exports = { UserService, UserValidator, UserTypeValidator, UserPatternValidator };

```


## Patrones de Diseño Usados y Donde

1. **Chain of responibilty**

Chain of Responsibility (Cadena de Responsabilidad) es un patrón de diseño de comportamiento que permite pasar una solicitud a lo largo de una cadena de objetos hasta que uno de ellos pueda manejarla. En otras palabras, se desacopla el emisor de la solicitud del receptor, dejando que múltiples objetos tengan la oportunidad de procesarla.

- Idea Principal: Cada objeto en la cadena decide si maneja la solicitud o la pasa al siguiente objeto.

**Funcionamiento**

1. Se define una cadena de objetos receptores.

2. Una solicitud se envía al primer objeto de la cadena.

3. Cada receptor:
    - Puede manejar la solicitud y detener la propagación.
    - Puede pasar la solicitud al siguiente receptor si no puede manejarla.

4. La solicitud continúa a lo largo de la cadena hasta que algún objeto la maneje o llegue al final.

**Componentes**

1. Handler (Manejador)

    - Define una interfaz para manejar solicitudes.

    - Mantiene una referencia al siguiente handler en la cadena.

2. ConcreteHandler (Manejador Concreto)

    - Implementa la lógica para manejar la solicitud específica.

    - Decide si pasa la solicitud al siguiente handler.

3. Client (Cliente)

- Crea la cadena de handlers y envía la solicitud.

**Ventajas**

- Desacopla el emisor del receptor.

- Permite agregar nuevos handlers sin modificar el código existente.

- Mejora la flexibilidad y escalabilidad del sistema.

- Facilita la reutilización de código.

**Desventajas**

- La solicitud puede recorrer toda la cadena sin ser atendida, generando desperdicio de recursos.

- La depuración puede ser más difícil debido al flujo indirecto de la solicitud.

2. **State** 

El patrón State es un patrón de diseño de comportamiento que permite que un objeto cambie su comportamiento cuando su estado interno cambia. En lugar de tener grandes condicionales (if/else o switch) para decidir qué hacer según el estado, el objeto delegará el comportamiento a un objeto de estado concreto.

Idea principal: El objeto parece cambiar de clase cuando cambia su estado.

**Funcionamineto**

1. Se define un Contexto que mantiene una referencia a un Estado actual.

2. Cada Estado define un comportamiento específico.

3. El Contexto delega las solicitudes al Estado actual.

4. Cambiar el estado del contexto permite modificar dinámicamente el comportamiento sin alterar la clase del contexto.

**Componente**

1. Context (Contexto)

- Mantiene una referencia al estado actual.

- Proporciona la interfaz para que los clientes interactúen.

2. State (Estado)

- Define la interfaz de comportamiento que deben implementar todos los estados.

3. ConcreteState (Estado Concreto)

- Implementa un comportamiento específico para un estado.

- Puede cambiar el estado del contexto según sea necesario.

**Ventajas**

- Evita condicionales complejos que dependen del estado.

- Desacopla el comportamiento del estado del objeto principal.

- Facilita agregar nuevos estados sin modificar el código existente.

- Mejora la legibilidad y mantenimiento del código.

**Desventajas**

- Puede generar un mayor número de clases, aumentando la complejidad estructural.

- La transición entre estados puede ser difícil de seguir si hay muchos estados.


## Consideraciones técnicas

1. **Tipo de proyecto**

   * Proyecto Node.js con **CommonJS** (`"type": "commonjs"`), lo que significa que se usan `require()` y `module.exports` en lugar de `import/export`.

2. **Archivo principal**

   * El punto de entrada es `app.js` (`"main": "app.js"`).

3. **Gestión de dependencias**

   * Se utilizan varias dependencias:

     * **argon2**: Para hash de contraseñas seguro.
     * **chalk**: Para colorear la salida en consola y mejorar la visualización.
     * **dotenv**: Para manejar variables de entorno desde un archivo `.env`.
     * **inquirer**: Para interactuar con el usuario mediante menús y prompts en la terminal.
     * **mongodb**: Driver oficial para conexión con MongoDB.
     * **nodemon**: Herramienta de desarrollo que reinicia automáticamente la app al detectar cambios.
     * **readline**: Para leer entrada del usuario desde consola.

4. **Scripts**

   * `"test"`: Script predeterminado sin pruebas implementadas.
   * `"."`: Script personalizado para ejecutar la aplicación (`node app.js`).

5. **Seguridad y buenas prácticas**

   * Se usa **.env** para almacenar credenciales de MongoDB y claves secretas.
   * Las contraseñas son hasheadas con `argon2`.

6. **Consideraciones de ejecución**

   * Ejecutar la app mediante:

     ```bash
     npm run .
     ```
   * Asegurarse de tener MongoDB corriendo o conexión a MongoDB Atlas.

## FrontEnd

Link al repositorio del FrontEnd de este proyecto 
[FrontEnd](https://github.com/Dante-Sal/Proyecto_Express_S1_SalamancaDante-SaavedraJuan-frontend)

## Video 

[https://drive.google.com/drive/folders/1z8iBOCJA8YhqfB24m8hFtC1IQ2rJhpwY?usp=sharing](https://drive.google.com/drive/folders/1z8iBOCJA8YhqfB24m8hFtC1IQ2rJhpwY?usp=sharing)

# Desarrollado Por

Juan David Saavedra Jaimez - [Linkedin](https://www.linkedin.com/in/juan-david-saavedra-jaimez-636239374/) - [Github](https://github.com/wilskirby)

Simón Dante Salamanca Galvis - [Linkedin](https://www.linkedin.com/in/dante-salamanca-galvis-5370b2356/) - [Github](https://github.com/Dante-Sal)

