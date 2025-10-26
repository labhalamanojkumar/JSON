Best practice: Trusting a private or self-signed MongoDB CA (Coolify)

Summary
-------
If your MongoDB server uses a certificate signed by a private or self-signed CA (typical for private VPS and self-hosted Mongo), the best practice is to provide the CA certificate to your application container and configure the MongoDB driver to trust it. This is more secure than disabling verification (tlsAllowInvalidCertificates).

Recommended approach (Coolify)
------------------------------
1. Obtain the CA PEM file that signed your Mongo server certificate (e.g. `mongo-ca.pem`).
2. In the Coolify app settings, mount the CA file into the running container, e.g. mount to `/etc/ssl/certs/mongo-ca.pem`.
   - Use Coolify's file/secret mount functionality if available. If not available, consider building a small image variant that copies the CA into the image (see alternative below).
3. In Coolify environment variables, set the following (no surrounding quotes):
   - `MONGO_TLS_CA_FILE=/etc/ssl/certs/mongo-ca.pem`
   - `MONGODB_URI=mongodb://<user>:<pass>@<host>:1422/?directConnection=true&tls=true`
   - `MONGODB_DB=jsonformatter`
   - `ADMIN_TOKEN=<your token>` (or `GENERATE_ADMIN_TOKEN=1` to have the container create one on first run)
4. Redeploy your app. The runtime will read the CA file and pass it to the MongoDB driver so the TLS certificate chain validates.

Verification
------------
- Use the diagnostics endpoint we added after deployment:
  - `GET /api/admin/diag` — the JSON shows per-host TCP checks and a short Mongo `ping`. If the CA is trusted, `mongoAttempt.ok` should be `true`.

- From inside the container shell (if available):

```bash
# TCP check
nc -vz <mongo-host> 1422
# TLS check (uses the CA file you mounted)
echo | openssl s_client -connect <mongo-host>:1422 -CAfile /etc/ssl/certs/mongo-ca.pem
```

Alternatives (if mounting isn't available)
-----------------------------------------
- Bake the CA into your image at build time (less ideal for secrets):

  Dockerfile snippet:

  ```dockerfile
  # Copy the CA into the image (ensure CA remains private)
  COPY mongo-ca.pem /etc/ssl/certs/mongo-ca.pem
  ENV MONGO_TLS_CA_FILE=/etc/ssl/certs/mongo-ca.pem
  ```

- Pass the CA PEM as an environment variable `MONGO_TLS_CA_PEM` (less secure). If you'd like this flow, I can add code to accept `MONGO_TLS_CA_PEM` and load it at runtime.

Security note
-------------
- Do not use `MONGO_TLS_ALLOW_INVALID=true` in production — it disables certificate verification. Prefer mounting the CA and enabling proper validation.

If you want, I can also:
- Add support for `MONGO_TLS_CA_PEM` environment variable to avoid mounts.
- Add a small Dockerfile example that bakes the CA into an image for Coolify.
- Produce step-by-step Coolify UI copy/paste values for your deployment.
