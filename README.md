# See2Teach

> Group 9 - Scrumbledore's Army

See2Teach is a web application for supporting the peer review of teaching in the University of Auckland. The overall goal of this project is to create a refined peer review system that teachers can utilise to improve their teaching.

The application is currently hosted at http://10.6.4.63/. You must be connected to the UoA VPN (FortiClient) to access it.

A user manual describing the applications functionality is available [here](User-Documentation.md).

## Team Overview

| Full Name     | Role         | UPI     | Email                     |
| ------------- | ------------ | ------- | ------------------------- |
| Andy Huang    | Scrum Master | ahua049 | ahua049@aucklanduni.ac.nz |
| Ammol Thapar  | Team Member  | atha969 | atha969@aucklanduni.ac.nz |
| Jigao Zeng    | Team Member  | jzen557 | jzen557@aucklanduni.ac.nz |
| Jacinta Zhang | Team Member  | jzha700 | jzha700@aucklanduni.ac.nz |
| Kevin Ge      | Team Member  | jge385  | jge385@aucklanduni.ac.nz  |
| Xinyi Guo     | Team Member  | xguo679 | xguo679@aucklanduni.ac.nz |
| Yuxin Chen    | Team Member  | yche864 | yche864@aucklanduni.ac.nz |

## Project Setup

### Run the project locally

Ensure that you have:

- Installed [Node.js](https://nodejs.org/en/download/)
- Cloned the repository from GitHub: `git clone https://github.com/SoftEng761-2021/project-project-team-9.git`

1. Create a `.env` file in the backend directory that contains the following (Change the database server details accordingly if you are using another database):

```
PORT=8080

PGHOST=ec2-44-195-209-130.compute-1.amazonaws.com
PGDATABASE=dkbejclnbrmrg
PGUSER=bpsqbmqzfwigdi
PGPASSWORD=c1b1578c7d3a54f1661327360e8f359b074dffd1fc8935b563028bce2b10f5f9
PGPORT=5432
PGSSLMODE=no-verify
```

2. Run the following commands from the backend directory to start the server:
   `npm install`
   `npm start`
   <br>
3. Create a `.env` file in the frontend directory that contains the following:

```
REACT_APP_API_URL=http://localhost:8080/api
```

4. Run the following commands from the frontend directory to start the server:
   `npm install`
   `npm start`

### Setting up on a new database

The following are instructions if you wish you use another database (ensure that it is PostgreSQL).

1. Navigate to the backend folder
2. Change the database information in the `.env` file in order to use your new database.
3. On an empty database, run the following command to set up the database tables:
   `npm run migrate`
4. Run the following to populate the tables with the required data (aspects and questionnaire prompts)
   `npm run seed`

### Deploying the application (Ubuntu)

Ensure that you have:

- Setup Nginx (along with firewalls set up to allow connections) https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
- Installed [Node.js](https://nodejs.org/en/download/)
- [pm2](https://www.npmjs.com/package/pm2)

1. Clone the project
2. Setup the Nginx config file (`/etc/nginx/sites-available/default`) with the following:

```
server {
  listen 80 default_server;
  server_name _;

  location / {
    proxy_pass http://localhost:8080/;
  }
}
```

3. From the frontend directory, ensure that you have a `.env` file with the following:
   `REACT_APP_API_URL=/api`
4. Run the command below to build the frontend
   `npm run build`
5. Create a `.env` file in the backend directory that contains the following (Change the database server details accordingly if you are using another database):

```
PORT=8080

PGHOST=ec2-44-195-209-130.compute-1.amazonaws.com
PGDATABASE=dkbejclnbrmrg
PGUSER=bpsqbmqzfwigdi
PGPASSWORD=c1b1578c7d3a54f1661327360e8f359b074dffd1fc8935b563028bce2b10f5f9
PGPORT=5432
PGSSLMODE=no-verify
```

6. In the backend folder, create a `ecosystems.config.js` file that contains the following:
   ```
   module.exports = {
   apps : [
      {
        name: "See2Teach",
        script: "./src/server.js",
        node_args: "-r esm"
        watch: true,
        env: {
            "PORT": 8080,
            "NODE_ENV": "production"
        },
      }
   ]
   }
   ```
7. In the backend folder, start the application by running: `pm2 start ecosystems.config.js`
