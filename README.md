# dotenvpatch

Patch a .env file (provided in stdin), adding/replacing env vars (with `--set`) and removing env vars (with `--unset`).

```sh
npm install --global dotenvpatch
```

Example usage:

```sh
> echo 'NODE_ENV=production\nGREETING=hi' | dotenvpatch --set GREETING=hiiii FAREWELL=byeee --unset NODE_ENV
GREETING=hiiii
FAREWELL=byeee
```
