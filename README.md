<div align="center">
  <h1>📦 nodeployed</h1>
  Automatically deploy your code to server after push to repository.
</div>

<hr />

## Another deployer?!

I wanted to make easily the process of deploying code to server on each push to repository. I tried almost all suggested ways to do it but they didn't work. So I created this package. It supports Ubuntu servers and Bitbucket (GitHub and GitLab support in progress!) repos.

## Server preparation

To be able to use it sucessfully, you need:

- Install Node.js and npm on your server


- Setup your Apache/NGINX server to _reverse proxy_ all requests to `http://localhost:YOUR_PORT` in `location` block:

- For NGINX change your server block config to something like this:

```nginx
# Your server in /etc/nginx/sites-available/example.com
server {
...
    location / {
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

- For Apache2:

```apache
<VirtualHost *:*>
    ProxyPass / http://0.0.0.0:3000/
    ServerName localhost
</VirtualHost>
```

- Optionally: [Install LetsEncrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04) on that domain that you will use.
- Clone repository that you want to work with with `git clone`
- Run `sudo chown -R yourusername:webserverusername you-repo-dir-name/` for your repository directory to make script able to fully use `git` commands.

## Usage

There is two ways to install it:

- Install globally via `npm` or `yarn` and start the process with [pm2](http://pm2.keymetrics.io/):

```sh
npm i -g nodeployed pm2
pm2 start nodeployed [your settings]

```

```sh
yarn add global nodeployed pm2
pm2 start nodeployed [your settings]
```

- Run without instalation with `NPX`