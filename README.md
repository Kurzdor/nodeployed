<div align="center">
  <h1>📦 nodeployed</h1>
  Automatically deploy your code to server after push to repository.
</div>

<hr />

[![NPM version](https://img.shields.io/npm/v/nodeployed.svg?style=for-the-badge)](https://www.npmjs.com/package/nodeployed)
[![License](https://img.shields.io/npm/l/nodeployed.svg?style=for-the-badge)](https://github.com/Kurzdor/nodeployed/blob/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=for-the-badge)](#contributors)


## Another deployer?!

I wanted to make easily the process of deploying code to server on each push to repository. I tried almost all suggested ways to do it but they didn't work. So I created this package. It supports Ubuntu servers and GitHub/GitLab/Bitbucket repos.

## Uses

Nodeployed uses [Fastify](https://www.fastify.io) as Node.js server, [Execa](https://github.com/sindresorhus/execa) to run such commands to deploy code and [Minimist](https://github.com/substack/minimist) to parse command arguments.

## Server preparation

To be able to use it sucessfully, you need:

- Install Node.js and npm on your server

* Setup your Apache/NGINX server to _reverse proxy_ all requests to `http://localhost:YOUR_PORT` in `location` block:

* For `NGINX` change your server block config to something like this:

```nginx
# Your server in /etc/nginx/sites-available/example.com
server {
...
    location /deploy/ {
        proxy_pass http://localhost:YOUR_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
...
}
```

- For `Apache2`:

```apache
<VirtualHost *:*>
    ProxyPass /deploy/ http://0.0.0.0:3000/
    ServerName localhost
</VirtualHost>
```

- Optionally: [Install LetsEncrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04) on that domain that you will use.
- Clone repository that you want to work with with `git clone`
- Run `sudo chown -R yourusername:webserverusername you-repo-dir-name/` for your repository directory to make script able to fully use `git` commands.

## Usage

Install package globally from `NPM repo` via `npm` and start the process with [pm2](http://pm2.keymetrics.io/):

```sh
$ npm i -g nodeployed pm2
$ pm2 start nodeployed -- --port 8234 --dir /absolute/path/to/git/dir/ --command "command1_to_run && command2_to_run ..."
```

Go to `http://example.com/deploy`.
If script is properly working then you should see this message:

```plain
Nodeployed is working! You should set this link in your Webhooks configuration for your repository!
```

We will configure our repository later in `Configure repository for nodeployed` section.

Also if you want to run `nodeployed` as system service `pm2` can help you. For that run next commands:

```sh
$ pm2 startup systemd
```

And then `copy the command from the output` and run it, example:

```sh
$ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u user --hp /home/user
```

You can save current configuration of running applications if you run multiple instances of `nodeployed`:

```sh
$ pm2 save
```

Then you can see the status of `pm2 system service` by running:

```sh
$ systemctl status pm2-user
```

or start it:

```sh
$ sudo systemctl start pm2-user
```

or stop it by running next command:

```sh
$ sudo systemctl stop pm2-user
```

where user – username that gave you `pm2` from running the `pm2 startup systemd` command.

## Configure repository for nodeployed

### GitHub:

1. Go to the directory for which you would like to setup autodeploy to your server.
2. Go to `Settings` page.
3. Go to `Webhooks` page => `Add webhook`.
4. Type in your GitHub password if prompted
5. Setup webhook:

- Payload: http://example.com/deploy/?token=YOUR_TOKEN_FROM_ARGUMENT
- Content Type: application/json
- Which events would you like to trigger this webhook? Just the push event.
- Active: check it
- Press `Add webhook`

6. Now on any push to this GitHub repository `nodeployed` should pull changes on server and run deploy commands.

### GitLab:

1. Go to the directory for which you would like to setup autodeploy to your server.
2. Go to `Settings` => `Integrations`.
3. Setup webhook:

- URL: http://example.com/deploy/?token=YOUR_TOKEN_FROM_ARGUMENT
- Secret Token: `leave it empty`
- Trigger events: Push events
- Enable SSL verification: check it if you have installed `LetsEncrypt`
- Press `Add webhook`

4. Now on any push to this GitLab repository `nodeployed` should pull changes on server and run deploy commands.

### Bitbucket:

1. Go to the directory for which you would like to setup autodeploy to your server.
2. Go to `Settings` => `Webhooks` => `Add webhook`.
3. Setup webhook:

- Title: any value, e.g. `nodeployed` to recognize it
- URL: http://example.com/deploy/?token=YOUR_TOKEN_FROM_ARGUMENT
- Skip certificate verification: check it if you haven't installed `LetsEncrypt`
- Enable request history collection: check it
- Triggers: Repository push
- Press `Save`

4. Now on any push to this Bitbucket repository `nodeployed` should pull changes on server and run deploy commands.


## Options

### --port [PORT]

Default: `9000`\
Maximum: `65535`\
Type: `number`

Sets IPv4 port on which server will be running and listening for requests.

### --token [TOKEN]

Type: `string:required`

Sets the token to validate server request.

### --dir [DIR_PATH]

Type: `string:required`

Sets the `absoulte` path to target deploy GIT repository.

### --command [COMMANDS]

Default: `bash ./deploy.sh`\
Type: `string`

Pass commands that needs to run after pull from repository/to deploy, e.g. `--command "npm install && npm run build"`.
If nothing passed to `--command` it will fallback to command `bash ./deploy.sh` so you need to manually create this script with all needed commands.

### --branch [BRANCH_NAME]

Default: `master`\
Type: `string`

Sets the working branch for target deploy GIT repository.

## LICENSE

MIT
## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/19878951?v=4" width="100px;" alt="Pavlo Ekshmidt"/><br /><sub><b>Paul Ekshmidt</b></sub>](https://kurzdor.me)<br />[💻](https://github.com/Kurzdor/nodeployed/commits?author=Kurzdor "Code") [📖](https://github.com/Kurzdor/nodeployed/commits?author=Kurzdor "Documentation") [🚧](#maintenance-Kurzdor "Maintenance") [🤔](#ideas-Kurzdor "Ideas, Planning, & Feedback") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
