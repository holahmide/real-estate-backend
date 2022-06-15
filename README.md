# Getting Started with Real Estate Management API
> The project provides api to manage real Estate buildings, sections, plans and tenants.

> The project uses NodeJs (NPM) and MySql Database.
#### Setup codebase

```
git clone https://github.com/holahmide/real-estate-backend.git real-estate

cd real-estate

npm install

```

#### Setup database

- Install mysql database on your system.
- Run mysql process at the background.
- Create a database for the project (Get Name, Password and Host)

#### Add enviromental variables

```
touch .env
nano .env
```

Add the properties in the `.env.example` file to the `.env` file

```
Select a PORT for the app to run on your local machine (e.g 8000).
Fill in the correct DB data.
Generate a jwt token for the project.
```

### Running application

```
# for development testing
npm run dev

# for production testing
npm run start

```
### Contributions

Feel free to clone, add improvements and open pull requests.
